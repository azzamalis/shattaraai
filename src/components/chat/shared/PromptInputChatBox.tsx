import React, { useState, useRef, ChangeEvent } from 'react';
import { CommandDropdown } from '@/components/chat/CommandDropdown';
import { CommandOption } from '@/lib/types';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowUp, Plus, Mic, AtSign, Brain, X, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputChatBoxProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const AI_MODELS = [
  "Gemini 2.5 Flash",
  "Claude 4 Sonnet", 
  "GPT4.1",
  "Gemini 2.5 Pro",
  "Grok4",
  "GPT4.1 Mini"
];

const commandOptions: CommandOption[] = [
  // Learning category
  { id: 'quiz', label: 'Quiz', description: 'Generate a quiz', category: 'Learning' },
  { id: 'flashcards', label: 'Flashcards', description: 'Create flashcards', category: 'Learning' },
  { id: 'timeline', label: 'Timeline', description: 'Create timeline', category: 'Learning' },
  
  // Charts category
  { id: 'bar-chart', label: 'Bar Chart', description: 'Generate bar chart', category: 'Charts' },
  { id: 'line-chart', label: 'Line Chart', description: 'Generate line chart', category: 'Charts' },
  { id: 'pie-chart', label: 'Pie Chart', description: 'Generate pie chart', category: 'Charts' },
  
  // Diagrams category
  { id: 'venn-diagram', label: 'Venn Diagram', description: 'Create Venn diagram', category: 'Diagrams' },
  { id: 'flow-chart', label: 'Flow Chart', description: 'Create flow chart', category: 'Diagrams' },
  { id: 'mind-map', label: 'Mind Map', description: 'Create mind map', category: 'Diagrams' }
];

export function PromptInputChatBox({
  onSendMessage,
  disabled = false,
  placeholder = "Ask anything...",
  className
}: PromptInputChatBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("Claude 4 Sonnet");
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((inputValue.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(inputValue.trim(), attachments);
      setInputValue('');
      setAttachments([]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-card border border-border rounded-lg">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-md text-sm"
            >
              <span className="truncate max-w-32">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Prompt Input */}
      <PromptInput
        isLoading={disabled}
        value={inputValue}
        onValueChange={setInputValue}
        onSubmit={handleSubmit}
        className="border-input bg-popover relative w-full rounded-3xl border p-0 pt-1 shadow-sm"
      >
        <div className="flex flex-col">
          <PromptInputTextarea
            placeholder={placeholder}
            className="min-h-[44px] pt-3 pl-4 pr-4 text-base leading-[1.3]"
            disabled={disabled}
          />

          <PromptInputActions className="mt-3 flex w-full items-center justify-between gap-2 px-3 pb-3">
            <div className="flex items-center gap-2">
              <PromptInputAction tooltip="Attach files">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  onClick={triggerFileSelect}
                  type="button"
                >
                  <Plus size={18} />
                </Button>
              </PromptInputAction>

              <div className="relative">
                <PromptInputAction tooltip="Quick commands">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full"
                    type="button"
                    onClick={() => setShowCommandDropdown(!showCommandDropdown)}
                  >
                    <AtSign size={18} />
                  </Button>
                </PromptInputAction>
                
                {showCommandDropdown && (
                  <CommandDropdown
                    commands={commandOptions}
                    onSelect={(command) => {
                      setInputValue(prev => `${prev}${prev ? ' ' : ''}Create a ${command.label} on`);
                      setShowCommandDropdown(false);
                    }}
                    onClose={() => setShowCommandDropdown(false)}
                  />
                )}
              </div>

              <PromptInputAction tooltip={selectedModel}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9 w-fit px-2 gap-1 rounded-full text-primary/60 hover:text-primary/80 hover:bg-transparent"
                      type="button"
                    >
                      <Sparkles className="h-4 w-4 flex-shrink-0 block md:hidden" />
                      <span className="text-xs capitalize md:block hidden">
                        {selectedModel}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top" className="w-auto rounded-2xl p-2 space-y-1.5">
                    {AI_MODELS.map((model) => (
                      <DropdownMenuItem
                        key={model}
                        onClick={() => setSelectedModel(model)}
                        className={`rounded-xl ${selectedModel === model ? "bg-accent" : ""}`}
                      >
                        {model}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PromptInputAction>
            </div>

            <div className="flex items-center gap-2">
              <PromptInputAction tooltip="Voice input (coming soon)">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  disabled
                  type="button"
                >
                  <Mic size={18} />
                </Button>
              </PromptInputAction>

              <Button
                size="icon"
                disabled={disabled || (!inputValue.trim() && attachments.length === 0)}
                onClick={handleSubmit}
                className="size-9 rounded-full"
                type="button"
              >
                {disabled ? (
                  <span className="size-3 rounded-xs bg-white" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </Button>
            </div>
          </PromptInputActions>
        </div>
      </PromptInput>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
