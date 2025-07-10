"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Globe, Paperclip, Send, X, FileText, Image } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleActivate = () => {
    setIsActive(true);
    setTimeout(() => {
      inputRef.current?.focus();
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

  const hasContent = inputValue || attachedFiles.length > 0;

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      border: "1px solid hsl(var(--border))",
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18
      }
    },
    expanded: {
      height: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      border: "1px solid hsl(var(--border))",
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 18
      }
    }
  };

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
      <div className={`w-full py-4 ${className || ""}`}>
        <motion.div 
          ref={wrapperRef} 
          className="w-full" 
          variants={containerVariants} 
          animate={isActive || hasContent ? "expanded" : "collapsed"} 
          initial="collapsed" 
          style={{
            overflow: "hidden",
            borderRadius: 16,
            backgroundColor: "hsl(var(--card))",
            borderColor: isActive || hasContent ? "hsl(var(--border))" : "hsl(var(--border))"
          }} 
          onClick={handleActivate}
        >
          <div className="flex flex-col items-stretch w-full h-full">
            {/* Attached Files Display */}
            {attachedFiles.length > 0 && (
              <div className="px-4 pt-3 pb-2 border-b border-border">
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                      {file.type === 'application/pdf' ? (
                        <FileText className="h-4 w-4 text-red-500" />
                      ) : (
                        <Image className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="truncate max-w-32">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="hover:bg-accent rounded-full p-0.5 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center h-full">
              <div className="flex items-center gap-2 p-3 rounded-full max-w-full w-full my-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="p-2 rounded-full hover:bg-accent transition text-muted-foreground" 
                      title="Attach file" 
                      type="button" 
                      tabIndex={-1}
                      onClick={handleFileAttach}
                    >
                      <Paperclip size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach PDF or image file</p>
                  </TooltipContent>
                </Tooltip>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
    
                <div className="relative flex-1">
                  <input 
                    ref={inputRef} 
                    type="text" 
                    value={inputValue} 
                    onChange={e => setInputValue(e.target.value)} 
                    className="flex-1 border-0 outline-none rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground focus:outline-none focus:ring-0 focus:border-0"
                    style={{
                      position: "relative",
                      zIndex: 1
                    }} 
                  />
                  <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                    <AnimatePresence mode="wait">
                      {showPlaceholder && !isActive && !inputValue && <motion.span key={placeholderIndex} className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none" style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      zIndex: 0
                    }} variants={placeholderContainerVariants} initial="initial" animate="animate" exit="exit">
                          {PLACEHOLDERS[placeholderIndex].split("").map((char, i) => <motion.span key={i} variants={letterVariants} style={{
                        display: "inline-block"
                      }}>
                                {char === " " ? "\u00A0" : char}
                              </motion.span>)}
                        </motion.span>}
                    </AnimatePresence>
                  </div>
                </div>
    
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      className="flex items-center gap-1 bg-muted hover:bg-accent text-foreground p-2 rounded-full font-medium justify-center transition-colors" 
                      title="Send" 
                      type="submit" 
                      tabIndex={-1}
                      disabled={!inputValue.trim() && attachedFiles.length === 0}
                    >
                      <Send size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send a message</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </form>
    
            <motion.div className="w-full flex justify-start px-4 items-center text-sm" variants={{
            hidden: {
              opacity: 0,
              y: 20,
              pointerEvents: "none" as const,
              transition: {
                duration: 0.25
              }
            },
            visible: {
              opacity: 1,
              y: 0,
              pointerEvents: "auto" as const,
              transition: {
                duration: 0.35,
                delay: 0.08
              }
            }
          }} initial="hidden" animate={isActive || hasContent ? "visible" : "hidden"} style={{
            marginTop: 8
          }}>
              <div className="flex gap-3 items-center py-[4px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button 
                      className={`flex items-center px-4 gap-2 py-1.5 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
                        deepSearchActive 
                          ? "bg-[#00A3FF]/10 outline outline-1 outline-[#00A3FF]/40 text-[#00A3FF]" 
                          : "bg-accent text-muted-foreground hover:bg-accent"
                      }`}
                      title="Search" 
                      type="button" 
                      onClick={e => {
                        e.stopPropagation();
                        setDeepSearchActive(a => !a);
                      }} 
                      initial={false} 
                      animate={{
                        width: deepSearchActive ? 85 : 36,
                        paddingLeft: deepSearchActive ? 8 : 9
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <Globe 
                          size={16} 
                          className={deepSearchActive ? "text-[#00A3FF]" : "text-muted-foreground"} 
                        />
                      </div>
                      <motion.span 
                        className="text-xs" 
                        initial={false} 
                        animate={{
                          opacity: deepSearchActive ? 1 : 0
                        }}
                      >
                        Search
                      </motion.span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search the web</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export { AIChatInput };
