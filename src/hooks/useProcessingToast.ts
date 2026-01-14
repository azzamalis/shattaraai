import { useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { ProcessingToast, ContentType } from '@/components/ui/processing-toast';
import React from 'react';

interface ProcessingToastOptions {
  contentId: string;
  title: string;
  contentType: ContentType;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export function useProcessingToast() {
  const activeToasts = useRef<Map<string, string | number>>(new Map());

  const showProcessingToast = useCallback(({ 
    contentId, 
    title, 
    contentType,
    onComplete,
    onError 
  }: ProcessingToastOptions) => {
    // Dismiss any existing toast for this content
    const existingToastId = activeToasts.current.get(contentId);
    if (existingToastId) {
      toast.dismiss(existingToastId);
    }

    // Create the toast with custom component
    const toastId = toast.custom(
      () => React.createElement(ProcessingToast, {
        contentId,
        title,
        contentType,
        onComplete: () => {
          // Auto-dismiss after completion with delay
          setTimeout(() => {
            toast.dismiss(toastId);
            activeToasts.current.delete(contentId);
          }, 5000);
          onComplete?.();
        },
        onError: (error: string) => {
          // Keep error toast visible longer
          setTimeout(() => {
            toast.dismiss(toastId);
            activeToasts.current.delete(contentId);
          }, 10000);
          onError?.(error);
        }
      }),
      {
        duration: Infinity, // Don't auto-dismiss - we control this
        id: `processing-${contentId}`,
      }
    );

    activeToasts.current.set(contentId, toastId);
    return toastId;
  }, []);

  const dismissProcessingToast = useCallback((contentId: string) => {
    const toastId = activeToasts.current.get(contentId);
    if (toastId) {
      toast.dismiss(toastId);
      activeToasts.current.delete(contentId);
    }
  }, []);

  const dismissAllProcessingToasts = useCallback(() => {
    activeToasts.current.forEach((toastId) => {
      toast.dismiss(toastId);
    });
    activeToasts.current.clear();
  }, []);

  return {
    showProcessingToast,
    dismissProcessingToast,
    dismissAllProcessingToasts
  };
}
