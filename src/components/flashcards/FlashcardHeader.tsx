
import React from 'react';
import { Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlashcardHeaderProps {
  showHint: boolean;
  isStarred: boolean;
  onToggleHint: () => void;
  onToggleStar: () => void;
}

export function FlashcardHeader({
  showHint,
  isStarred,
  onToggleHint,
  onToggleStar
}: FlashcardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
        <span className="text-lg font-medium text-dashboard-text dark:text-dashboard-text">
          Hint
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleHint}
          className={cn(
            "h-9 w-9 p-0 transition-colors",
            showHint 
              ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" 
              : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:text-dashboard-text dark:hover:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
          )}
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleStar}
          className={cn(
            "h-9 w-9 p-0 transition-colors",
            isStarred 
              ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" 
              : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:text-dashboard-text dark:hover:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
          )}
        >
          <Star className={cn("h-4 w-4", isStarred && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
