import React, { useState, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandDropdown } from '@/components/chat/CommandDropdown';
import { CommandOption } from '@/lib/types';
import { ModelAndContextControls } from '@/components/chat/ModelAndContextControls';
import { Button } from "@/components/ui/button";
import { Dialog } from '@/components/ui/dialog';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputChatBoxProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  userPlan?: 'free' | 'pro';
}

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
  className,
  userPlan = 'free'
}: PromptInputChatBoxProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("claude-4-sonnet");
  const [showCommandDropdown, setShowCommandDropdown] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = inputValue.trim().length > 0;
  const showControls = isFocused || hasContent || attachments.length > 0;

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

  const handleModelSelect = (modelValue: string) => {
    setSelectedModel(modelValue);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto flex flex-col items-center gap-2", className)}>
      {/* Attachments Preview */}
      <AnimatePresence mode="popLayout">
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex flex-wrap gap-2 p-3 bg-card border border-border rounded-xl"
          >
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-lg text-sm"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area - Always Visible */}
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            // Auto-resize
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
            }
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[44px] max-h-[240px] resize-none rounded-2xl border border-input bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none focus:border-primary/50 transition-all shadow-sm"
          rows={1}
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || (!inputValue.trim() && attachments.length === 0)}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors p-0 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Controls Section - Conditionally Rendered */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <ModelAndContextControls
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              onFileAttach={triggerFileSelect}
              onCommandTrigger={() => setShowCommandDropdown(!showCommandDropdown)}
              onSearchToggle={() => setSearchActive(!searchActive)}
              searchActive={searchActive}
              userPlan={userPlan}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Dropdown */}
      {showCommandDropdown && (
        <div className="relative w-full">
          <CommandDropdown
            commands={commandOptions}
            onSelect={(command) => {
              setInputValue(prev => `${prev}${prev ? ' ' : ''}Create a ${command.label} on`);
              setShowCommandDropdown(false);
            }}
            onClose={() => setShowCommandDropdown(false)}
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <UpgradeModal />
      </Dialog>
    </div>
  );
}
