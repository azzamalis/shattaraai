
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ExamHeaderProps {
  totalCompletedQuestions: number;
  totalQuestions: number;
  timeRemaining: number;
  progressPercentage: number;
  onClose?: () => void;
}

export function ExamHeader({ 
  totalCompletedQuestions, 
  totalQuestions, 
  timeRemaining, 
  progressPercentage,
  onClose
}: ExamHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 px-4 shadow-lg shadow-neutral-800/5 backdrop-blur-sm dark:border-border dark:shadow-white/5 py-4 sm:py-6">
      <div className="relative mx-auto flex w-full items-center">
        {/* Left: Close button */}
        <div className="flex w-20 flex-shrink-0 items-center gap-2 xl:w-40">
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Center: Progress */}
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">
            {totalCompletedQuestions}
          </span>
          <Progress 
            value={progressPercentage} 
            className="h-3 w-full max-w-2xl bg-primary/5 dark:bg-primary/10"
          />
          <span className="text-sm text-muted-foreground">
            {totalQuestions}
          </span>
        </div>
        
        {/* Right: Timer */}
        <div className="flex w-20 flex-shrink-0 items-center justify-end gap-2 xl:w-40">
          <span className={cn(
            "flex-shrink-0 text-sm font-medium",
            timeRemaining < 300 ? "text-red-500" : "text-muted-foreground"
          )}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </header>
  );
}
