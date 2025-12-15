import React, { useEffect, useState } from 'react';
import { Loader2, Check, Sparkles, FileSearch, Brain, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type GenerationType = 'flashcards' | 'quizzes' | 'summary';

interface GenerationStep {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  estimatedDuration: number; // in ms
}

const generationSteps: Record<GenerationType, GenerationStep[]> = {
  flashcards: [
    { id: 'analyzing', label: 'Analyzing content...', icon: FileSearch, estimatedDuration: 2000 },
    { id: 'extracting', label: 'Extracting key concepts...', icon: Brain, estimatedDuration: 3000 },
    { id: 'generating', label: 'Generating flashcards...', icon: Sparkles, estimatedDuration: 8000 },
    { id: 'saving', label: 'Saving to your library...', icon: Save, estimatedDuration: 1500 },
  ],
  quizzes: [
    { id: 'analyzing', label: 'Analyzing content...', icon: FileSearch, estimatedDuration: 2000 },
    { id: 'identifying', label: 'Identifying key topics...', icon: Brain, estimatedDuration: 2500 },
    { id: 'generating', label: 'Generating questions...', icon: Sparkles, estimatedDuration: 10000 },
    { id: 'saving', label: 'Saving quiz...', icon: Save, estimatedDuration: 1500 },
  ],
  summary: [
    { id: 'analyzing', label: 'Analyzing content...', icon: FileSearch, estimatedDuration: 2000 },
    { id: 'processing', label: 'Processing key points...', icon: Brain, estimatedDuration: 3000 },
    { id: 'generating', label: 'Generating summary...', icon: Sparkles, estimatedDuration: 6000 },
    { id: 'saving', label: 'Saving summary...', icon: Save, estimatedDuration: 1500 },
  ],
};

interface GenerationProgressProps {
  type: GenerationType;
  isActive: boolean;
  onComplete?: () => void;
}

export function GenerationProgress({ type, isActive, onComplete }: GenerationProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  const steps = generationSteps[type];

  useEffect(() => {
    if (!isActive) {
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      return;
    }

    let stepIndex = 0;
    const timers: NodeJS.Timeout[] = [];

    const advanceStep = () => {
      // Bounds check before accessing steps array
      if (stepIndex >= steps.length) return;
      
      setCurrentStepIndex(stepIndex);
      const currentStep = steps[stepIndex];
      
      if (!currentStep) return;
      
      const timer = setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, currentStep.id]));
        stepIndex++;
        
        if (stepIndex < steps.length) {
          advanceStep();
        }
      }, currentStep.estimatedDuration);
      
      timers.push(timer);
    };

    advanceStep();

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isActive, steps]);

  if (!isActive) return null;

  const currentStep = steps[currentStepIndex];
  const progress = ((completedSteps.size) / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      <div className="bg-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="w-2.5 h-2.5 text-primary-foreground animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Generating {type === 'flashcards' ? 'Flashcards' : type === 'quizzes' ? 'Quiz' : 'Summary'}
            </h3>
            <p className="text-sm text-muted-foreground">Please wait while AI processes your content</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress, 5)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = index === currentStepIndex && !isCompleted;
            const isPending = index > currentStepIndex;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                  isCurrent && "bg-primary/5 border border-primary/20",
                  isCompleted && "bg-[#0E8345]/5",
                  isPending && "opacity-50"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCurrent && "bg-primary/10",
                  isCompleted && "bg-[#0E8345]/10",
                  isPending && "bg-muted"
                )}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-[#0E8345]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <StepIcon className={cn(
                      "w-4 h-4",
                      isPending ? "text-muted-foreground" : "text-primary"
                    )} />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isCurrent && "text-primary",
                  isCompleted && "text-[#0E8345]",
                  isPending && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.div
                    className="ml-auto flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="mt-6 p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground text-center">
            💡 Tip: The more content you have, the better the AI can generate relevant material
          </p>
        </div>
      </div>
    </motion.div>
  );
}
