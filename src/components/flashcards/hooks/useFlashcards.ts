import { useState, useEffect, useCallback } from 'react';
import { FlashcardData, FlashcardFilter, FlashcardSession } from '@/lib/flashcardTypes';

// Enhanced sample data
const sampleFlashcards: FlashcardData[] = [
  {
    id: "1",
    question: "What colonies did Britain retain in North America after losing thirteen colonies in the early 1780s?",
    answer: "Britain retained Nova Scotia, Prince Edward Island, Newfoundland, and Quebec.",
    hint: "Focus on the northern territories that remained loyal to Britain",
    explanation: "After the American Revolution, Britain maintained control over its northern territories in what is now Canada, which served as important strategic and economic bases.",
    source: "Chapter 3: The British Empire",
    page: 45,
    concept: "Colonial Administration",
    isStarred: false,
    studied: false,
    timeSpent: 0,
    correct: null,
    difficulty: 'medium',
    topics: ["Africa and Asia", "The British Empire at the Beginning of the Nineteenth Century"],
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    question: "What was the primary economic driver of the British Empire in the early 19th century?",
    answer: "Trade networks, particularly in textiles, spices, and manufactured goods between Britain, its colonies, and other nations.",
    hint: "Think about what made Britain wealthy during this period",
    explanation: "The British Empire's economic success was built on controlling global trade routes and leveraging colonial resources to fuel industrial production.",
    source: "Chapter 4: Economic Foundations",
    page: 72,
    concept: "Economic Policies",
    isStarred: true,
    studied: true,
    timeSpent: 45,
    correct: true,
    difficulty: 'hard',
    topics: ["Economic Policies", "Trade Networks"],
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    question: "How did Britain administer its vast colonial territories?",
    answer: "Through a combination of direct rule, indirect rule via local leaders, and trading companies like the East India Company.",
    hint: "Consider the different methods of governance used across different regions",
    explanation: "Britain employed flexible administrative strategies depending on local conditions, existing power structures, and strategic importance of each territory.",
    source: "Chapter 5: Administrative Systems",
    page: 98,
    concept: "Colonial Administration",
    isStarred: false,
    studied: false,
    timeSpent: 0,
    correct: null,
    difficulty: 'easy',
    topics: ["Colonial Administration", "Governance"],
    createdAt: new Date().toISOString()
  }
];

