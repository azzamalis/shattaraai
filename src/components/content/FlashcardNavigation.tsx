
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardNavigationProps {
  currentCard: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function FlashcardNavigation({
  currentCard,
  totalCards,
  onPrevious,
  onNext
}: FlashcardNavigationProps) {
  return (
    <div className="w-full max-w-2xl flex items-center justify-between">
      <button 
        className={cn(
          "p-2 rounded-lg transition-colors",
          "bg-card dark:bg-card border border-border dark:border-border",
          "shadow-lg",
          currentCard === 0 
            ? "text-muted-foreground cursor-not-allowed opacity-50" 
            : "text-card-foreground hover:bg-card-hover"
        )}
        onClick={onPrevious}
        disabled={currentCard === 0}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <span className="text-sm text-muted-foreground">
        {currentCard + 1} / {totalCards}
      </span>
      <button 
        className={cn(
          "p-2 rounded-lg transition-colors",
          "bg-card dark:bg-card border border-border dark:border-border",
          "shadow-lg",
          currentCard === totalCards - 1 
            ? "text-muted-foreground cursor-not-allowed opacity-50" 
            : "text-card-foreground hover:bg-card-hover"
        )}
        onClick={onNext}
        disabled={currentCard === totalCards - 1}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
