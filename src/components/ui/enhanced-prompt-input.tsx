import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Globe, Send, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from '@/components/prompt-kit/prompt-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AI_MODELS = [
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "openai/gpt-5", label: "GPT-5" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini" },
  { value: "openai/gpt-5-nano", label: "GPT-5 Nano" },
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
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.5-flash');
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
    <div className={className}>
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
        className="relative"
      >
        <div className="relative">
          <PromptInputTextarea
            placeholder="Ask Shattara AI anything"
            className="min-h-[56px] pr-12"
          />

          {/* Send Button */}
          <motion.div
            className="absolute bottom-3 right-3 z-30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: hasContent ? 1 : 0.8,
              opacity: hasContent ? 1 : 0.3,
            }}
            transition={{ duration: 0.2 }}
          >
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!hasContent}
              className="h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Toolbar */}
        <PromptInputActions className="flex items-center justify-between w-full px-3 pb-2 pt-1">
          <div className="flex items-center gap-2">
            <PromptInputAction tooltip="Attach files" side="top">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFileAttach}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Attach</span>
              </Button>
            </PromptInputAction>

            <PromptInputAction tooltip="Search the web" side="top">
              <Button
                variant={deepSearchActive ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setDeepSearchActive(!deepSearchActive)}
                className="h-8 text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Search</span>
              </Button>
            </PromptInputAction>
          </div>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[180px] h-8 text-xs border-border bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value} className="text-xs">
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PromptInputActions>
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
    </div>
  );
}
