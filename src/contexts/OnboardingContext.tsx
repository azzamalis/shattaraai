import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ONBOARDING_TASKS, isOnboardingVisibleOnRoute, OnboardingTask } from '@/config/onboardingTasks';

const STORAGE_KEY = 'shattara_onboarding';

interface OnboardingState {
  completedTasks: string[];
  dismissed: boolean;
  completedAt: string | null;
}

interface OnboardingContextType {
  // State
  completedTasks: string[];
  activeTaskId: string | null;
  isExpanded: boolean;
  isCompleted: boolean;
  isDismissed: boolean;
  shouldShow: boolean;
  currentTask: OnboardingTask | null;
  nextTask: OnboardingTask | null;
  progress: number;
  
  // Actions
  completeTask: (taskId: string) => void;
  setActiveTask: (taskId: string | null) => void;
  toggleExpanded: () => void;
  dismissOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  userCompletedOnboardingForm: boolean;
}

export function OnboardingProvider({
  children,
  isAuthenticated,
  userCompletedOnboardingForm,
}: OnboardingProviderProps) {
  const location = useLocation();
  
  // Load initial state from localStorage
  const [state, setState] = useState<OnboardingState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load onboarding state:', e);
    }
    return {
      completedTasks: [],
      dismissed: false,
      completedAt: null,
    };
  });
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showCompletedMessage, setShowCompletedMessage] = useState(false);
  
  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
    }
  }, [state]);
  
  // Computed values
  const isCompleted = state.completedTasks.length === ONBOARDING_TASKS.length;
  const isDismissed = state.dismissed;
  
  const shouldShow = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!userCompletedOnboardingForm) return false;
    if (isDismissed) return false;
    if (isCompleted && !showCompletedMessage) return false;
    return isOnboardingVisibleOnRoute(location.pathname);
  }, [isAuthenticated, userCompletedOnboardingForm, isDismissed, isCompleted, showCompletedMessage, location.pathname]);
  
  const progress = (state.completedTasks.length / ONBOARDING_TASKS.length) * 100;
  
  const currentTask = useMemo(() => {
    const incompleteTasks = ONBOARDING_TASKS.filter(
      (task) => !state.completedTasks.includes(task.id)
    ).sort((a, b) => a.order - b.order);
    return incompleteTasks[0] || null;
  }, [state.completedTasks]);
  
  const nextTask = useMemo(() => {
    const incompleteTasks = ONBOARDING_TASKS.filter(
      (task) => !state.completedTasks.includes(task.id)
    ).sort((a, b) => a.order - b.order);
    return incompleteTasks[1] || null;
  }, [state.completedTasks]);
  
  // Actions
  const completeTask = useCallback((taskId: string) => {
    setState((prev) => {
      if (prev.completedTasks.includes(taskId)) return prev;
      
      const newCompleted = [...prev.completedTasks, taskId];
      const allCompleted = newCompleted.length === ONBOARDING_TASKS.length;
      
      return {
        ...prev,
        completedTasks: newCompleted,
        completedAt: allCompleted ? new Date().toISOString() : prev.completedAt,
      };
    });
    
    // Auto-advance to next task
    const taskIndex = ONBOARDING_TASKS.findIndex((t) => t.id === taskId);
    const nextTaskInOrder = ONBOARDING_TASKS[taskIndex + 1];
    if (nextTaskInOrder) {
      setActiveTaskId(nextTaskInOrder.id);
    } else {
      setActiveTaskId(null);
      // Show completed message
      setShowCompletedMessage(true);
      setTimeout(() => {
        setShowCompletedMessage(false);
      }, 4000);
    }
  }, []);
  
  const setActiveTask = useCallback((taskId: string | null) => {
    setActiveTaskId(taskId);
  }, []);
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);
  
  const dismissOnboarding = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dismissed: true,
    }));
  }, []);
  
  const resetOnboarding = useCallback(() => {
    setState({
      completedTasks: [],
      dismissed: false,
      completedAt: null,
    });
    setActiveTaskId(null);
    setIsExpanded(true);
    setShowCompletedMessage(false);
  }, []);
  
  const value: OnboardingContextType = {
    completedTasks: state.completedTasks,
    activeTaskId,
    isExpanded,
    isCompleted,
    isDismissed,
    shouldShow: shouldShow || showCompletedMessage,
    currentTask,
    nextTask,
    progress,
    completeTask,
    setActiveTask,
    toggleExpanded,
    dismissOnboarding,
    resetOnboarding,
  };
  
  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
