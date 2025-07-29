
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Send, Loader2, Paperclip, X, Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChatInputProps {
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

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  className
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("Claude 4 Sonnet");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(inputValue.trim(), attachments);
      setInputValue('');
      setAttachments([]);
      
      // Refocus the textarea after sending the message
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    // Reset the input so the same file can be selected again
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
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-card dark:bg-card border border-border dark:border-border rounded-lg">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-muted dark:bg-muted text-muted-foreground dark:text-muted-foreground rounded-md text-sm"
            >
              <span className="truncate max-w-32">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[44px] max-h-32 resize-none",
              "bg-background dark:bg-background text-foreground dark:text-foreground",
              "border-border dark:border-border",
              "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
              "focus:border-primary dark:focus:border-primary focus:ring-primary/20 dark:focus:ring-primary/20"
            )}
            rows={1}
          />
        </div>

        {/* Brain AI Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline" 
              size="sm"
              disabled={disabled}
              className={cn(
                "h-11 px-3",
                "bg-background dark:bg-background text-foreground dark:text-foreground",
                "border-border dark:border-border",
                "hover:bg-muted dark:hover:bg-muted",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Brain className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48">
            {AI_MODELS.map((model) => (
              <DropdownMenuItem
                key={model}
                onClick={() => setSelectedModel(model)}
                className={selectedModel === model ? "bg-accent" : ""}
              >
                {model}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* File Attachment Button */}
        <Button
          type="button"
          variant="outline" 
          size="sm"
          disabled={disabled}
          onClick={triggerFileSelect}
          className={cn(
            "h-11 px-3",
            "bg-background dark:bg-background text-foreground dark:text-foreground",
            "border-border dark:border-border",
            "hover:bg-muted dark:hover:bg-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || (!inputValue.trim() && attachments.length === 0)}
          size="sm"
          className={cn(
            "h-11 px-4",
            "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground",
            "hover:bg-primary/90 dark:hover:bg-primary/90",
            "disabled:bg-muted dark:disabled:bg-muted disabled:text-muted-foreground dark:disabled:text-muted-foreground",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </form>
  );
}
