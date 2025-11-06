import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Paperclip, AtSign, Search, ChevronDown, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelAndContextControlsProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onFileAttach: () => void;
  onCommandTrigger?: () => void;
  onSearchToggle?: () => void;
  searchActive?: boolean;
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

export function ModelAndContextControls({
  selectedModel,
  onModelSelect,
  onFileAttach,
  onCommandTrigger,
  onSearchToggle,
  searchActive = false,
  userPlan = 'free',
}: ModelAndContextControlsProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {/* File Attachment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onFileAttach}
        className="h-8 px-2 text-[#A6A6A6] hover:text-[#FFF] hover:bg-[#DDDDDD]/10 rounded-lg"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {/* Quick Commands */}
      {onCommandTrigger && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCommandTrigger}
          className="h-8 px-2 text-[#A6A6A6] hover:text-[#FFF] hover:bg-[#DDDDDD]/10 rounded-lg"
        >
          <AtSign className="h-4 w-4" />
        </Button>
      )}

      {/* Web Search Toggle */}
      {onSearchToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onSearchToggle}
          className={cn(
            "h-8 px-2 rounded-lg transition-colors",
            searchActive
              ? "bg-[#00A3FF]/10 text-[#00A3FF] hover:bg-[#00A3FF]/20 hover:text-[#00A3FF]"
              : "text-[#A6A6A6] hover:text-[#FFF] hover:bg-[#DDDDDD]/10"
          )}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}

      {/* AI Model Selector */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 gap-1 text-[#A6A6A6] hover:text-[#FFF] hover:bg-[#DDDDDD]/10 rounded-lg"
            >
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 md:hidden" />
              <span className="text-xs hidden md:inline">
                {AI_MODELS.find(m => m.value === selectedModel)?.label || 'Select Model'}
              </span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48 rounded-xl p-1.5 bg-[#4B4B4B] border-[#A6A6A6]/20">
            {AI_MODELS.map((model) => (
              <DropdownMenuItem
                key={model.value}
                onClick={() => onModelSelect(model.value)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-1.5 cursor-pointer",
                  selectedModel === model.value ? "bg-[#00A3FF]/10" : "hover:bg-[#DDDDDD]/10"
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedModel === model.value && <Check className="h-3.5 w-3.5 text-[#00A3FF]" />}
                  <span className="text-sm text-[#FFF]">{model.label}</span>
                </div>
                {model.isPremium && userPlan === 'free' && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#0E8345]/20 text-[#0E8345] font-medium">
                    Pro
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
