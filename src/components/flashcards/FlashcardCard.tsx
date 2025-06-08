
import React from 'react';
import { FlashcardData } from '@/lib/flashcardTypes';
import { cn } from '@/lib/utils';

interface FlashcardCardProps {
  card: FlashcardData;
  isFlipped: boolean;
  showHint: boolean;
  showExplanation: boolean;
  onFlip: () => void;
  onToggleExplanation: () => void;
}

export function FlashcardCard({
  card,
  isFlipped,
  showHint,
  showExplanation,
  onFlip,
  onToggleExplanation
}: FlashcardCardProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div 
        className={cn(
          "relative w-full h-80 cursor-pointer transition-transform duration-300 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}
        onClick={onFlip}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Question Side */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden",
            "bg-dashboard-card dark:bg-dashboard-card",
            "border border-dashboard-separator/20 dark:border-white/10",
            "rounded-xl p-8 flex flex-col justify-center",
            "shadow-lg"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold text-dashboard-text dark:text-dashboard-text mb-4">
              {card.term}
            </h3>
            {showHint && card.hint && (
              <div className="mt-6 p-4 bg-dashboard-bg/50 dark:bg-dashboard-bg/50 rounded-lg border border-dashboard-separator/10 dark:border-white/5">
                <p className="text-sm text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  💡 {card.hint}
                </p>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-4 text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
            Click to reveal answer
          </div>
        </div>

        {/* Answer Side */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
            "bg-dashboard-card dark:bg-dashboard-card",
            "border border-dashboard-separator/20 dark:border-white/10",
            "rounded-xl p-8 flex flex-col",
            "shadow-lg"
          )}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-medium text-dashboard-text dark:text-dashboard-text mb-4 text-center">
              {card.definition}
            </h3>
            
            {card.explanation && (
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExplanation();
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    "bg-dashboard-bg/50 dark:bg-dashboard-bg/50",
                    "border border-dashboard-separator/10 dark:border-white/5",
                    "text-sm text-dashboard-text-secondary dark:text-dashboard-text-secondary",
                    "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  )}
                >
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </button>
                
                {showExplanation && (
                  <div className="mt-3 p-4 bg-dashboard-bg dark:bg-dashboard-bg rounded-lg border border-dashboard-separator/10 dark:border-white/5">
                    <p className="text-sm text-dashboard-text-secondary dark:text-dashboard-text-secondary leading-relaxed">
                      {card.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60 mt-4">
            <span>{card.source} • Page {card.page}</span>
            <span>Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
