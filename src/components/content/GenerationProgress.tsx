import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextShimmer } from '@/components/ui/text-shimmer';

export type GenerationType = 'flashcards' | 'quizzes' | 'summary';

const generationMessages: Record<GenerationType, string[]> = {
  flashcards: ['Analyzing Content...', 'Generating Flashcards...', 'Saving...'],
  quizzes: ['Analyzing Content...', 'Generating Quizzes...', 'Saving...'],
  summary: ['Analyzing Content...', 'Generating Summary...', 'Saving...'],
};

const typeLabels: Record<GenerationType, string> = {
  flashcards: 'Generating Flashcard',
  quizzes: 'Generating Quiz',
  summary: 'Generating Summary',
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
      animate={{ 
        opacity: [0.7, 1, 0.7],
        y: 0 
      }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 0.3 }
      }}
      className="p-6"
    >
      <TextShimmer 
        as="span" 
        className="font-semibold text-base"
        duration={1.5}
      >
        {typeLabels[type]}
      </TextShimmer>
      <div className="mt-2 h-5 overflow-hidden">
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
