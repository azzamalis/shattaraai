import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type GenerationType = 'flashcards' | 'quizzes' | 'summary';

const generationMessages: Record<GenerationType, string[]> = {
  flashcards: ['Analyzing Content...', 'Generating Flashcards...', 'Saving...'],
  quizzes: ['Analyzing Content...', 'Generating Quizzes...', 'Saving...'],
  summary: ['Analyzing Content...', 'Generating Summary...', 'Saving...'],
};

const typeLabels: Record<GenerationType, string> = {
  flashcards: 'Flashcard',
  quizzes: 'Quiz',
  summary: 'Summary',
};

interface GenerationProgressProps {
  type: GenerationType;
  isActive: boolean;
  onComplete?: () => void;
}

export function GenerationProgress({ type, isActive }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const messages = generationMessages[type];

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % messages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isActive, messages.length]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="font-semibold text-foreground">
          Generating {typeLabels[type]}
        </span>
      </div>
      <div className="mt-2 ml-8 h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {messages[currentStep]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
