
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
    <div className="flex items-center justify-between mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={cn(
          "h-10 w-10 p-0 rounded-full transition-all",
          "text-dashboard-text-secondary dark:text-dashboard-text-secondary",
          "hover:text-dashboard-text dark:hover:text-dashboard-text",
          "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          canGoPrevious && "hover:scale-105"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-dashboard-text dark:text-dashboard-text">
          {currentIndex + 1} / {totalCards}
        </span>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoNext}
        className={cn(
          "h-10 w-10 p-0 rounded-full transition-all",
          "text-dashboard-text-secondary dark:text-dashboard-text-secondary",
          "hover:text-dashboard-text dark:hover:text-dashboard-text",
          "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          canGoNext && "hover:scale-105"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
