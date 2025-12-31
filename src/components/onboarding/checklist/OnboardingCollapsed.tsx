import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OnboardingCollapsedProps {
  onExpand: () => void;
}

export function OnboardingCollapsed({ onExpand }: OnboardingCollapsedProps) {
  const { progress, currentTask, completedTasks } = useOnboarding();
  const totalTasks = 5;

  return (
    <motion.button
      onClick={onExpand}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lg hover:border-onboarding-gradient-start/50"
    >
      {/* Circular Progress */}
      <div className="relative h-10 w-10">
        <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            className="stroke-onboarding-progress"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            className="stroke-onboarding-gradient-start"
            strokeWidth="3"
            strokeDasharray={`${progress} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
          {completedTasks.length}/{totalTasks}
        </span>
      </div>

      {/* Text */}
      <div className="text-left">
        <p className="text-sm font-medium text-foreground">Getting Started</p>
        {currentTask && (
          <p className="text-xs text-muted-foreground">
            Next: {currentTask.label}
          </p>
        )}
      </div>

      {/* Expand icon */}
      <ChevronUp className="h-4 w-4 text-muted-foreground" />
    </motion.button>
  );
}
