
import React, { useState, useEffect, RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { placeholderContainerVariants, letterVariants } from "./animations";
import { PLACEHOLDERS } from "./constants";

interface PlaceholderTextProps {
  inputValue: string;
  isActive: boolean;
  inputRef: RefObject<HTMLInputElement>;
  setInputValue: (value: string) => void;
  handleActivate: () => void;
}

export const PlaceholderText = ({ 
  inputValue, 
  isActive, 
  inputRef,
  setInputValue,
  handleActivate
}: PlaceholderTextProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue) return;
 
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);
 
    return () => clearInterval(interval);
  }, [isActive, inputValue]);

  return (
    <div className="relative flex-1">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-white"
        style={{ position: "relative", zIndex: 1 }}
        onFocus={handleActivate}
      />
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
        <AnimatePresence mode="wait">
          {showPlaceholder && !isActive && !inputValue && (
            <motion.span
              key={placeholderIndex}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                zIndex: 0,
              }}
              variants={placeholderContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {PLACEHOLDERS[placeholderIndex]
                .split("")
                .map((char, i) => (
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
    </div>
  );
};
