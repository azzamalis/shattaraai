
import React from 'react';
import { RotateCcw, BarChart3 } from 'lucide-react';

interface ExamResultsFooterProps {
  onTryAgain: () => void;
  onViewResults: () => void;
}

export function ExamResultsFooter({ onTryAgain, onViewResults }: ExamResultsFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-card px-6 py-4">
      <div className="mx-auto flex max-w-4xl gap-4">
        <button 
          onClick={onTryAgain}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent py-3 font-medium hover:bg-accent/80"
        >
          <RotateCcw className="h-5 w-5" />
          Try Again
        </button>
        <button 
          onClick={onViewResults}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:bg-primary/90"
        >
          <BarChart3 className="h-5 w-5" />
          View Results
        </button>
      </div>
    </footer>
  );
}
