
import React from 'react';
import { FlashcardData } from '@/lib/flashcardTypes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardCardProps {
  card: FlashcardData;
  isFlipped: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isShuffled: boolean;
  isStarred: boolean;
  onFlip: () => void;
  onToggleHint: () => void;
  onToggleExplanation: () => void;
  onToggleStar: () => void;
}

export function FlashcardCard({
  card,
  isFlipped,
  showHint,
  showExplanation,
  isShuffled,
  isStarred,
  onFlip,
  onToggleHint,
  onToggleExplanation,
  onToggleStar
}: FlashcardCardProps) {
  return (
    <div
      className="w-full aspect-[4/3] cursor-pointer"
      onClick={onFlip}
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of card (Question) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-xl p-6",
            "bg-dashboard-card border border-border",
            "shadow-lg"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col h-full">
            {/* Header with buttons */}
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHint();
                }}
                className={cn(
                  "text-dashboard-text-secondary hover:text-dashboard-text",
                  showHint && "text-yellow-500 hover:text-yellow-600"
                )}
              >
                <Lightbulb className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
                className={cn(
                  "text-dashboard-text-secondary hover:text-dashboard-text",
                  isStarred && "text-yellow-500 hover:text-yellow-600"
                )}
              >
                <Star className={cn("w-5 h-5", isStarred && "fill-current")} />
              </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <p className="text-xl lg:text-2xl text-center text-dashboard-text leading-relaxed">
                {card.question}
              </p>
              {showHint && card.hint && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg max-w-md">
                  <p className="text-sm text-dashboard-text-secondary">
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">Hint: </span>
                    {card.hint}
                  </p>
                </div>
              )}
            </div>

            {/* Shuffle badge */}
            {isShuffled && (
              <div className="absolute bottom-4 right-4">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Shuffle On
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Back of card (Answer) */}
        <div
          className={cn(
            "absolute w-full h-full rounded-xl p-6",
            "bg-dashboard-card border border-border",
            "shadow-lg"
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header with buttons */}
            <div className="flex justify-end items-center mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
                className={cn(
                  "text-dashboard-text-secondary hover:text-dashboard-text",
                  isStarred && "text-yellow-500 hover:text-yellow-600"
                )}
              >
                <Star className={cn("w-5 h-5", isStarred && "fill-current")} />
              </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <p className="text-xl lg:text-2xl text-center text-dashboard-text leading-relaxed">
                {card.answer}
              </p>
              {card.explanation && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExplanation();
                  }}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
              )}
              {showExplanation && card.explanation && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg max-w-lg">
                  <p className="text-sm text-dashboard-text-secondary leading-relaxed">
                    {card.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Shuffle badge */}
            {isShuffled && (
              <div className="absolute bottom-4 right-4">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  Shuffle On
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
