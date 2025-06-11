
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flashcard, FlashcardData, FilterOptions } from './Flashcard';
import { FlashcardManagement } from './FlashcardManagement';
import { useFlashcardState } from '@/hooks/useFlashcardState';
import { useFlashcardFilters } from '@/hooks/useFlashcardFilters';
import { useFlashcardManagement } from '@/hooks/useFlashcardManagement';

interface FlashcardContainerProps {
  initialCards: FlashcardData[];
}

export function FlashcardContainer({ initialCards }: FlashcardContainerProps) {
  const {
    cards,
    filteredCards,
    isShuffled,
    setFilteredCards,
    handleStarCard,
    handleUpdateCards,
    handleShuffle
  } = useFlashcardState(initialCards);

  const {
    availableConcepts,
    hasStarredCards,
    handleFilter
  } = useFlashcardFilters(cards, setFilteredCards);

  const {
    showManagement,
    handleManageCards,
    handleEditCard,
    handleBackFromManagement
  } = useFlashcardManagement();

  const handleSaveCards = (updatedCards: FlashcardData[]) => {
    handleUpdateCards(updatedCards);
  };

  // Show management view
  if (showManagement) {
    return (
      <FlashcardManagement
        cards={cards}
        onBack={handleBackFromManagement}
        onSave={handleSaveCards}
        onUpdateCard={(index, updatedCard) => {
          console.log('Update card:', index, updatedCard);
        }}
      />
    );
  }

  return (
    <ScrollArea className="h-full">
      <Flashcard 
        cards={filteredCards} 
        onStar={handleStarCard} 
        onEdit={handleEditCard} 
        onManage={handleManageCards} 
        onFilter={handleFilter} 
        onShuffle={handleShuffle}
        onUpdateCards={handleUpdateCards}
      />
    </ScrollArea>
  );
}
