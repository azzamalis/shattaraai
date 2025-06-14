
"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatInputField } from "./ChatInputField";
import { SearchToggle } from "./SearchToggle";
import { PLACEHOLDERS } from "./constants";
import { AIChatInputProps } from "./types";

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

  return (
    <TooltipProvider>
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-accent transition text-muted-foreground" title="Attach file" type="button" tabIndex={-1}>
                      <Paperclip size={18} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach a file</p>
                  </TooltipContent>
                </Tooltip>

                <ChatInputField
                  inputRef={inputRef}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  placeholderText={PLACEHOLDERS[placeholderIndex]}
                  showPlaceholder={showPlaceholder}
                  isActive={isActive}
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="flex items-center gap-1 bg-muted hover:bg-accent text-foreground p-2 rounded-full font-medium justify-center transition-colors"
                      title="Send"
                      type="submit"
                      tabIndex={-1}
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

            <motion.div
              className="w-full flex justify-start px-4 items-center text-sm"
              variants={{
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
              }}
              initial="hidden"
              animate={isActive || inputValue ? "visible" : "hidden"}
              style={{
                marginTop: 8
              }}
            >
              <div className="flex gap-3 items-center py-[4px]">
                <SearchToggle
                  deepSearchActive={deepSearchActive}
                  onToggle={() => setDeepSearchActive(a => !a)}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
};

export { AIChatInput };
