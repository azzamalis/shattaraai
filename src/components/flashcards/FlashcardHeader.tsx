
import React from 'react';
import { Lightbulb, Star, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FlashcardHeaderProps {
  showHint: boolean;
  onToggleHint: () => void;
  isStarred: boolean;
  onToggleStar: () => void;
  onEdit: () => void;
  isShuffled?: boolean;
}

export function FlashcardHeader({
  showHint,
  onToggleHint,
  isStarred,
  onToggleStar,
  onEdit,
  isShuffled = false
}: FlashcardHeaderProps) {
  return (
    <div className="w-full max-w-2xl flex justify-between items-center px-2">
      {/* Left side - Hint */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleHint}
          className={cn(
            "text-dashboard-text-secondary hover:text-dashboard-text",
            showHint && "text-yellow-500 hover:text-yellow-600"
          )}
        >
          <Lightbulb className="w-5 h-5" />
        </Button>
        {showHint && (
          <span className="text-sm text-dashboard-text-secondary">Hint</span>
        )}
      </div>

      {/* Right side - Star, Edit, and Shuffle indicator */}
      <div className="flex items-center gap-2">
        {isShuffled && (
          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            Shuffle On
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleStar}
          className={cn(
            "text-dashboard-text-secondary hover:text-dashboard-text",
            isStarred && "text-yellow-500 hover:text-yellow-600"
          )}
        >
          <Star className={cn("w-5 h-5", isStarred && "fill-current")} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="text-dashboard-text-secondary hover:text-dashboard-text"
        >
          <Pencil className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
