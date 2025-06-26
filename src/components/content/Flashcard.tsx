import React, { useState } from 'react';
import { FlashcardDisplay } from './FlashcardDisplay';
import { FlashcardNavigation } from './FlashcardNavigation';
import { FlashcardControls } from './FlashcardControls';
import { FilterModal } from './FilterModal';
export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  explanation?: string;
  source?: string;
  page?: number;
  concept?: string;
  timeSpent?: number;
  correct?: boolean;
  isStarred?: boolean;
}
interface FlashcardProps {
  cards: FlashcardData[];
  onStar?: (index: number) => void;
  onEdit?: (index: number, updatedCard: FlashcardData) => void;
  onManage?: () => void;
  onFilter?: (filters: FilterOptions) => void;
  onShuffle?: () => void;
  onUpdateCards?: (cards: FlashcardData[]) => void;
}
export interface FilterOptions {
  starredOnly: boolean;
  concepts: string[];
}
export function Flashcard({
  cards,
  onStar,
  onEdit,
  onManage,
  onFilter,
  onShuffle,
  onUpdateCards
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
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
  const handleShuffle = () => {
    setIsShuffled(prev => !prev);
    onShuffle?.();
  };
  const handleFilter = (filters: FilterOptions) => {
    onFilter?.(filters);
    setShowFilterModal(false);
  };
  const handleToggleStar = () => {
    const currentCardData = cards[currentCard];
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
  };
  const availableConcepts = Array.from(new Set(cards.map(card => card.concept).filter(Boolean)));
  const hasStarredCards = cards.some(card => card.isStarred);
  const currentCardData = cards[currentCard];
  if (!currentCardData) {
    return <div className="flex flex-col items-center justify-center h-full px-4 py-6 space-y-6">
        <p className="text-muted-foreground">No flashcards available</p>
      </div>;
  }
  return <div className="flex flex-col items-center justify-center h-full px-4 py-6 space-y-6 bg-background ">
      <FlashcardDisplay card={currentCardData} isFlipped={isFlipped} showHint={showHint} showExplanation={showExplanation} isStarred={starredCards.has(currentCardData.id)} isShuffled={isShuffled} onFlip={handleFlip} onToggleHint={() => setShowHint(prev => !prev)} onToggleExplanation={() => setShowExplanation(prev => !prev)} onToggleStar={handleToggleStar} onEdit={() => onEdit?.(currentCard, currentCardData)} />

      <FlashcardNavigation currentCard={currentCard} totalCards={cards.length} onPrevious={handlePrevious} onNext={handleNext} />

      <FlashcardControls isShuffled={isShuffled} onManage={() => onManage?.()} onFilter={() => setShowFilterModal(true)} onShuffle={handleShuffle} />

      <FilterModal open={showFilterModal} onOpenChange={setShowFilterModal} onFilter={handleFilter} hasStarredCards={hasStarredCards} availableConcepts={availableConcepts} />
    </div>;
}