
import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

interface ExamResultsHeaderProps {
  totalQuestions: number;
  onOpenChat: () => void;
}

export function ExamResultsHeader({ totalQuestions, onOpenChat }: ExamResultsHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 px-4 shadow-lg shadow-neutral-800/5 backdrop-blur-sm dark:border-border dark:shadow-white/5 py-4 sm:py-6">
      <div className="relative mx-auto flex w-full items-center">
        {/* Left: Close button */}
        <div className="flex w-20 flex-shrink-0 items-center gap-2 xl:w-40">
          <button 
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Center: Progress Bar (completed) */}
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
          <Progress 
            value={100} 
            className="h-3 w-full max-w-2xl bg-primary/5 dark:bg-primary/10" 
          />
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
        </div>
        
        {/* Right: Space Chat Button */}
        <div className="flex w-20 flex-shrink-0 items-center justify-end gap-2 xl:w-40">
          <div className="z-10 flex justify-end bg-background p-2 pr-0 md:p-4 md:pr-0">
            <button 
              onClick={onOpenChat}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-x-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xl:inline">Space Chat</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
