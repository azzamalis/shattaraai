import React from 'react';
import { cn } from '@/lib/utils';

export type LoaderVariant = 'text-blink' | 'text-shimmer' | 'loading-dots';

interface LoaderProps {
  variant?: LoaderVariant;
  text?: string;
  className?: string;
}

export function Loader({ variant = 'text-shimmer', text = 'Loading...', className }: LoaderProps) {
  if (variant === 'text-blink') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="animate-pulse text-dashboard-text dark:text-dashboard-text">
          {text}
        </span>
      </div>
    );
  }

  if (variant === 'text-shimmer') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="relative inline-block text-dashboard-text dark:text-dashboard-text">
          <span className="animate-shimmer bg-gradient-to-r from-dashboard-text via-primary to-dashboard-text bg-[length:200%_100%] bg-clip-text text-transparent">
            {text}
          </span>
        </span>
      </div>
    );
  }

  if (variant === 'loading-dots') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="text-dashboard-text dark:text-dashboard-text">{text}</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
        </span>
      </div>
    );
  }

  return null;
}
