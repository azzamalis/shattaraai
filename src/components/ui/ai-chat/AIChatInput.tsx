
"use client" 

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlaceholderText } from "./PlaceholderText";
import { InputControls } from "./InputControls";
import { containerVariants } from "./animations";

interface AIChatInputProps {
  onSubmit?: (value: string) => void;
  className?: string;
  initialIsActive?: boolean;
}

export const AIChatInput = ({ 
  onSubmit, 
  className, 
  initialIsActive = false 
}: AIChatInputProps) => {
  const [isActive, setIsActive] = useState(initialIsActive);
  const [aiThinkingActive, setAiThinkingActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
 
  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
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
 
  return (
    <div className={`w-full mt-8 ${className || ""}`}>
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
          marginBottom: 8
        }}
        onClick={handleActivate}
      >
        <div className="flex flex-col items-stretch w-full h-full">
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center h-full">
            <div 
              className={`flex items-center gap-2 p-3 rounded-full bg-transparent border-2 border-white/20 hover:border-primary/50 transition-colors max-w-full w-full ${isActive ? 'shadow-[0_0_0_2px_rgba(35,35,255,0.2)]' : ''}`}
              style={{ borderWidth: '2px', borderStyle: 'solid' }}
            >
              <PlaceholderText 
                inputValue={inputValue}
                isActive={isActive}
                inputRef={inputRef}
                setInputValue={setInputValue}
                handleActivate={handleActivate}
              />
              <InputControls handleSubmit={handleSubmit} />
            </div>
          </form>
 
          {/* Expanded Controls */}
          <motion.div
            className="w-full flex justify-start px-4 items-center text-sm"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: "none" as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial="hidden"
            animate={isActive || inputValue ? "visible" : "hidden"}
            style={{ marginTop: 8 }}
          >
            <InputControls.ExpandedControls 
              aiThinkingActive={aiThinkingActive}
              setAiThinkingActive={setAiThinkingActive}
              deepSearchActive={deepSearchActive}
              setDeepSearchActive={setDeepSearchActive}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
