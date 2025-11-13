import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ProcessingProgress {
  status: ProcessingStatus;
  progress?: number;
  currentStep?: string;
  error?: string;
}

export function useRealtimeContentStatus(contentId: string, enableNotifications: boolean = true) {
  const [status, setStatus] = useState<ProcessingProgress>({
    status: 'pending'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!contentId) return;

    // Fetch initial status
    const fetchInitialStatus = async () => {
      const { data } = await supabase
        .from('content')
        .select('processing_status, metadata')
        .eq('id', contentId)
        .single();

      if (data) {
        const metadata = data.metadata as Record<string, any> | null;
        setStatus({
          status: (data.processing_status as ProcessingStatus) || 'pending',
          progress: metadata?.progress,
          currentStep: metadata?.currentStep
        });
      }
    };

    fetchInitialStatus();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`content:${contentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content',
          filter: `id=eq.${contentId}`
        },
        (payload) => {
          const newStatus = payload.new.processing_status as ProcessingStatus;
          const metadata = payload.new.metadata as any;

          setStatus({
            status: newStatus,
            progress: metadata?.progress,
            currentStep: metadata?.currentStep,
            error: metadata?.error
          });

          // Show notification when processing completes
          if (enableNotifications && newStatus === 'completed') {
            toast.success(`${payload.new.title} is ready!`, {
              action: {
                label: 'View',
                onClick: () => navigate(`/content/${contentId}`)
              },
              duration: 10000
            });
          } else if (enableNotifications && newStatus === 'failed') {
            toast.error(`Failed to process ${payload.new.title}`, {
              description: metadata?.error || 'An error occurred during processing'
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [contentId, enableNotifications, navigate]);

  return status;
}
