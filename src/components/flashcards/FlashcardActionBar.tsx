
import React from 'react';
import { SlidersHorizontal, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardActionBarProps {
  onFilter: () => void;
  onShuffle: () => void;
  isShuffled?: boolean;
  hasFiltersApplied?: boolean;
}

export function FlashcardActionBar({
  onFilter,
  onShuffle,
  isShuffled = false,
  hasFiltersApplied = false
}: FlashcardActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-dashboard-text-secondary">
      <button
        className={cn(
          "flex items-center gap-2 hover:text-dashboard-text transition-colors",
          hasFiltersApplied && "text-primary"
        )}
        onClick={onFilter}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filter Options</span>
        {hasFiltersApplied && (
          <div className="w-2 h-2 bg-primary rounded-full" />
        )}
      </button>
      
      <div className="w-px h-4 bg-border" />
      
      <button
        className={cn(
          "flex items-center gap-2 hover:text-dashboard-text transition-colors",
          isShuffled && "text-primary"
        )}
        onClick={onShuffle}
      >
        <Shuffle className="w-4 h-4" />
        <span>{isShuffled ? 'Unshuffle' : 'Shuffle'}</span>
      </button>
    </div>
  );
}
