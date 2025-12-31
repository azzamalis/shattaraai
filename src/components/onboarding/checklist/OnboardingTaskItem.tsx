import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { OnboardingTask } from '@/config/onboardingTasks';
import { AnimatedCheckmark } from './AnimatedCheckmark';

interface OnboardingTaskItemProps {
  task: OnboardingTask;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function OnboardingTaskItem({
  task,
  isCompleted,
  isActive,
  onClick,
}: OnboardingTaskItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
        isCompleted
          ? 'bg-onboarding-success/10'
          : isActive
          ? 'bg-onboarding-highlight'
          : 'hover:bg-accent/50'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Checkbox */}
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isCompleted
            ? 'border-onboarding-success bg-onboarding-success'
            : isActive
            ? 'border-onboarding-gradient-start'
            : 'border-muted-foreground/30'
        }`}
      >
        {isCompleted && (
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        )}
        {!isCompleted && isActive && (
          <div className="h-2 w-2 rounded-full bg-onboarding-gradient-start" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium ${
            isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
          }`}
        >
          {task.label}
        </p>
        <p className="text-xs text-muted-foreground truncate">{task.description}</p>
      </div>

      {/* Arrow for active */}
      {!isCompleted && isActive && (
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      )}
    </motion.button>
  );
}
