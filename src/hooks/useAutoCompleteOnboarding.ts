import { useEffect, useCallback } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export type OnboardingEvent =
  | 'content_added'
  | 'summary_generated'
  | 'chat_message_sent'
  | 'flashcards_created'
  | 'quiz_generated';

const EVENT_TO_TASK_MAP: Record<OnboardingEvent, string> = {
  content_added: 'add_content',
  summary_generated: 'summarize_content',
  chat_message_sent: 'chat_tutor',
  flashcards_created: 'create_flashcards',
  quiz_generated: 'generate_quiz',
};

const ONBOARDING_EVENT_NAME = 'onboarding:complete';

interface OnboardingCustomEvent extends CustomEvent {
  detail: { event: OnboardingEvent };
}

// Emit an onboarding event from anywhere in the app
export const emitOnboardingEvent = (event: OnboardingEvent) => {
  window.dispatchEvent(
    new CustomEvent(ONBOARDING_EVENT_NAME, {
      detail: { event },
    })
  );
};

// Hook to listen for onboarding events and auto-complete tasks
export function useAutoCompleteOnboarding() {
  const { completeTask, completedTasks } = useOnboarding();

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as OnboardingCustomEvent;
      const { event } = customEvent.detail;
      const taskId = EVENT_TO_TASK_MAP[event];
      
      if (taskId && !completedTasks.includes(taskId)) {
        completeTask(taskId);
      }
    };

    window.addEventListener(ONBOARDING_EVENT_NAME, handleEvent);
    return () => {
      window.removeEventListener(ONBOARDING_EVENT_NAME, handleEvent);
    };
  }, [completeTask, completedTasks]);
}

// Hook to get the emit function for use in components
export function useOnboardingEmitter() {
  return useCallback((event: OnboardingEvent) => {
    emitOnboardingEvent(event);
  }, []);
}
