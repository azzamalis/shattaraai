import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoaderProps {
  variant?: 'loading-dots' | 'text-shimmer' | 'text-blink';
  text?: string;
  className?: string;
}

export function Loader({ 
  variant = 'loading-dots', 
  text = 'Loading...',
  className 
}: LoaderProps) {
  if (variant === 'loading-dots') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    );
  }

  if (variant === 'text-shimmer') {
    return (
      <div className={cn("relative inline-block", className)}>
        <motion.span
          className="bg-gradient-to-r from-muted-foreground via-primary to-muted-foreground bg-clip-text text-transparent bg-[length:200%_100%]"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {text}
        </motion.span>
      </div>
    );
  }

  if (variant === 'text-blink') {
    return (
      <motion.span
        className={cn("text-muted-foreground", className)}
        animate={{
          opacity: [1, 0.3, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.span>
    );
  }

  return null;
}
