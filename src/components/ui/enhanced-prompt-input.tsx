import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AtSign,
  Paperclip,
  Mic,
  AudioLines,
  X,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { cn } from "@/lib/utils";

const AI_MODELS = [
  { value: "auto", label: "Auto", isPremium: false },
  { value: "google/gemini-3-flash", label: "Gemini 3 Flash", isPremium: false },
  { value: "anthropic/claude-sonnet-4-5", label: "Claude Sonnet 4.5", isPremium: true },
  { value: "openai/gpt-5-2", label: "GPT-5.2", isPremium: true },
  { value: "google/gemini-3-pro", label: "Gemini 3 Pro", isPremium: true },
  { value: "xai/grok-4-1", label: "Grok 4.1", isPremium: true },
];

interface EnhancedPromptInputProps {
  onSubmit?: (value: string, files?: File[]) => void;
  className?: string;
  userPlan?: 'free' | 'pro';
}

const filePreviewVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: -20,
    transition: { duration: 0.2 },
  },
};

function FilePreviewCard({ file, onRemove }: { file: File; onRemove: () => void }) {
  const isPDF = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

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
        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
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

export function EnhancedPromptInput({ onSubmit, className, userPlan = 'free' }: EnhancedPromptInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0;

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (hasContent) {
      onSubmit?.(inputValue, attachedFiles.length > 0 ? attachedFiles : undefined);
      setInputValue("");
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleModelSelect = (modelValue: string) => {
    const model = AI_MODELS.find(m => m.value === modelValue);
    if (model?.isPremium && userPlan === 'free') {
      setUpgradeModalOpen(true);
      return;
    }
    setSelectedModel(modelValue);
  };

  const selectedModelLabel = AI_MODELS.find((model) => model.value === selectedModel)?.label || "Auto";

  return (
    <>
      {/* File Previews */}
      <AnimatePresence mode="popLayout">
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 space-y-2 px-6 sm:px-3"
          >
            {attachedFiles.map((file, index) => (
              <FilePreviewCard key={`${file.name}-${index}`} file={file} onRemove={() => removeFile(index)} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative mx-auto mt-0 flex w-full flex-col items-end justify-center space-y-1",
          "rounded-3xl border bg-white px-6 sm:px-3",
          "shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-150",
          "focus-within:border dark:border-primary/10 dark:bg-neutral-800/50",
          "hover:dark:border-neutral-700/40",
          className
        )}
      >
        <div className="flex w-full flex-col">
          {/* Textarea Row */}
          <div className="mt-3 flex w-full items-center">
            <div className="relative w-full text-sm focus-within:ring-none focus-within:outline-none">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Learn anything"
                rows={1}
                className={cn(
                  "outline-none mx-1.5 mb-1.5 max-h-48 w-full resize-none overflow-y-auto",
                  "overscroll-y-none text-base border-transparent bg-transparent",
                  "focus-within:ring-0 placeholder:text-primary/50",
                  "text-foreground"
                )}
                style={{ 
                  minHeight: '24px',
                  height: 'auto'
                }}
              />
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="flex flex-row items-end justify-between transition-all opacity-70 hover:opacity-100">
            {/* Left Actions */}
            <div className="mb-0.5 flex flex-wrap items-center space-x-0.5">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-between border-none text-sm",
                      "h-7 p-1.5 w-fit focus:border-none focus:ring-0 focus:outline-none",
                      "mb-1 rounded-full bg-transparent text-primary/60",
                      "transition-all hover:bg-primary/5 dark:hover:bg-primary/10"
                    )}
                  >
                    <div className="mr-1 flex items-center pl-0.5 text-xs">
                      <Sparkles className="block h-4 w-4 flex-shrink-0 md:hidden" />
                      <span className="hidden capitalize md:block">{selectedModelLabel}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  side="top" 
                  className="w-auto rounded-2xl p-2 space-y-1 bg-popover z-50"
                >
                  {AI_MODELS.map((model) => (
                    <DropdownMenuItem
                      key={model.value}
                      onClick={() => handleModelSelect(model.value)}
                      className={cn(
                        "flex items-center justify-between rounded-xl gap-4",
                        selectedModel === model.value && "bg-accent"
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

              {/* Add Context Button */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
                    "ring-offset-background transition-colors focus-visible:outline-none",
                    "disabled:pointer-events-none disabled:opacity-50",
                    "group mb-1 h-7 w-fit gap-1 rounded-full border p-1.5",
                    "text-primary/60 hover:bg-primary/5 hover:text-primary/70",
                    "focus:outline-none focus:ring-0 focus:ring-offset-0",
                    "dark:border-neutral-700/80 dark:hover:bg-primary/10"
                  )}
                >
                  <AtSign className="h-4 w-4 flex-shrink-0" />
                  <span className="ml-0.5 mr-0.5 truncate text-xs capitalize">Add Context</span>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center">
              {/* File Upload */}
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="mb-1 rounded-md p-2 text-primary/50 opacity-100 hover:bg-muted">
                  <Paperclip className="h-4 w-4 flex-shrink-0 -rotate-45" />
                </div>
              </label>
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/m4a,audio/x-m4a,audio/webm,audio/mov,audio/*,video/mp4,video/webm,video/mpeg,video/avi,video/mov,image/jpeg,image/jpeg,image/png,image/bmp,image/webp,image/svg+xml,image/heic,image/heif,.pdf,.ppt,.pptx,.doc,.docx,.txt,.mp3,.wav,.ogg,.m4a,.webm,.mov,.mp4,.webm,.mpeg,.avi,.mov,.jpg,.jpeg,.png,.bmp,.webp,.svg,.heic,.heif,image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Mic Button */}
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
                  "ring-offset-background transition-colors focus-visible:outline-none",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "hover:text-accent-foreground h-8 w-8 mb-1 mr-1 rounded-md p-2",
                  "text-primary/50 opacity-100 hover:bg-muted"
                )}
              >
                <Mic className="h-5 w-5" />
              </button>

              {/* Voice Button */}
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
                  "ring-offset-background transition-colors focus-visible:outline-none",
                  "disabled:pointer-events-none disabled:opacity-50",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "relative mb-2 h-fit space-x-1 rounded-full p-1.5 px-2"
                )}
                title="Voice Mode"
                aria-label="Voice Mode"
              >
                <AudioLines className="h-5 w-5" />
                <span className="text-sm">Voice</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <UpgradeModal />
      </Dialog>
    </>
  );
}
