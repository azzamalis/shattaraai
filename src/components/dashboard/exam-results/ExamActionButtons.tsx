
import React from 'react';
import { RefreshCw, RotateCcw, Plus } from 'lucide-react';

interface ExamActionButtonsProps {
  onTryAgain: () => void;
  onRetake: () => void;
  onCreateNew: () => void;
}

export function ExamActionButtons({ onTryAgain, onRetake, onCreateNew }: ExamActionButtonsProps) {
  return (
    <div className="mt-8 flex justify-center gap-4 pb-8">
      <button 
        onClick={onTryAgain}
        className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
      >
        <RefreshCw className="h-5 w-5" />
        Try Again
      </button>
      <button 
        onClick={onRetake}
        className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
      >
        <RotateCcw className="h-5 w-5" />
        Retake Exam
      </button>
      <button 
        onClick={onCreateNew}
        className="flex h-10 w-48 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-5 w-5" />
        Create New Exam
      </button>
    </div>
  );
}
