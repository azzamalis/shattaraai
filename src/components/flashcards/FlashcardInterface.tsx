
import React, { useState } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardHeader } from './FlashcardHeader';
import { FlashcardNavigation } from './FlashcardNavigation';
import { FlashcardActionBar } from './FlashcardActionBar';
import { cn } from '@/lib/utils';

export function FlashcardInterface() {
  const {
    currentCard,
    currentCardIndex,
    totalCards,
    isFlipped,
    showHint,
    showExplanation,
    isShuffled,
    nextCard,
    previousCard,
    flipCard,
    toggleHint,
    toggleExplanation,
    toggleStar,
    toggleShuffle
  } = useFlashcards();

  const [showManageCards, setShowManageCards] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-dashboard-bg dark:bg-dashboard-bg rounded-full flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-dashboard-text dark:text-dashboard-text">
            No Flashcards Available
          </h3>
          <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary max-w-md">
            Ask the AI to create flashcards from your content using the command: "Create @Flashcards on [topic]"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <FlashcardHeader
        showHint={showHint}
        isStarred={currentCard.starred}
        onToggleHint={toggleHint}
        onToggleStar={() => toggleStar()}
      />
      
      <div className="flex-1 flex flex-col justify-center relative">
        <FlashcardCard
          card={currentCard}
          isFlipped={isFlipped}
          showHint={showHint}
          showExplanation={showExplanation}
          onFlip={flipCard}
          onToggleExplanation={toggleExplanation}
        />
        
        <FlashcardNavigation
          currentIndex={currentCardIndex}
          totalCards={totalCards}
          onPrevious={previousCard}
          onNext={nextCard}
          canGoPrevious={currentCardIndex > 0}
          canGoNext={currentCardIndex < totalCards - 1}
        />
        
        {isShuffled && (
          <div className="absolute bottom-0 right-0 -mb-2 -mr-2">
            <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
              Shuffle On
            </div>
          </div>
        )}
      </div>
      
      <FlashcardActionBar
        isShuffled={isShuffled}
        onManageCards={() => setShowManageCards(true)}
        onFilterOptions={() => setShowFilterModal(true)}
        onToggleShuffle={toggleShuffle}
      />
      
      {/* TODO: Add ManageCardsModal and FilterModal components */}
    </div>
  );
}
