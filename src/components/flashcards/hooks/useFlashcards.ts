
import { useState, useEffect, useCallback } from 'react';
import { FlashcardData, FlashcardProgress, FlashcardFilter, FlashcardState } from '@/lib/flashcardTypes';

const SAMPLE_FLASHCARDS: FlashcardData[] = [
  {
    id: 1,
    term: "What is React?",
    definition: "React is a JavaScript library for building user interfaces, particularly web applications.",
    hint: "Think about JavaScript libraries for UI",
    explanation: "React was created by Facebook and allows developers to create reusable UI components. It uses a virtual DOM for efficient updates and follows a component-based architecture.",
    source: "React Documentation",
    page: 1,
    concept: "React Basics",
    starred: true,
    studied: false,
    timeSpent: 0,
    correct: null
  },
  {
    id: 2,
    term: "What is a Component in React?",
    definition: "A component is a reusable piece of UI that can accept props and return JSX elements.",
    hint: "Think about reusable UI pieces",
    explanation: "Components are the building blocks of React applications. They can be functional or class-based and allow you to split the UI into independent, reusable pieces.",
    source: "React Documentation",
    page: 5,
    concept: "React Components",
    starred: false,
    studied: false,
    timeSpent: 0,
    correct: null
  },
  {
    id: 3,
    term: "What is JSX?",
    definition: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in React components.",
    hint: "JavaScript + XML",
    explanation: "JSX stands for JavaScript XML. It makes it easier to write and add HTML in React by allowing you to write HTML elements in JavaScript and place them in the DOM.",
    source: "React Documentation",
    page: 3,
    concept: "React Basics",
    starred: false,
    studied: true,
    timeSpent: 45,
    correct: true
  }
];

export function useFlashcards() {
  const [state, setState] = useState<FlashcardState>({
    cards: SAMPLE_FLASHCARDS,
    currentCardIndex: 0,
    isFlipped: false,
    showHint: false,
    showExplanation: false,
    isShuffled: false,
    filter: {
      starredOnly: false,
      selectedConcept: ''
    }
  });

  const [progress, setProgress] = useState<FlashcardProgress>({
    totalCardsStudied: 0,
    totalTimeSpent: 0,
    accuracy: 0,
    sessionStartTime: new Date(),
    cardProgress: new Map()
  });

  const [cardStartTime, setCardStartTime] = useState<Date | null>(null);

  // Filter cards based on current filter settings
  const filteredCards = useCallback(() => {
    let filtered = [...state.cards];
    
    if (state.filter.starredOnly) {
      filtered = filtered.filter(card => card.starred);
    }
    
    if (state.filter.selectedConcept) {
      filtered = filtered.filter(card => card.concept === state.filter.selectedConcept);
    }
    
    return filtered;
  }, [state.cards, state.filter]);

  const currentCards = filteredCards();
  const currentCard = currentCards[state.currentCardIndex] || null;

  // Navigation functions
  const navigateToCard = useCallback((index: number) => {
    if (index >= 0 && index < currentCards.length) {
      // Track time spent on current card
      if (cardStartTime && currentCard) {
        const timeSpent = Math.floor((Date.now() - cardStartTime.getTime()) / 1000);
        setState(prev => ({
          ...prev,
          cards: prev.cards.map(card => 
            card.id === currentCard.id 
              ? { ...card, timeSpent: card.timeSpent + timeSpent }
              : card
          )
        }));
      }

      setState(prev => ({
        ...prev,
        currentCardIndex: index,
        isFlipped: false,
        showHint: false,
        showExplanation: false
      }));
      setCardStartTime(new Date());
    }
  }, [currentCards.length, cardStartTime, currentCard]);

  const nextCard = useCallback(() => {
    navigateToCard(state.currentCardIndex + 1);
  }, [navigateToCard, state.currentCardIndex]);

  const previousCard = useCallback(() => {
    navigateToCard(state.currentCardIndex - 1);
  }, [navigateToCard, state.currentCardIndex]);

  // Card interaction functions
  const flipCard = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFlipped: !prev.isFlipped,
      showExplanation: false
    }));
  }, []);

  const toggleHint = useCallback(() => {
    setState(prev => ({
      ...prev,
      showHint: !prev.showHint
    }));
  }, []);

  const toggleExplanation = useCallback(() => {
    setState(prev => ({
      ...prev,
      showExplanation: !prev.showExplanation
    }));
  }, []);

  const toggleStar = useCallback((cardId?: number) => {
    const targetId = cardId || currentCard?.id;
    if (!targetId) return;

    setState(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === targetId 
          ? { ...card, starred: !card.starred }
          : card
      )
    }));
  }, [currentCard]);

  // Shuffle functionality
  const toggleShuffle = useCallback(() => {
    setState(prev => {
      if (!prev.isShuffled) {
        // Shuffle the cards
        const shuffled = [...prev.cards].sort(() => Math.random() - 0.5);
        return {
          ...prev,
          cards: shuffled,
          isShuffled: true,
          currentCardIndex: 0
        };
      } else {
        // Restore original order (you'd need to store original order)
        return {
          ...prev,
          isShuffled: false,
          currentCardIndex: 0
        };
      }
    });
  }, []);

  // Filter functions
  const setFilter = useCallback((filter: Partial<FlashcardFilter>) => {
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, ...filter },
      currentCardIndex: 0 // Reset to first card when filter changes
    }));
  }, []);

  // Get unique concepts for filtering
  const availableConcepts = useCallback(() => {
    const concepts = new Set(state.cards.map(card => card.concept));
    return Array.from(concepts);
  }, [state.cards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          previousCard();
          break;
        case 'ArrowRight':
          event.preventDefault();
          nextCard();
          break;
        case ' ':
          event.preventDefault();
          flipCard();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [previousCard, nextCard, flipCard]);

  // Initialize card start time
  useEffect(() => {
    if (!cardStartTime) {
      setCardStartTime(new Date());
    }
  }, [cardStartTime]);

  return {
    // State
    currentCard,
    currentCards,
    currentCardIndex: state.currentCardIndex,
    totalCards: currentCards.length,
    isFlipped: state.isFlipped,
    showHint: state.showHint,
    showExplanation: state.showExplanation,
    isShuffled: state.isShuffled,
    filter: state.filter,
    progress,
    
    // Actions
    navigateToCard,
    nextCard,
    previousCard,
    flipCard,
    toggleHint,
    toggleExplanation,
    toggleStar,
    toggleShuffle,
    setFilter,
    availableConcepts,
    
    // Card management
    cards: state.cards,
    setState
  };
}
