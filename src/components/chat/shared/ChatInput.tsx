import React, { useState, useRef, ChangeEvent } from 'react';
import { Send, Loader2, Paperclip, X, Brain, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import { UpgradeModal } from '@/components/dashboard/UpgradeModal';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  userPlan?: 'free' | 'pro';
}

const AI_MODELS = [
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", isPremium: false },
  { value: "claude-4-sonnet", label: "Claude 4 Sonnet", isPremium: false },
  { value: "gpt-4.1-mini", label: "GPT4.1 Mini", isPremium: false },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", isPremium: true },
  { value: "grok-4", label: "Grok4", isPremium: true },
  { value: "gpt-4.1", label: "GPT4.1", isPremium: true },
];

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
  className,
  userPlan = 'free'
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("claude-4-sonnet");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(inputValue.trim(), attachments);
      setInputValue('');
      setAttachments([]);
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

  const handleModelSelect = (modelValue: string, isPremium: boolean) => {
    if (userPlan === 'free' && isPremium) {
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedModel(modelValue);
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
          <DropdownMenuContent align="end" side="top" className="w-48 bg-popover z-50">
            {AI_MODELS.map((model) => (
              <DropdownMenuItem
                key={model.value}
                onClick={() => handleModelSelect(model.value, model.isPremium)}
                className={cn(
                  "flex items-center justify-between",
                  selectedModel === model.value ? "bg-accent" : ""
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedModel === model.value && <Check className="h-4 w-4 text-primary" />}
                  <span>{model.label}</span>
                </div>
                {model.isPremium && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-medium">
                    Upgrade
                  </span>
                )}
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

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <UpgradeModal onClose={() => setUpgradeModalOpen(false)} />
      </Dialog>
    </form>
  );
}
