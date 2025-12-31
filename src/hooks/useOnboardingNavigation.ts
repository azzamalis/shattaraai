import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingTask } from '@/config/onboardingTasks';
import { useOnboarding } from '@/contexts/OnboardingContext';

type TabSetter = (tab: string) => void;

// Global registry for tab setters
let globalTabSetter: TabSetter | null = null;

export const registerTabSetter = (setter: TabSetter) => {
  globalTabSetter = setter;
};

export const unregisterTabSetter = () => {
  globalTabSetter = null;
};

export function useOnboardingNavigation() {
  const navigate = useNavigate();
  const { setActiveTask } = useOnboarding();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const highlightElement = useCallback((targetId: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Wait for DOM to update
    timeoutRef.current = setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        // Scroll into view
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });

        // Add highlight effect
        element.classList.add('onboarding-highlight-pulse');
        
        // Remove highlight after animation
        setTimeout(() => {
          element.classList.remove('onboarding-highlight-pulse');
        }, 2000);
      }
    }, 300);
  }, []);

  const navigateToTask = useCallback(
    (task: OnboardingTask) => {
      // Set active task for coachmark
      setActiveTask(task.id);

      // Check if we need to navigate
      const currentPath = window.location.pathname;
      const needsNavigation = !currentPath.startsWith(task.route);

      if (needsNavigation) {
        // For content pages, we need a content ID
        // The task.route is just the base - actual navigation depends on context
        // For now, navigate to dashboard if that's the route
        if (task.route === '/dashboard') {
          navigate('/dashboard');
        }
        // For content routes, we can't navigate without a content ID
        // The user needs to have content first
      }

      // Set tab if specified
      if (task.tab && globalTabSetter) {
        globalTabSetter(task.tab);
      }

      // Highlight target element
      highlightElement(task.targetId);
    },
    [navigate, setActiveTask, highlightElement]
  );

  return {
    navigateToTask,
    highlightElement,
    registerTabSetter,
    unregisterTabSetter,
  };
}
