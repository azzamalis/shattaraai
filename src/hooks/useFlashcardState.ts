
import { useState, useEffect } from 'react';
import { FlashcardData } from '@/components/content/Flashcard';

export function useFlashcardState(initialCards: FlashcardData[]) {
  const [cards, setCards] = useState<FlashcardData[]>(initialCards);
  const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(initialCards);
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<FlashcardData[]>(initialCards);

  // Initialize starred cards from data
  useEffect(() => {
    const initialStarred = new Set<string>();
    cards.forEach((card) => {
      if (card.isStarred) {
        initialStarred.add(card.id);
      }
    });
    setStarredCards(initialStarred);
  }, [cards]);

  // Update filtered cards when cards change
  useEffect(() => {
    setFilteredCards(cards);
    setOriginalOrder(cards);
  }, [cards]);

  const handleStarCard = (index: number) => {
    const actualIndex = cards.findIndex(card => card.id === filteredCards[index]?.id);
    if (actualIndex !== -1) {
      const updatedCards = [...cards];
      updatedCards[actualIndex] = {
        ...updatedCards[actualIndex],
        isStarred: !updatedCards[actualIndex].isStarred
      };
      setCards(updatedCards);

      const updatedFilteredCards = [...filteredCards];
      updatedFilteredCards[index] = {
        ...updatedFilteredCards[index],
        isStarred: !updatedFilteredCards[index].isStarred
      };
      setFilteredCards(updatedFilteredCards);
    }
  };

  const handleUpdateCards = (updatedCards: FlashcardData[]) => {
    setCards(updatedCards);
    setFilteredCards(updatedCards);
    setOriginalOrder(updatedCards);
  };

  const handleShuffle = () => {
    if (isShuffled) {
      setFilteredCards(originalOrder);
      setIsShuffled(false);
    } else {
      setOriginalOrder([...filteredCards]);
      const shuffled = [...filteredCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFilteredCards(shuffled);
      setIsShuffled(true);
    }
  };

  return {
    cards,
    filteredCards,
    starredCards,
    isShuffled,
    setFilteredCards,
    handleStarCard,
    handleUpdateCards,
    handleShuffle
  };
}
