
import { useState } from 'react';
import { FlashcardData, FilterOptions } from '@/components/content/Flashcard';

export function useFlashcardFilters(cards: FlashcardData[], onFilteredCardsChange: (cards: FlashcardData[]) => void) {
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    starredOnly: false,
    concepts: []
  });

  const handleFilter = (filters: FilterOptions) => {
    setActiveFilters(filters);
    let filtered = [...cards];
    
    if (filters.starredOnly) {
      filtered = filtered.filter(card => card.isStarred);
    }
    
    if (filters.concepts.length > 0) {
      filtered = filtered.filter(card => card.concept && filters.concepts.includes(card.concept));
    }
    
    onFilteredCardsChange(filtered);
  };

  const availableConcepts = Array.from(new Set(cards.map(card => card.concept).filter(Boolean)));
  const hasStarredCards = cards.some(card => card.isStarred);

  return {
    activeFilters,
    availableConcepts,
    hasStarredCards,
    handleFilter
  };
}