export function useFlashcards() {
  const [cards, setCards] = useState<FlashcardData[]>(sampleFlashcards);
  const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(sampleFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [starredCards, setStarredCards] = useState<Set<string>>(new Set());
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<FlashcardData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  
  // Modal states
  const [showManageModal, setShowManageModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FlashcardFilter>({
    starredOnly: false,
    selectedConcepts: [],
    showStudiedOnly: false,
    difficulty: null
  });
  
  // Session tracking
  const [session, setSession] = useState<FlashcardSession>({
    startTime: new Date(),
    cardStartTime: null,
    currentCardId: null
  });

  // Initialize starred cards from data
  useEffect(() => {
    const initialStarred = new Set<string>();
    cards.forEach(card => {
      if (card.isStarred) {
        initialStarred.add(card.id);
      }
    });
    setStarredCards(initialStarred);
  }, [cards]);

  // Start tracking time for current card
  useEffect(() => {
    const currentCard = filteredCards[currentCardIndex];
    if (currentCard) {
      setSession(prev => ({
        ...prev,
        cardStartTime: new Date(),
        currentCardId: currentCard.id
      }));
    }
  }, [currentCardIndex, filteredCards]);

  // Apply filters
  const applyFilters = useCallback((newFilters: FlashcardFilter) => {
    let filtered = [...cards];
    
    if (newFilters.starredOnly) {
      filtered = filtered.filter(card => starredCards.has(card.id));
    }
    
    if (newFilters.selectedConcepts.length > 0) {
      filtered = filtered.filter(card => 
        newFilters.selectedConcepts.some(concept => 
          card.topics?.includes(concept) || 
          card.concept === concept ||
          card.question.toLowerCase().includes(concept.toLowerCase()) ||
          card.answer.toLowerCase().includes(concept.toLowerCase())
        )
      );
    }
    
    setFilteredCards(filtered);
    setCurrentCardIndex(0);
    setFilters(newFilters);
  }, [cards, starredCards]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentCardIndex < filteredCards.length - 1) {
      recordTimeSpent();
      setCurrentCardIndex(prev => prev + 1);
      resetCardState();
    }
  }, [currentCardIndex, filteredCards.length]);

  const goToPrevious = useCallback(() => {
    if (currentCardIndex > 0) {
      recordTimeSpent();
      setCurrentCardIndex(prev => prev - 1);
      resetCardState();
    }
  }, [currentCardIndex]);

  const resetCardState = () => {
    setIsFlipped(false);
    setShowHint(false);
    setShowExplanation(false);
    setIsEditing(false);
  };

  const recordTimeSpent = useCallback(() => {
    if (session.cardStartTime && session.currentCardId) {
      const timeSpent = Math.floor((new Date().getTime() - session.cardStartTime.getTime()) / 1000);
      setCards(prev => prev.map(card => 
        card.id === session.currentCardId 
          ? { ...card, timeSpent: (card.timeSpent || 0) + timeSpent }
          : card
      ));
    }
  }, [session]);

  // Card actions
  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
    if (isFlipped) {
      setShowExplanation(false);
    } else {
      setShowHint(false);
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
  };

  const toggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };

  const toggleStar = useCallback((cardId?: string) => {
    const targetCardId = cardId || filteredCards[currentCardIndex]?.id;
    if (!targetCardId) return;

    setStarredCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(targetCardId)) {
        newSet.delete(targetCardId);
      } else {
        newSet.add(targetCardId);
      }
      return newSet;
    });

    setCards(prev => prev.map(card => 
      card.id === targetCardId 
        ? { ...card, isStarred: !card.isStarred }
        : card
    ));
  }, [filteredCards, currentCardIndex]);

  const startEdit = () => {
    const currentCard = filteredCards[currentCardIndex];
    if (currentCard) {
      setEditQuestion(currentCard.question);
      setEditAnswer(currentCard.answer);
      setIsEditing(true);
    }
  };

  const saveEdit = () => {
    const currentCard = filteredCards[currentCardIndex];
    if (currentCard && editQuestion.trim() && editAnswer.trim()) {
      setCards(prev => prev.map(card => 
        card.id === currentCard.id 
          ? { ...card, question: editQuestion.trim(), answer: editAnswer.trim() }
          : card
      ));
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditQuestion('');
    setEditAnswer('');
  };

  const shuffleCards = () => {
    if (isShuffled) {
      // Restore original order
      setFilteredCards(originalOrder);
      setIsShuffled(false);
    } else {
      // Store original order and shuffle
      setOriginalOrder([...filteredCards]);
      const shuffled = [...filteredCards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFilteredCards(shuffled);
      setIsShuffled(true);
    }
    setCurrentCardIndex(0);
    resetCardState();
  };

  // Get available concepts for filtering
  const availableConcepts = Array.from(new Set(
    cards.flatMap(card => [
      ...(card.topics || []),
      ...(card.concept ? [card.concept] : [])
    ])
  ));

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showManageModal || showFilterModal || isEditing) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          event.preventDefault();
          toggleFlip();
          break;
        case 'Escape':
          setShowManageModal(false);
          setShowFilterModal(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToNext, goToPrevious, showManageModal, showFilterModal, isEditing]);

  const currentCard = filteredCards[currentCardIndex];

  return {
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
    
    // Filter data (simplified)
    filters: {
      starredOnly: filters.starredOnly,
      selectedConcepts: filters.selectedConcepts
    },
    availableConcepts,
    
    // Session data
    session,
    
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
    setEditAnswer,
    
    // Utility
    recordTimeSpent
  };
}
