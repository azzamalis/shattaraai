import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Circle, Pencil, Trash, GalleryVerticalEnd } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FlashcardData } from './Flashcard';

interface FlashcardListDisplayProps {
  flashcards: FlashcardData[];
  title?: string;
  onStartFlashcards: () => void;
  onRename: (newTitle: string) => void;
  onDeleteFlashcards: () => void;
}

export const FlashcardListDisplay = ({
  flashcards,
  title = 'My Flashcards',
  onStartFlashcards,
  onRename,
  onDeleteFlashcards,
}: FlashcardListDisplayProps) => {
  const [showAllConcepts, setShowAllConcepts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract unique concepts from flashcards
  const concepts = [...new Set(flashcards.map(card => card.concept).filter(Boolean))] as string[];
  const displayConcepts = showAllConcepts ? concepts : concepts.slice(0, 2);
  const remainingConcepts = concepts.length - 2;

  // Calculate mastery progress (cards with correct answers)
  const masteredCards = flashcards.filter(card => card.correct).length;
  const progress = flashcards.length > 0 ? Math.round((masteredCards / flashcards.length) * 100) : 0;

  const getProgressColor = () => {
    if (progress <= 25) return 'bg-[#DE1135]';
    if (progress <= 50) return 'bg-[#F6BC2F]';
    return 'bg-[#0E8345]';
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Reset edit title when title prop changes
  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(title);
    setIsEditing(true);
  };

  const handleSaveRename = () => {
    const trimmedTitle = editTitle.trim();
    if (trimmedTitle && trimmedTitle !== title) {
      onRename(trimmedTitle);
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelRename();
    }
  };

  return (
    <div
      className="group cursor-pointer bg-transparent rounded-2xl border-2 border-border p-4 shadow-sm transition-all duration-200 hover:border-foreground/30 hover:bg-accent/30"
      onClick={isEditing ? undefined : onStartFlashcards}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Header with icon and title */}
          <div className="flex min-w-0 items-center gap-2 text-base font-medium text-foreground">
            <GalleryVerticalEnd className="w-5 h-5 text-primary flex-shrink-0" />
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleCancelRename}
                className="text-foreground font-medium h-7 w-full max-w-[200px] text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate">{title}</span>
            )}
          </div>
          
          {/* Card count and concepts */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}
            </span>
            {concepts.length > 0 && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                {displayConcepts.map((concept, index) => (
                  <span
                    key={index}
                    className="text-[#00A3FF] bg-[#00A3FF]/10 py-0.5 px-2 rounded-full text-xs"
                  >
                    {concept}
                  </span>
                ))}
                {!showAllConcepts && remainingConcepts > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAllConcepts(true);
                    }}
                    className="text-muted-foreground hover:text-primary text-xs transition-colors"
                  >
                    +{remainingConcepts} more
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 pt-1">
            <div className="bg-muted flex-grow rounded-full h-2">
              <div
                className={`${getProgressColor()} rounded-full h-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs font-medium">{progress}%</span>
          </div>
        </div>
        
        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 flex-shrink-0 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border border-border z-50">
            <DropdownMenuItem onClick={handleStartRename}>
              <Pencil className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFlashcards();
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
