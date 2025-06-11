
import React from 'react';
import { WalletCards, SlidersHorizontal, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardControlsProps {
  isShuffled: boolean;
  onManage: () => void;
  onFilter: () => void;
  onShuffle: () => void;
}

export function FlashcardControls({
  isShuffled,
  onManage,
  onFilter,
  onShuffle
}: FlashcardControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
      <button 
        className="flex items-center gap-2 hover:text-card-foreground transition-colors"
        onClick={onManage}
      >
        <WalletCards className="w-4 h-4" />
        <span>Manage cards</span>
      </button>
      <div className="w-px h-4 bg-border" />
      <button 
        className="flex items-center gap-2 hover:text-card-foreground transition-colors"
        onClick={onFilter}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span>Filters</span>
      </button>
      <div className="w-px h-4 bg-border" />
      <button 
        className={cn(
          "flex items-center gap-2 transition-colors",
          isShuffled ? "text-primary" : "hover:text-card-foreground"
        )}
        onClick={onShuffle}
      >
        <Shuffle className="w-4 h-4" />
        <span>Shuffle</span>
      </button>
    </div>
  );
}
