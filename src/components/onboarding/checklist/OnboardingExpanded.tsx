import React from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import { ONBOARDING_TASKS } from '@/config/onboardingTasks';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { OnboardingProgress } from './OnboardingProgress';
import { OnboardingTaskItem } from './OnboardingTaskItem';

interface OnboardingExpandedProps {
  onCollapse: () => void;
  onDismiss: () => void;
}

export function OnboardingExpanded({ onCollapse, onDismiss }: OnboardingExpandedProps) {
  const { completedTasks, activeTaskId, progress, setActiveTask } = useOnboarding();
  const { navigateToTask } = useOnboardingNavigation();

  const handleTaskClick = (taskId: string) => {
    const task = ONBOARDING_TASKS.find((t) => t.id === taskId);
    if (task && !completedTasks.includes(taskId)) {
      setActiveTask(taskId);
      navigateToTask(task);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="w-80 rounded-xl border border-border bg-card shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-onboarding-gradient-start to-onboarding-gradient-end">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Getting Started</h3>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length} of {ONBOARDING_TASKS.length} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onCollapse}
            className="rounded-lg p-1.5 hover:bg-accent"
            aria-label="Collapse"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onDismiss}
            className="rounded-lg p-1.5 hover:bg-accent"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <OnboardingProgress progress={progress} />
      </div>

      {/* Task List */}
      <div className="max-h-[320px] overflow-y-auto px-2 pb-2">
        {ONBOARDING_TASKS.map((task) => (
          <OnboardingTaskItem
            key={task.id}
            task={task}
            isCompleted={completedTasks.includes(task.id)}
            isActive={activeTaskId === task.id}
            onClick={() => handleTaskClick(task.id)}
          />
        ))}
      </div>

      {/* Skip Button */}
      <div className="border-t border-border p-3">
        <button
          onClick={onDismiss}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Skip onboarding
        </button>
      </div>
    </motion.div>
  );
}
