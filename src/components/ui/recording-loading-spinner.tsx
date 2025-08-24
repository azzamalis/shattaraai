import React from 'react';
import { cn } from '@/lib/utils';
import { PulsatingDots } from './pulsating-loader';

interface RecordingLoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function RecordingLoadingSpinner({ 
  message = "Processing",
  className 
}: RecordingLoadingSpinnerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-center w-full bg-card rounded-xl min-h-[48px] gap-3 py-[10px] px-[12px]">
        <PulsatingDots />
        <span className="text-card-foreground text-base font-medium">
          {message}
        </span>
      </div>
    </div>
  );
}