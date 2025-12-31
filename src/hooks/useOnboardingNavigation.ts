import { useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OnboardingTask } from '@/config/onboardingTasks';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { supabase } from '@/integrations/supabase/client';

type TabSetter = (tab: string) => void;

// Global registry for tab setters
let globalTabSetter: TabSetter | null = null;

export const registerTabSetter = (setter: TabSetter) => {
  globalTabSetter = setter;
};

export const unregisterTabSetter = () => {
  globalTabSetter = null;
};

// Get most recent content ID for navigation
const getMostRecentContentId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('content')
      .select('id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data.id;
  } catch {
    return null;
  }
};

export function useOnboardingNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const setTabAfterNavigation = useCallback((tab: string, delay: number = 100) => {
    setTimeout(() => {
      if (globalTabSetter) {
        globalTabSetter(tab);
      }
    }, delay);
  }, []);

  const navigateToTask = useCallback(
    async (task: OnboardingTask) => {
      // Set active task for coachmark
      setActiveTask(task.id);

      const currentPath = location.pathname;

      // Handle dashboard route
      if (task.route === '/dashboard') {
        if (currentPath !== '/dashboard') {
          navigate('/dashboard');
        }
        // Highlight target element after navigation
        setTimeout(() => highlightElement(task.targetId), 300);
        return;
      }

      // Handle content routes - need to find or navigate to content
      if (task.route === '/content') {
        // Check if we're already on a content page
        const isOnContentPage = currentPath.startsWith('/content/');
        
        if (isOnContentPage) {
          // Already on content page, just switch tab
          if (task.tab && globalTabSetter) {
            globalTabSetter(task.tab);
          }
          setTimeout(() => highlightElement(task.targetId), 300);
        } else {
          // Need to navigate to content - get most recent content
          const contentId = await getMostRecentContentId();
          
          if (contentId) {
            // Navigate to content page with tab parameter
            const searchParams = new URLSearchParams();
            if (task.tab) {
              searchParams.set('tab', task.tab);
            }
            const url = `/content/${contentId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
            navigate(url);
            
            // Set tab and highlight after navigation
            if (task.tab) {
              setTabAfterNavigation(task.tab, 500);
            }
            setTimeout(() => highlightElement(task.targetId), 600);
          } else {
            // No content exists, redirect to dashboard to add content first
            navigate('/dashboard');
            setTimeout(() => {
              highlightElement('onboarding-upload-zone');
            }, 300);
          }
        }
        return;
      }

      // Default behavior for other routes
      if (!currentPath.startsWith(task.route)) {
        navigate(task.route);
      }
      
      if (task.tab && globalTabSetter) {
        globalTabSetter(task.tab);
      }
      
      setTimeout(() => highlightElement(task.targetId), 300);
    },
    [navigate, location.pathname, setActiveTask, highlightElement, setTabAfterNavigation]
  );

  return {
    navigateToTask,
    highlightElement,
    registerTabSetter,
    unregisterTabSetter,
  };
}
