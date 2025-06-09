
import React from 'react';
import { FlashcardCard } from './FlashcardCard';
import { FlashcardHeader } from './FlashcardHeader';
import { FlashcardNavigation } from './FlashcardNavigation';
import { FlashcardActionBar } from './FlashcardActionBar';
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
    isEditing,
    editQuestion,
    editAnswer,
    
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
    startEdit,
    saveEdit,
    cancelEdit,
    shuffleCards,
    applyFilters,
    
    // Modal actions
    setShowManageModal,
    setShowFilterModal,
    
    // Edit actions
    setEditQuestion,
    setEditAnswer
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
      {/* Header */}
      <FlashcardHeader
        showHint={showHint}
        onToggleHint={toggleHint}
        isStarred={starredCards.has(currentCard.id)}
        onToggleStar={() => toggleStar()}
        onEdit={startEdit}
        isShuffled={isShuffled}
      />

      {/* Main Card */}
      <FlashcardCard
        card={currentCard}
        isFlipped={isFlipped}
        showHint={showHint}
        showExplanation={showExplanation}
        isEditing={isEditing}
        editQuestion={editQuestion}
        editAnswer={editAnswer}
        onFlip={toggleFlip}
        onToggleExplanation={toggleExplanation}
        onEditQuestion={setEditQuestion}
        onEditAnswer={setEditAnswer}
        onSaveEdit={saveEdit}
        onCancelEdit={cancelEdit}
      />

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
        onManage={() => setShowManageModal(true)}
        onFilter={() => setShowFilterModal(true)}
        onShuffle={shuffleCards}
        isShuffled={isShuffled}
        hasFiltersApplied={
          filters.starredOnly || 
          filters.selectedConcepts.length > 0 || 
          filters.showStudiedOnly || 
          filters.difficulty !== null
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
