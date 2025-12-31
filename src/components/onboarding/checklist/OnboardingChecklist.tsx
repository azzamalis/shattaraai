import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ONBOARDING_TASKS } from '@/config/onboardingTasks';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { OnboardingExpanded } from './OnboardingExpanded';
import { OnboardingCollapsed } from './OnboardingCollapsed';
import { OnboardingCompleted } from './OnboardingCompleted';
import { Coachmark } from './Coachmark';
import { Confetti } from './Confetti';

// Milestone tasks that trigger confetti (1st, 3rd, 5th)
const CONFETTI_MILESTONES = [1, 3, 5];

export function OnboardingChecklist() {
  const {
    shouldShow,
    isExpanded,
    isCompleted,
    toggleExpanded,
    dismissOnboarding,
    activeTaskId,
    setActiveTask,
    completedTasks,
  } = useOnboarding();

  const [showConfetti, setShowConfetti] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(completedTasks.length);

  // Check for confetti triggers
  useEffect(() => {
    const currentCount = completedTasks.length;
    if (currentCount > prevCompletedCount && CONFETTI_MILESTONES.includes(currentCount)) {
      setShowConfetti(true);
    }
    setPrevCompletedCount(currentCount);
  }, [completedTasks.length, prevCompletedCount]);

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const activeTask = activeTaskId
    ? ONBOARDING_TASKS.find((t) => t.id === activeTaskId)
    : null;

  if (!shouldShow) return null;

  return (
    <>
      {/* Confetti */}
      <Confetti isActive={showConfetti} onComplete={handleConfettiComplete} />

      {/* Coachmark */}
      {activeTask && !completedTasks.includes(activeTask.id) && (
        <Coachmark task={activeTask} onDismiss={() => setActiveTask(null)} />
      )}

      {/* Main Checklist */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence mode="wait">
          {isCompleted ? (
            <OnboardingCompleted key="completed" onDismiss={dismissOnboarding} />
          ) : isExpanded ? (
            <OnboardingExpanded
              key="expanded"
              onCollapse={toggleExpanded}
              onDismiss={dismissOnboarding}
            />
          ) : (
            <OnboardingCollapsed key="collapsed" onExpand={toggleExpanded} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
