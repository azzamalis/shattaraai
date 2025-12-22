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
    <div className="text-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-primary">My Flashcards</h3>
      </div>
      
      <div className="flex flex-col mb-4">
        <div
          className="cursor-pointer border-2 border-border rounded-2xl p-4"
          onClick={isEditing ? undefined : onStartFlashcards}
        >
          <div className="flex-grow">
            {/* Header with title and menu */}
            <div className="flex items-center justify-between gap-6 mb-3">
              <div className="flex items-center gap-2">
                <GalleryVerticalEnd className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  {isEditing ? (
                    <Input
                      ref={inputRef}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleCancelRename}
                      className="text-primary font-medium h-7 w-full max-w-[160px] text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-primary font-medium text-ellipsis">
                      {title}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Circle className="text-muted w-5 h-5" fill="none" stroke="currentColor" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-xl"
                    >
                      <MoreVertical className="w-4 h-4" />
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

            {/* Concepts and Progress */}
            <div>
              {/* Concept Pills */}
              {concepts.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 text-xs mb-2">
                  {displayConcepts.map((concept, index) => (
                    <span
                      key={index}
                      className="text-[#00A3FF] bg-[#00A3FF]/10 py-1 px-2 rounded-full"
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
                      className="text-muted-foreground hover:text-primary text-xs items-center text-center flex h-6 px-2 transition-colors"
                    >
                      Show {remainingConcepts} more
                    </button>
                  )}
                </div>
              )}

              {/* Progress Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="bg-muted flex-grow rounded-full h-2">
                  <div
                    className={`${getProgressColor()} flex-grow opacity-80 rounded-full h-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-muted-foreground text-xs font-medium">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
