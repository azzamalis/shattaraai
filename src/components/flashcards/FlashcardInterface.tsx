
import React from 'react';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardActionBar } from './FlashcardActionBar';
import { FlashcardNavigation } from './FlashcardNavigation';
import { ManageCardsModal } from './ManageCardsModal';
import { FilterModal } from './FilterModal';
import { useFlashcards } from './hooks/useFlashcards';

export function FlashcardInterface() {
  const {
    // Card data
    cards,
    filteredCards,
    currentCard,
    currentCardIndex,
    
    // Card state
    isFlipped,
    showHint,
    showExplanation,
    starredCards,
    isShuffled,
    
    // Modal states
    showManageModal,
    showFilterModal,
    
    // Filter data
    filters,
    availableConcepts,
    
    // Actions
    setCards,
    goToNext,
    goToPrevious,
    toggleFlip,
    toggleHint,
    toggleExplanation,
    toggleStar,
    shuffleCards,
    applyFilters,
    
    // Modal actions
    setShowManageModal,
    setShowFilterModal
  } = useFlashcards();

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 py-6 space-y-6">
        <div className="text-center text-dashboard-text-secondary">
          <p className="text-lg mb-2">No flashcards available</p>
          <p className="text-sm">Create some flashcards to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-6 space-y-6">
      {/* Main Card */}
      <div className="w-full max-w-2xl">
        <FlashcardCard
          card={currentCard}
          isFlipped={isFlipped}
          showHint={showHint}
          showExplanation={showExplanation}
          isShuffled={isShuffled}
          isStarred={starredCards.has(currentCard.id)}
          onFlip={toggleFlip}
          onToggleHint={toggleHint}
          onToggleExplanation={toggleExplanation}
          onToggleStar={() => toggleStar()}
        />
      </div>

      {/* Navigation */}
      <FlashcardNavigation
        currentIndex={currentCardIndex}
        totalCards={filteredCards.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        canGoPrevious={currentCardIndex > 0}
        canGoNext={currentCardIndex < filteredCards.length - 1}
      />

      {/* Action Bar */}
      <FlashcardActionBar
        onFilter={() => setShowFilterModal(true)}
        onShuffle={shuffleCards}
        onManageCards={() => setShowManageModal(true)}
        isShuffled={isShuffled}
        hasFiltersApplied={
          filters.starredOnly || 
          filters.selectedConcepts.length > 0
        }
      />

      {/* Modals */}
      <ManageCardsModal
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        cards={cards}
        onUpdateCards={setCards}
        starredCards={starredCards}
        onToggleStar={toggleStar}
      />

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApplyFilters={applyFilters}
        availableConcepts={availableConcepts}
      />
    </div>
  );
}
