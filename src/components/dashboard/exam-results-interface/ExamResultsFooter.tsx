import React from 'react';

interface ExamResultsFooterProps {
  onTryAgain: () => void;
  onViewResults: () => void;
}

export function ExamResultsFooter({ onTryAgain, onViewResults }: ExamResultsFooterProps) {
  return (
    <div className="sticky bottom-0 z-10">
      <div className="border-t border-border bg-background px-4 py-8 md:py-[clamp(1rem,2.5vh,2.5rem)]">
        <div className="mx-auto flex max-w-4xl justify-center gap-4">
          {/* Go to Room Button */}
          <button 
            onClick={onTryAgain}
            className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-8 h-12 w-full rounded-full text-base md:w-96"
          >
            Go to Room
          </button>
          
          {/* View Results Button */}
          <button 
            onClick={onViewResults}
            className="inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 w-full rounded-full text-base md:w-96"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}
