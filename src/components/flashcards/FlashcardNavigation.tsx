
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlashcardNavigationProps {
  currentIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function FlashcardNavigation({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext
}: FlashcardNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-4 text-dashboard-text-secondary">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={cn(
          "text-dashboard-text-secondary hover:text-dashboard-text",
          !canGoPrevious && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <span className="text-sm font-medium min-w-[60px] text-center">
        {currentIndex + 1} / {totalCards}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!canGoNext}
        className={cn(
          "text-dashboard-text-secondary hover:text-dashboard-text",
          !canGoNext && "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
