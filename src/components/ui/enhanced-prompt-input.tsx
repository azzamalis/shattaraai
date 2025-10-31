import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Globe, ArrowUp, MoreHorizontal, Mic, X, FileText, Image as ImageIcon, ChevronDown, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from '@/components/prompt-kit/prompt-input';

const AI_MODELS = [
  { value: "auto", label: "Auto", isPremium: false },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini", isPremium: false },
  { value: "anthropic/claude-sonnet-4-5", label: "Claude 4.5 Sonnet", isPremium: true },
  { value: "openai/gpt-5", label: "GPT-5", isPremium: true },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", isPremium: true },
  { value: "xai/grok-4", label: "Grok 4", isPremium: true },
];

interface EnhancedPromptInputProps {
  onSubmit?: (value: string, files?: File[]) => void;
  className?: string;
}

const filePreviewVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: -20,
    transition: { duration: 0.2 },
  },
};

function FilePreviewCard({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');

  return (
    <motion.div
      variants={filePreviewVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
    >
      <div className="flex-shrink-0">
        {isPDF ? (
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
        ) : isImage ? (
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-blue-500" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

export function EnhancedPromptInput({ onSubmit, className }: EnhancedPromptInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-5-mini');
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0;

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      return isPDF || isImage;
    });

    if (validFiles.length !== files.length) {
      console.warn('Some files were filtered out. Only PDF and image files are allowed.');
    }

    setAttachedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (hasContent) {
      onSubmit?.(inputValue, attachedFiles.length > 0 ? attachedFiles : undefined);
      setInputValue('');
      setAttachedFiles([]);
    }
  };

  return (
    <>
      {/* File Previews */}
      <AnimatePresence mode="popLayout">
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2"
          >
            {attachedFiles.map((file, index) => (
              <FilePreviewCard
                key={`${file.name}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input */}
      <PromptInput
        value={inputValue}
        onValueChange={setInputValue}
        onSubmit={handleSubmit}
        className={className || "border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"}
      >
        <div className="flex flex-col">
          <PromptInputTextarea
            placeholder="Ask Shattara AI anything"
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3]"
          />

          <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
            <div className="flex items-center gap-2">
              <PromptInputAction tooltip="Attach files">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFileAttach}
                  className="size-9 rounded-full"
                >
                  <Plus size={18} />
                </Button>
              </PromptInputAction>

              <PromptInputAction tooltip="Search the web">
                <Button
                  variant="ghost"
                  onClick={() => setDeepSearchActive(!deepSearchActive)}
                  className={`rounded-full ${deepSearchActive ? 'bg-primary/5 text-primary hover:bg-primary/5 hover:text-primary' : ''}`}
                >
                  <Globe size={18} />
                  Search
                </Button>
              </PromptInputAction>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-between h-7 p-1.5 w-fit border-none focus:border-none focus:ring-0 focus:outline-none focus:ring-offset-0 text-primary/60 bg-transparent transition-all hover:bg-primary/5 dark:hover:bg-primary/10 rounded-full mb-1"
                  >
                    <div className="flex items-center text-xs mr-1 pl-0.5">
                      <Sparkles className="h-4 w-4 flex-shrink-0 block md:hidden" />
                      <span className="capitalize md:block hidden">
                        {AI_MODELS.find(model => model.value === selectedModel)?.label}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-auto rounded-2xl p-2 space-y-1.5">
                  {AI_MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.value}
                      onClick={() => setSelectedModel(model.value)}
                      className={`flex items-center justify-between rounded-xl ${selectedModel === model.value ? 'bg-accent' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {selectedModel === model.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
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

              <PromptInputAction tooltip="Voice input">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  disabled
                >
                  <Mic size={18} />
                </Button>
              </PromptInputAction>

              <Button
                size="icon"
                disabled={!hasContent}
                onClick={handleSubmit}
                className="size-9 rounded-full"
              >
                <ArrowUp size={18} />
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
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}
