
import React from 'react';
import { FlashcardData } from '@/lib/flashcardTypes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FlashcardCardProps {
  card: FlashcardData;
  isFlipped: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isEditing: boolean;
  editQuestion: string;
  editAnswer: string;
  onFlip: () => void;
  onToggleExplanation: () => void;
  onEditQuestion: (value: string) => void;
  onEditAnswer: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

export function FlashcardCard({
  card,
  isFlipped,
  showHint,
  showExplanation,
  isEditing,
  editQuestion,
  editAnswer,
  onFlip,
  onToggleExplanation,
  onEditQuestion,
  onEditAnswer,
  onSaveEdit,
  onCancelEdit
}: FlashcardCardProps) {
  return (
    <div
      className="w-full max-w-2xl aspect-[4/3] cursor-pointer"
      onClick={!isEditing ? onFlip : undefined}
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
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              {isEditing ? (
                <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                  <Textarea
                    value={editQuestion}
                    onChange={(e) => onEditQuestion(e.target.value)}
                    placeholder="Enter question..."
                    className="min-h-[100px] text-center text-lg resize-none"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={onSaveEdit} size="sm">
                      Save
                    </Button>
                    <Button onClick={onCancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
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
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              {isEditing ? (
                <div className="w-full space-y-4" onClick={(e) => e.stopPropagation()}>
                  <Textarea
                    value={editAnswer}
                    onChange={(e) => onEditAnswer(e.target.value)}
                    placeholder="Enter answer..."
                    className="min-h-[100px] text-center text-lg resize-none"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={onSaveEdit} size="sm">
                      Save
                    </Button>
                    <Button onClick={onCancelEdit} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
