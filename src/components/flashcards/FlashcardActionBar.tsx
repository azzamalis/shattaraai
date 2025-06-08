
import React from 'react';
import { Settings, Filter, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlashcardActionBarProps {
  isShuffled: boolean;
  onManageCards: () => void;
  onFilterOptions: () => void;
  onToggleShuffle: () => void;
}

export function FlashcardActionBar({
  isShuffled,
  onManageCards,
  onFilterOptions,
  onToggleShuffle
}: FlashcardActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-dashboard-separator/20 dark:border-white/10">
      <Button
        variant="outline"
        onClick={onManageCards}
        className={cn(
          "flex items-center gap-2 px-4 py-2",
          "bg-dashboard-bg dark:bg-dashboard-bg",
          "border-dashboard-separator/20 dark:border-white/10",
          "text-dashboard-text dark:text-dashboard-text",
          "hover:bg-dashboard-separator/5 dark:hover:bg-white/5",
          "transition-colors"
        )}
      >
        <Settings className="h-4 w-4" />
        Manage Cards
      </Button>
      
      <Button
        variant="outline"
        onClick={onFilterOptions}
        className={cn(
          "flex items-center gap-2 px-4 py-2",
          "bg-dashboard-bg dark:bg-dashboard-bg",
          "border-dashboard-separator/20 dark:border-white/10",
          "text-dashboard-text dark:text-dashboard-text",
          "hover:bg-dashboard-separator/5 dark:hover:bg-white/5",
          "transition-colors"
        )}
      >
        <Filter className="h-4 w-4" />
        Filter Options
      </Button>
      
      <Button
        variant="outline"
        onClick={onToggleShuffle}
        className={cn(
          "flex items-center gap-2 px-4 py-2 transition-all",
          isShuffled 
            ? "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30" 
            : "bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator/20 dark:border-white/10 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/5 dark:hover:bg-white/5"
        )}
      >
        <Shuffle className="h-4 w-4" />
        Shuffle
      </Button>
    </div>
  );
}
