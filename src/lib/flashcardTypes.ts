
export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  explanation?: string;
  source?: string;
  page?: number;
  concept?: string;
  isStarred?: boolean;
  studied?: boolean;
  timeSpent?: number;
  correct?: boolean | null;
  difficulty?: 'easy' | 'medium' | 'hard';
  topics?: string[];
  createdAt?: string;
  lastStudied?: string;
}

export interface FlashcardProgress {
  totalCards: number;
  studiedCards: number;
  starredCards: number;
  difficultCards: number;
  totalTimeSpent: number;
  sessionTimeSpent: number;
  accuracy?: number;
}

export interface FlashcardFilter {
  starredOnly: boolean;
  selectedConcepts: string[];
  showStudiedOnly?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard' | null;
}

export interface FlashcardSession {
  startTime: Date;
  cardStartTime: Date | null;
  currentCardId: string | null;
}
