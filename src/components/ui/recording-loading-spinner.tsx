import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingLoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function RecordingLoadingSpinner({ 
  message = "Please wait until your transcription is ready...",
  className 
}: RecordingLoadingSpinnerProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center w-full bg-card rounded-xl min-h-[48px] gap-3 py-[10px] px-[12px]">
        <Loader2 className="h-6 w-6 animate-spin text-primary shrink-0" />
        <div className="flex-1 text-center">
          <span className="text-card-foreground text-sm font-medium">
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}