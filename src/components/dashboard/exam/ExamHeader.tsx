
import React from 'react';
import { Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamHeaderProps {
  totalCompletedQuestions: number;
  totalQuestions: number;
  timeRemaining: number;
  progressPercentage: number;
}

export function ExamHeader({ 
  totalCompletedQuestions, 
  totalQuestions, 
  timeRemaining, 
  progressPercentage 
}: ExamHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Share Button */}
        <button className="flex items-center gap-2 rounded-md bg-accent hover:bg-accent/80 text-sm px-3 py-2">
          <Share2 className="h-4 w-4" />
          Share exam
        </button>
        
        {/* Center: Fixed Progress Bar */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {totalCompletedQuestions}
          </span>
          <div className="h-2 w-96 rounded-full bg-border">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-300" 
              style={{width: `${progressPercentage}%`}}
            ></div>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalQuestions}
          </span>
        </div>
        
        {/* Right: Timer with warning color */}
        <div className={cn(
          "font-mono text-lg",
          timeRemaining < 300 ? "text-red-500" : "text-foreground"
        )}>
          {formatTime(timeRemaining)}
        </div>
      </div>
    </header>
  );
}
