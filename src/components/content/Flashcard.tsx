import React, { useState } from 'react';
import {
  Lightbulb,
  Star,
  Pencil,
  ChevronLeft,
  ChevronRight,
  WalletCards,
  SlidersHorizontal,
  Shuffle,
  X,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  explanation?: string;
  isStarred?: boolean;
}

interface FlashcardProps {
  cards: FlashcardData[];
  onStar?: (index: number) => void;
  onEdit?: (index: number, updatedCard: FlashcardData) => void;
  onManage?: () => void;
  onFilter?: () => void;
  onShuffle?: () => void;
}

export function Flashcard({
  cards,
  onStar,
  onEdit,
  onManage,
  onFilter,
  onShuffle
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    const initialStarred = new Set<string>();
    cards.forEach((card, index) => {
      if (card.isStarred) {
        initialStarred.add(card.id);
      }
    });
    setStarredCards(initialStarred);
  }, [cards]);

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(prev => prev - 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
      setIsFlipped(false);
      setShowExplanation(false);
      setShowHint(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
    if (isFlipped) {
      setShowExplanation(false);
    }
    if (!isFlipped) {
      setShowHint(false);
    }
  };

  const currentCardData = cards[currentCard];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 space-y-6">
      {/* Flashcard */}
      <div
        className="w-full max-w-2xl aspect-[4/3] cursor-pointer"
        onClick={handleFlip}
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
                    setShowHint(prev => !prev);
                  }}
                >
                  <Lightbulb className={cn(
                    "w-5 h-5",
                    showHint ? "text-primary" : "text-muted-foreground dark:text-muted-foreground"
                  )} />
                </button>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStarredCards(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(currentCardData.id)) {
                          newSet.delete(currentCardData.id);
                        } else {
                          newSet.add(currentCardData.id);
                        }
                        onStar?.(currentCard);
                        return newSet;
                      });
                    }}
                  >
                    <Star className={cn(
                      "w-5 h-5",
                      starredCards.has(currentCardData.id) ? "fill-primary text-primary" : "text-muted-foreground"
                    )} />
                  </button>
                  <button
                    className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(currentCard, currentCardData);
                    }}
                  >
                    <Pencil className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <p className="text-[22px] text-center text-card-foreground dark:text-card-foreground">
                  {currentCardData.question}
                </p>
                {currentCardData.explanation && showHint && (
                  <p className="text-base text-muted-foreground text-center mt-2">
                    <span className="font-semibold">Hint: </span>{currentCardData.explanation}
                  </p>
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
                      setStarredCards(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(currentCardData.id)) {
                          newSet.delete(currentCardData.id);
                        } else {
                          newSet.add(currentCardData.id);
                        }
                        onStar?.(currentCard);
                        return newSet;
                      });
                    }}
                  >
                    <Star className={cn(
                      "w-5 h-5",
                      starredCards.has(currentCardData.id) ? "fill-primary text-primary" : "text-muted-foreground"
                    )} />
                  </button>
                  <button
                    className="p-2 hover:bg-card-hover dark:hover:bg-card-hover rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(currentCard, currentCardData);
                    }}
                  >
                    <Pencil className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-[22px] text-center text-card-foreground dark:text-card-foreground">
                  {currentCardData.answer}
                </p>
                {currentCardData.explanation && (
                  <button
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary-hover transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExplanation(prev => !prev);
                    }}
                  >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                )}
                {showExplanation && currentCardData.explanation && (
                  <p className="text-base text-muted-foreground text-center mt-2">
                    {currentCardData.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <button
          className={cn(
            "p-2 rounded-lg transition-colors",
            "bg-card dark:bg-card border border-border dark:border-border",
            "shadow-lg",
            currentCard === 0
              ? "text-muted-foreground cursor-not-allowed opacity-50"
              : "text-card-foreground hover:bg-card-hover"
          )}
          onClick={handlePrevious}
          disabled={currentCard === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm text-muted-foreground">
          {currentCard + 1} / {cards.length}
        </span>
        <button
          className={cn(
            "p-2 rounded-lg transition-colors",
            "bg-card dark:bg-card border border-border dark:border-border",
            "shadow-lg",
            currentCard === cards.length - 1
              ? "text-muted-foreground cursor-not-allowed opacity-50"
              : "text-card-foreground hover:bg-card-hover"
          )}
          onClick={handleNext}
          disabled={currentCard === cards.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Management Bar */}
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
          <span>Filter Options</span>
        </button>
        <div className="w-px h-4 bg-border" />
        <button
          className="flex items-center gap-2 hover:text-card-foreground transition-colors"
          onClick={onShuffle}
        >
          <Shuffle className="w-4 h-4" />
          <span>Shuffle</span>
        </button>
      </div>
    </div>
  );
}
