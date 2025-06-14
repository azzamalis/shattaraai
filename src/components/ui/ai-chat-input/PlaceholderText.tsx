
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface PlaceholderTextProps {
  text: string;
  showPlaceholder: boolean;
  isActive: boolean;
  inputValue: string;
}

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

export const PlaceholderText: React.FC<PlaceholderTextProps> = ({
  text,
  showPlaceholder,
  isActive,
  inputValue
}) => {
  return (
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
      <AnimatePresence mode="wait">
        {showPlaceholder && !isActive && !inputValue && (
          <motion.span
            key={text}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              zIndex: 0
            }}
            variants={placeholderContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {text.split("").map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                style={{
                  display: "inline-block"
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
