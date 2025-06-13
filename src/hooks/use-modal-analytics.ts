

import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  user_id?: string | null;
}

export const useModalAnalytics = () => {
  const trackEvent = useCallback(async (eventData: AnalyticsEvent) => {
    try {
      // Get current authenticated user (if any)
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Note: usage_events table doesn't exist in the new Supabase project
      // Commenting out the database insert until the table is created
      console.log('Analytics event tracked locally:', {
        user_id: userId || null,
        type: eventData.event_type,
        session_id: eventData.event_data?.session_id || null,
        input_tokens: eventData.event_data?.input_tokens || null,
        output_tokens: eventData.event_data?.output_tokens || null,
        total_tokens: eventData.event_data?.total_tokens || null,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Uncomment when usage_events table is created in Supabase
      /*
      await supabase
        .from('usage_events')
        .insert({
          user_id: userId || null,
          type: eventData.event_type,
          session_id: eventData.event_data?.session_id || null,
          input_tokens: eventData.event_data?.input_tokens || null,
          output_tokens: eventData.event_data?.output_tokens || null,
          total_tokens: eventData.event_data?.total_tokens || null
        });
      */
      
      console.log('Event tracked:', eventData.event_type);
    } catch (error) {
      // Silently fail to not disrupt user experience
      console.error('Failed to track event:', error);
    }
  }, []);

  const trackModalOpen = useCallback((modalName: string, additionalData?: Record<string, any>) => {
    trackEvent({
      event_type: 'modal_opened',
      event_data: {
        modal_name: modalName,
        ...additionalData
      }
    });
  }, [trackEvent]);

  const trackModalAction = useCallback((modalName: string, action: string, additionalData?: Record<string, any>) => {
    trackEvent({
      event_type: 'modal_action',
      event_data: {
        modal_name: modalName,
        action,
        ...additionalData
      }
    });
  }, [trackEvent]);

  return {
    trackModalOpen,
    trackModalAction,
    trackEvent
  };
};

