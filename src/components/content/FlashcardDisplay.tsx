
import React, { useState } from 'react';
import { Lightbulb, Star, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardData } from './Flashcard';

interface FlashcardDisplayProps {
  card: FlashcardData;
  isFlipped: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isStarred: boolean;
  isShuffled: boolean;
  onFlip: () => void;
  onToggleHint: () => void;
  onToggleExplanation: () => void;
  onToggleStar: () => void;
  onEdit: () => void;
}

export function FlashcardDisplay({
  card,
  isFlipped,
  showHint,
  showExplanation,
  isStarred,
  isShuffled,
  onFlip,
  onToggleHint,
  onToggleExplanation,
  onToggleStar,
  onEdit
}: FlashcardDisplayProps) {
  return (
    <div 
      className="w-full max-w-2xl aspect-[4/3] cursor-pointer relative"
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
        {/* Front of card */}
        <div 
          className={cn(
            "absolute w-full h-full rounded-xl p-6",
            "bg-card dark:bg-card",
            "border border-border dark:border-border",
            "shadow-lg"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <button 
                className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHint();
                }}
              >
                <Lightbulb className={cn(
                  "w-4 h-4",
                  showHint ? "text-primary" : "text-muted-foreground dark:text-muted-foreground"
                )} />
              </button>
              <div className="flex gap-2">
                <button 
                  className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar();
                  }}
                >
                  <Star className={cn(
                    "w-4 h-4",
                    isStarred 
                      ? "fill-primary text-primary" 
                      : "text-muted-foreground"
                  )} />
                </button>
                <button 
                  className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-[22px] text-center text-card-foreground dark:text-card-foreground">
                {card.question}
              </p>
              {card.hint && showHint && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="font-semibold text-primary">Hint: </span>
                    {card.hint}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className={cn(
            "absolute w-full h-full rounded-xl p-6",
            "bg-card dark:bg-card",
            "border border-border dark:border-border",
            "shadow-lg"
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-end items-center mb-4">
              <div className="flex gap-2">
                <button 
                  className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar();
                  }}
                >
                  <Star className={cn(
                    "w-4 h-4",
                    isStarred 
                      ? "fill-primary text-primary" 
                      : "text-muted-foreground"
                  )} />
                </button>
                <button 
                  className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <p className="text-[22px] text-center text-card-foreground dark:text-card-foreground">
                {card.answer}
              </p>
              {card.explanation && (
                <button 
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExplanation();
                  }}
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>
              )}
              {showExplanation && card.explanation && (
                <div className="mt-2 p-3 bg-muted rounded-lg max-w-md">
                  <p className="text-sm text-muted-foreground text-center">
                    {card.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shuffle On Badge */}
      {isShuffled && (
        <div className="absolute bottom-4 right-4 px-2 py-1 bg-[#00A3FF]/10 border border-[#00A3FF]/20 rounded-md">
          <span className="text-xs font-medium text-[#00A3FF]">Shuffle On</span>
        </div>
      )}
    </div>
  );
}
