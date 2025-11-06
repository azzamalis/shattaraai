import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { UpgradeModal } from "@/components/dashboard/UpgradeModal";
import { ModelAndContextControls } from "@/components/chat/ModelAndContextControls";
import { cn } from "@/lib/utils";

interface EnhancedPromptInputProps {
  onSubmit?: (value: string, files?: File[]) => void;
  className?: string;
  userPlan?: 'free' | 'pro'; // Default to 'free' if not provided
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
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = inputValue.trim().length > 0;
  const showControls = isFocused || hasContent || attachedFiles.length > 0;

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const isPDF = file.type === "application/pdf";
      const isImage = file.type.startsWith("image/");
      return isPDF || isImage;
    });

    if (validFiles.length !== files.length) {
      console.warn("Some files were filtered out. Only PDF and image files are allowed.");
    }

    setAttachedFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (inputValue.trim() || attachedFiles.length > 0) {
      onSubmit?.(inputValue, attachedFiles.length > 0 ? attachedFiles : undefined);
      setInputValue("");
      setAttachedFiles([]);
    }
  };

  const handleModelSelect = (modelValue: string) => {
    setSelectedModel(modelValue);
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto flex flex-col items-center gap-2", className)}>
      {/* File Previews */}
      <AnimatePresence mode="popLayout">
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full flex flex-wrap gap-2 p-3 bg-[#4B4B4B] border border-[#A6A6A6]/20 rounded-xl"
          >
            {attachedFiles.map((file, index) => (
              <FilePreviewCard key={`${file.name}-${index}`} file={file} onRemove={() => removeFile(index)} />
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
          placeholder="Ask Shattara AI anything"
          className="w-full min-h-[44px] max-h-[240px] resize-none rounded-2xl border border-[#A6A6A6] bg-[#4B4B4B] px-4 py-3 pr-12 text-sm text-[#FFF] placeholder:text-[#A6A6A6] focus-visible:ring-0 focus-visible:outline-none focus:border-[#00A3FF]/50 transition-all shadow-sm"
          rows={1}
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!inputValue.trim() && attachedFiles.length === 0}
          className="absolute right-2 top-2 h-8 w-8 rounded-full bg-[#4B4B4B] text-[#A6A6A6] hover:bg-[#00A3FF] hover:text-[#FFF] transition-colors p-0 disabled:opacity-50"
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
              onFileAttach={handleFileAttach}
              onSearchToggle={() => setDeepSearchActive(!deepSearchActive)}
              searchActive={deepSearchActive}
              userPlan={userPlan}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upgrade Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <UpgradeModal />
      </Dialog>
    </div>
  );
}
