
import { useCallback } from 'react';
import { supabaseClient } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  user_id?: string | null;
}

export const useModalAnalytics = () => {
  const trackEvent = useCallback(async (eventData: AnalyticsEvent) => {
    try {
      // Get current authenticated user (if any)
      const { data: { session } } = await supabaseClient.auth.getSession();
      const userId = session?.user?.id;
      
      // Track the event in the usage_events table
      await supabaseClient
        .from('usage_events')
        .insert({
          user_id: userId || null,
          event_type: eventData.event_type,
          event_data: eventData.event_data || {},
          source: 'web',
          ip_address: null, // This should be handled server-side for accuracy
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString()
        });
      
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
