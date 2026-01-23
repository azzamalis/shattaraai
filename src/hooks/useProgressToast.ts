import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProgressToast, getStepInfo } from '@/components/ui/progress-toast';
import { createElement } from 'react';

type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ContentUpdate {
  id: string;
  processing_status: ProcessingStatus;
  title: string;
  metadata: Record<string, any>;
}

export function useProgressToast() {
  const navigate = useNavigate();
  const activeToastsRef = useRef<Map<string, string>>(new Map());
  const subscriptionsRef = useRef<Map<string, any>>(new Map());

  const dismissToast = useCallback((contentId: string) => {
    const toastId = activeToastsRef.current.get(contentId);
    if (toastId) {
      toast.dismiss(toastId);
      activeToastsRef.current.delete(contentId);
    }
    
    const subscription = subscriptionsRef.current.get(contentId);
    if (subscription) {
      subscription.unsubscribe();
      subscriptionsRef.current.delete(contentId);
    }
  }, []);

  const updateToast = useCallback((
    contentId: string,
    title: string,
    status: ProcessingStatus,
    step?: string,
    explicitProgress?: number
  ) => {
    const stepInfo = getStepInfo(step, status);
    const progress = explicitProgress ?? stepInfo.progress;
    const message = `${stepInfo.label}... ${title}`;

    const toastId = activeToastsRef.current.get(contentId);
    
    if (toastId) {
      toast.custom(
        () => createElement(ProgressToast, { 
          message, 
          progress, 
          status 
        }),
        { 
          id: toastId,
          duration: status === 'completed' || status === 'failed' ? 3000 : Infinity
        }
      );
    }
  }, []);

  // Start an immediate upload toast before content ID is known
  // Progress is now scaled: 0-50% for upload phase
  const startImmediateUploadToast = useCallback((tempId: string, title: string) => {
    // Create a temporary toast that shows immediately
    const toastId = `upload-${tempId}`;
    
    toast.custom(
      () => createElement(ProgressToast, { 
        message: `Uploading... ${title}`, 
        progress: 2, // Start at 2% for immediate feedback 
        status: 'processing' as ProcessingStatus
      }),
      { 
        duration: Infinity,
        id: toastId
      }
    );
    
    activeToastsRef.current.set(tempId, toastId);
    
    return toastId;
  }, []);

  // Update the temporary upload toast with progress
  // Scale raw upload progress (0-100) to display progress (0-50%)
  const updateUploadProgress = useCallback((tempId: string, title: string, rawProgress: number) => {
    const toastId = activeToastsRef.current.get(tempId);
    if (toastId) {
      // Scale upload progress: 0-100% raw → 2-50% displayed
      // This leaves 50-100% for backend processing stages
      const scaledProgress = Math.round(2 + (rawProgress * 0.48));
      
      toast.custom(
        () => createElement(ProgressToast, { 
          message: `Uploading... ${title}`, 
          progress: scaledProgress, 
          status: 'processing' as ProcessingStatus
        }),
        { 
          id: toastId,
          duration: Infinity
        }
      );
    }
  }, []);

  // Transition from temp upload toast to real content tracking
  const transitionToContentTracking = useCallback((tempId: string, contentId: string, title: string) => {
    // Remove the temp toast tracking
    const oldToastId = activeToastsRef.current.get(tempId);
    if (oldToastId) {
      toast.dismiss(oldToastId);
      activeToastsRef.current.delete(tempId);
    }
    
    // Start real content tracking
    startProgressToastInternal(contentId, title);
  }, []);

  const startProgressToastInternal = useCallback((contentId: string, title: string) => {
    // Check if we already have a toast for this content
    if (activeToastsRef.current.has(contentId)) {
      return;
    }

    // Create initial toast - start at 52% since upload (0-50%) is complete
    const toastId = toast.custom(
      () => createElement(ProgressToast, { 
        message: `Processing... ${title}`, 
        progress: 52, 
        status: 'processing' as ProcessingStatus
      }),
      { 
        duration: Infinity,
        id: `progress-${contentId}`
      }
    );
    
    activeToastsRef.current.set(contentId, `progress-${contentId}`);

    // Subscribe to real-time updates for this content
    const channel = supabase
      .channel(`progress-${contentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          const update = payload.new as ContentUpdate;
          const status = update.processing_status as ProcessingStatus;
          const metadata = update.metadata || {};
          const step = metadata.currentStep || metadata.step;
          const progress = metadata.progress;

          updateToast(contentId, update.title || title, status, step, progress);

          // Handle completion
          if (status === 'completed') {
            setTimeout(() => {
              dismissToast(contentId);
              navigate(`/content/${contentId}`);
            }, 1500);
          } else if (status === 'failed') {
            setTimeout(() => {
              dismissToast(contentId);
            }, 3000);
          }
        }
      )
      .subscribe();

    subscriptionsRef.current.set(contentId, channel);

    // Also fetch current status in case it changed before subscription was ready
    const fetchCurrentStatus = async () => {
      const { data } = await supabase
        .from('content')
        .select('processing_status, title, metadata')
        .eq('id', contentId)
        .single();

      if (data) {
        const status = (data.processing_status as ProcessingStatus) || 'pending';
        const metadata = (data.metadata as Record<string, any>) || {};
        
        if (status === 'completed') {
          updateToast(contentId, data.title || title, status);
          setTimeout(() => {
            dismissToast(contentId);
            navigate(`/content/${contentId}`);
          }, 1500);
        } else if (status === 'failed') {
          updateToast(contentId, data.title || title, status);
          setTimeout(() => {
            dismissToast(contentId);
          }, 3000);
        } else if (status === 'processing' && metadata.currentStep) {
          updateToast(contentId, data.title || title, status, metadata.currentStep, metadata.progress);
        }
      }
    };

    // Delay initial fetch to allow DB to settle
    setTimeout(fetchCurrentStatus, 500);
  }, [navigate, updateToast, dismissToast]);

  const startProgressToast = useCallback((contentId: string, title: string) => {
    startProgressToastInternal(contentId, title);
  }, [startProgressToastInternal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionsRef.current.clear();
      activeToastsRef.current.clear();
    };
  }, []);

  return { 
    startProgressToast, 
    dismissToast, 
    startImmediateUploadToast, 
    updateUploadProgress,
    transitionToContentTracking 
  };
}
