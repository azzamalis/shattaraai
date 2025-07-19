"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Globe, Paperclip, Send, X, FileText, Image, Plus, ChevronDown, ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PLACEHOLDERS = ["Ask Shattara AI about any topic...", "How can I prepare for my biology exam?", "Create flashcards about neural networks", "Explain quantum physics in simple terms", "Summarize this research paper", "Prepare a study plan for my finals"];

interface AIChatInputProps {
  onSubmit?: (value: string, files?: File[]) => void;
  className?: string;
  initialIsActive?: boolean;
}

const AIChatInput = ({
  onSubmit,
  className,
  initialIsActive = false
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState("Claude 3.5 Sonnet");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        if (!inputValue) setIsActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleActivate = () => {
    setIsActive(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isPDF = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      return isPDF || isImage;
    });
    
    setAttachedFiles(prev => [...prev, ...validFiles]);
    
    // Clear the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    if (onSubmit) {
      onSubmit(inputValue, attachedFiles.length > 0 ? attachedFiles : undefined);
    }
    setInputValue("");
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = inputValue || attachedFiles.length > 0;

  // Animation variants for placeholder text
  const placeholderContainerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.025
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.015,
        staggerDirection: -1
      }
    }
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: {
          duration: 0.25
        },
        filter: {
          duration: 0.4
        },
        y: {
          type: "spring" as const,
          stiffness: 80,
          damping: 20
        }
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: {
          duration: 0.2
        },
        filter: {
          duration: 0.3
        },
        y: {
          type: "spring" as const,
          stiffness: 80,
          damping: 20
        }
      }
    }
  };

  return (
    <TooltipProvider>
      <div className={`w-full max-w-4xl mx-auto ${className || ""}`} ref={wrapperRef}>
        {/* File Preview Cards */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-3 space-y-2"
            >
              {attachedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {file.type === 'application/pdf' ? (
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Image className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-8 w-8 p-0 hover:bg-accent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Input Container */}
        <div className="relative">
          <div
            className={`
              relative rounded-xl border bg-card shadow-sm transition-all duration-200
              ${isActive || hasContent ? 'border-border shadow-md' : 'border-border'}
              ${isActive ? 'ring-1 ring-ring/20' : ''}
            `}
            onClick={handleActivate}
          >
            {/* Main Input Area */}
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder=""
                className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent p-4 pr-12 text-base placeholder:text-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ lineHeight: '1.5' }}
              />
              
              {/* Animated Placeholder */}
              {!inputValue && !isActive && (
                <div className="absolute inset-0 flex items-center px-4 pointer-events-none">
                  <AnimatePresence mode="wait">
                    {showPlaceholder && (
                      <motion.span
                        key={placeholderIndex}
                        className="text-muted-foreground"
                        variants={placeholderContainerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        {PLACEHOLDERS[placeholderIndex].split("").map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Send Button */}
              <div className="absolute bottom-2 right-2">
                <Button
                  type="submit"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() && attachedFiles.length === 0}
                  className={`
                    h-8 w-8 p-0 rounded-lg transition-all duration-200
                    ${hasContent 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                    }
                  `}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Bottom Toolbar */}
            <AnimatePresence>
              {(isActive || hasContent) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Attach File Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFileAttach}
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach files</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Deep Search Toggle */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={deepSearchActive ? "default" : "ghost"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeepSearchActive(!deepSearchActive);
                            }}
                            className={`h-8 px-3 text-xs ${
                              deepSearchActive 
                                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                                : 'hover:bg-accent'
                            }`}
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Search
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search the web</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {/* Model Selector */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">Model:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs font-medium hover:bg-accent"
                      >
                        {selectedModel}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export { AIChatInput };
