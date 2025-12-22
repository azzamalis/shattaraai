import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { supabase } from '@/integrations/supabase/client';

export type GenerationType = 'flashcards' | 'quizzes' | 'summary';

interface GenerationProgress {
  type: GenerationType;
  step: string;
  progress: number;
  updatedAt: string;
}

const stepMessages: Record<string, string> = {
  analyzing: 'Analyzing Content...',
  extracting: 'Extracting Data...',
  generating: 'Generating...',
  saving: 'Saving...',
  completed: 'Almost Done...',
  failed: 'Failed'
};

const typeLabels: Record<GenerationType, string> = {
  flashcards: 'Generating Flashcard',
  quizzes: 'Generating Quiz',
  summary: 'Generating Summary',
};

interface GenerationProgressProps {
  type: GenerationType;
  isActive: boolean;
  contentId?: string;
  onComplete?: () => void;
}

export function GenerationProgress({ type, isActive, contentId, onComplete }: GenerationProgressProps) {
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [fallbackStep, setFallbackStep] = useState(0);
  
  const fallbackMessages = ['Analyzing Content...', 'Extracting Data...', 'Generating...', 'Saving...', 'Almost Done...'];

  // Subscribe to real-time progress updates
  useEffect(() => {
    if (!isActive || !contentId) return;

    // Fetch initial progress
    const fetchInitialProgress = async () => {
      const { data } = await supabase
        .from('content')
        .select('metadata')
        .eq('id', contentId)
        .single();

      if (data?.metadata) {
        const metadata = data.metadata as Record<string, any>;
        if (metadata.generationProgress) {
          setProgress(metadata.generationProgress as GenerationProgress);
        }
      }
    };

    fetchInitialProgress();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`generation-progress:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          const metadata = payload.new.metadata as Record<string, any>;
          if (metadata?.generationProgress) {
            const newProgress = metadata.generationProgress as GenerationProgress;
            setProgress(newProgress);
            
            // Trigger onComplete when generation is done
            if (newProgress.step === 'completed' && onComplete) {
              setTimeout(onComplete, 500);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isActive, contentId, onComplete]);

  // Fallback animation when no contentId is provided
  useEffect(() => {
    if (!isActive || contentId) {
      setFallbackStep(0);
      return;
    }
    
    const interval = setInterval(() => {
      setFallbackStep((prev) => (prev + 1) % fallbackMessages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isActive, contentId, fallbackMessages.length]);

  if (!isActive) return null;

  // Get current message - prefer real progress, fallback to animation
  const currentMessage = progress?.step 
    ? stepMessages[progress.step] || `${progress.step.charAt(0).toUpperCase()}${progress.step.slice(1)}...`
    : fallbackMessages[fallbackStep];

  const currentProgress = progress?.progress ?? ((fallbackStep + 1) / fallbackMessages.length) * 100;

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
      
      {/* Progress bar */}
      <div className="mt-3 mb-2">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      <div className="h-5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessage}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {currentMessage}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
