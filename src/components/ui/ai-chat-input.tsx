"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Atom, Mic, Globe, Paperclip, Send } from "lucide-react";
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
  const [aiThinkingActive, setAiThinkingActive] = useState(false);
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
      border: "1px solid rgba(255, 255, 255, 0.1)",
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18
      }
    },
    expanded: {
      height: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16)",
      border: "1px solid rgba(35, 35, 255, 0.4)",
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
          background: "transparent",
          // Custom border styling to ensure visibility in unfocused state
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: isActive || inputValue ? "rgba(35, 35, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"
        }} 
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center h-full">
            {/* Input Row */}
            <div className="flex items-center gap-2 p-3 rounded-full max-w-full w-full my-1">
              <button className="p-2 rounded-full hover:bg-white/5 transition" title="Attach file" type="button" tabIndex={-1}>
                <Paperclip size={18} className="text-white/70" />
              </button>
  
              {/* Text Input & Placeholder */}
              <div className="relative flex-1">
                <input 
                  ref={inputRef} 
                  type="text" 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  className="flex-1 border-0 outline-none rounded-md py-2 text-base bg-transparent w-full font-normal text-white focus:outline-none focus:ring-0 focus:border-0"
                  style={{
                    position: "relative",
                    zIndex: 1
                  }} 
                />
                <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                  <AnimatePresence mode="wait">
                    {showPlaceholder && !isActive && !inputValue && <motion.span key={placeholderIndex} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none" style={{
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
  
              <button className="p-2 rounded-full hover:bg-white/5 transition" title="Voice input" type="button" tabIndex={-1}>
                <Mic size={18} className="text-white/70" />
              </button>
              <button 
                className="flex items-center gap-1 bg-[#00A3FF] hover:bg-[#00A3FF]/90 text-white p-2 rounded-full font-medium justify-center transition-colors" 
                title="Send" 
                type="submit" 
                tabIndex={-1}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
  
          {/* Expanded Controls */}
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
              {/* Think Toggle */}
              <button className={`flex items-center gap-1 px-4 py-1.5 rounded-full transition-all font-medium group ${aiThinkingActive ? "bg-primary/10 outline outline-primary/60 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`} title="AI Thinking" type="button" onClick={e => {
              e.stopPropagation();
              setAiThinkingActive(a => !a);
            }}>
                <Atom className={`transition-all ${aiThinkingActive ? "text-primary" : ""}`} size={16} />
                <span className="text-xs">AI Thinking</span>
              </button>
  
              {/* Deep Search Toggle */}
              <motion.button className={`flex items-center px-4 gap-1 py-1.5 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${deepSearchActive ? "bg-primary/10 outline outline-primary/60 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`} title="Deep Search" type="button" onClick={e => {
              e.stopPropagation();
              setDeepSearchActive(a => !a);
            }} initial={false} animate={{
              width: deepSearchActive ? 125 : 36,
              paddingLeft: deepSearchActive ? 8 : 9
            }}>
                <div className="flex-1">
                  <Globe size={16} className={deepSearchActive ? "text-primary" : ""} />
                </div>
                <motion.span className="pb-[2px] text-xs" initial={false} animate={{
                opacity: deepSearchActive ? 1 : 0
              }}>
                  Deep Search
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
