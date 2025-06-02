"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Globe, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = ["Ask Shattara AI about any topic...", "How can I prepare for my biology exam?", "Create flashcards about neural networks", "Explain quantum physics in simple terms", "Summarize this research paper", "Prepare a study plan for my finals"];

interface AIChatInputProps {
  onSubmit?: (value: string) => void;
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    if (onSubmit) {
      onSubmit(inputValue);
    }
    setInputValue("");
  };

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
      border: "1px solid hsl(var(--border))",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    },
    expanded: {
      height: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      border: "1px solid hsl(var(--border))",
      transition: {
        type: "spring",
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
          type: "spring",
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
          type: "spring",
          stiffness: 80,
          damping: 20
        }
      }
    }
  };

  return (
    <div className={`w-full py-4 ${className || ""}`}>
      <motion.div 
        ref={wrapperRef} 
        className="w-full" 
        variants={containerVariants} 
        animate={isActive || inputValue ? "expanded" : "collapsed"} 
        initial="collapsed" 
        style={{
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: "hsl(var(--card))",
          borderColor: isActive || inputValue ? "hsl(var(--border))" : "hsl(var(--border))"
        }} 
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          <form onSubmit={handleSubmit} className="flex items-center h-full">
            <div className="flex items-center gap-2 p-3 rounded-full max-w-full w-full my-1">
              <button className="p-2 rounded-full hover:bg-accent transition text-muted-foreground" title="Attach file" type="button" tabIndex={-1}>
                <Paperclip size={18} />
              </button>
  
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
  
              <button 
                className="flex items-center gap-1 bg-muted hover:bg-accent text-foreground p-2 rounded-full font-medium justify-center transition-colors" 
                title="Send" 
                type="submit" 
                tabIndex={-1}
              >
                <Send size={16} />
              </button>
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
        }} initial="hidden" animate={isActive || inputValue ? "visible" : "hidden"} style={{
          marginTop: 8
        }}>
            <div className="flex gap-3 items-center py-[4px]">
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export { AIChatInput };
