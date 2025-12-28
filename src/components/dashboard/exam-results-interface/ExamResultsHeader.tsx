import React from 'react';
import { X } from 'lucide-react';

interface ExamResultsHeaderProps {
  totalQuestions: number;
  onOpenChat: () => void;
  onClose?: () => void;
}

export function ExamResultsHeader({
  totalQuestions,
  onOpenChat,
  onClose
}: ExamResultsHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 px-4 shadow-lg shadow-neutral-800/5 backdrop-blur-sm dark:border-b dark:border-border dark:shadow-white/5">
      <div className="relative mx-auto flex w-full items-center py-4 sm:py-6">
        {/* Close Button */}
        <div className="flex w-20 flex-shrink-0 items-center gap-2 xl:w-40">
          <button 
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
          <div 
            aria-valuemax={100} 
            aria-valuemin={0} 
            role="progressbar" 
            data-state="complete" 
            data-max={100} 
            className="relative overflow-hidden rounded-full bg-primary/5 dark:bg-primary/10 h-3 w-full max-w-2xl"
          >
            <div 
              data-state="complete" 
              data-max={100} 
              className="h-full w-full flex-1 transition-all bg-primary" 
              style={{ transform: 'translateX(0%)' }}
            />
          </div>
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
        </div>
        
        {/* Space Chat Button */}
        <div className="flex w-20 flex-shrink-0 items-center justify-end gap-2 xl:w-40">
          <div className="z-10 flex justify-end bg-transparent p-2 pr-0 md:p-4 md:pr-0">
            <button 
              onClick={onOpenChat} 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-x-2"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M236.34,187.09A84,84,0,0,0,172.29,68.9,84,84,0,0,0,19.66,139.09l-6.84,23.26a20,20,0,0,0,24.83,24.83l23.26-6.84a83.94,83.94,0,0,0,22.76,6.74,84.06,84.06,0,0,0,111.42,41.26l23.26,6.84a20,20,0,0,0,24.83-24.83ZM62,155.5a11.88,11.88,0,0,0-3.39.49l-20.72,6.09L44,141.35a12,12,0,0,0-.93-9A60,60,0,1,1,67.7,156.92,12,12,0,0,0,62,155.5Zm150.89,24.8a12,12,0,0,0-.93,9l6.09,20.73L197.36,204a12,12,0,0,0-9.06.93A60,60,0,0,1,111,186.63a83.93,83.93,0,0,0,68.55-91.37,60,60,0,0,1,33.38,85Z"></path>
              </svg>
              <span className="hidden md:inline">Space Chat</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
