
export interface FlashcardData {
  id: number;
  term: string;           // Question text
  definition: string;     // Answer text
  hint: string;          // Optional hint for question side
  explanation: string;    // Detailed explanation for answer side
  source: string;        // Source reference (page number, section)
  page: number;          // Page number from source document
  concept: string;       // Key concept category
  starred: boolean;      // Favorite/important flag
  studied: boolean;      // Progress tracking
  timeSpent: number;     // Time spent on card (seconds)
  correct: boolean | null; // User's last answer accuracy
}

export interface FlashcardProgress {
  totalCardsStudied: number;
  totalTimeSpent: number;
  accuracy: number;
  sessionStartTime: Date;
  cardProgress: Map<number, {
    timeSpent: number;
    correct: boolean | null;
    studied: boolean;
  }>;
}

export interface FlashcardFilter {
  starredOnly: boolean;
  selectedConcept: string;
}

export interface FlashcardState {
  cards: FlashcardData[];
  currentCardIndex: number;
  isFlipped: boolean;
  showHint: boolean;
  showExplanation: boolean;
  isShuffled: boolean;
  filter: FlashcardFilter;
}
