
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ContentItem } from './types';

export const useContentRealtime = (
  userId: string | undefined,
  setContent: React.Dispatch<React.SetStateAction<ContentItem[]>>
) => {
  useEffect(() => {
    if (!userId) return;

    const channelId = `content-realtime-${userId}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('Real-time content change:', payload);
        
        // Handle different event types
        switch (payload.eventType) {
          case 'INSERT':
            const newItem = {
              ...payload.new,
              type: payload.new.type as ContentItem['type'],
              metadata: payload.new.metadata as Record<string, any>
            } as ContentItem;
            setContent(prev => {
              // Avoid duplicates
              if (prev.some(item => item.id === newItem.id)) return prev;
              return [newItem, ...prev];
            });
            break;
            
          case 'UPDATE':
            const updatedItem = {
              ...payload.new,
              type: payload.new.type as ContentItem['type'],
              metadata: payload.new.metadata as Record<string, any>
            } as ContentItem;
            setContent(prev => prev.map(item => 
              item.id === updatedItem.id ? updatedItem : item
            ));
            break;
            
          case 'DELETE':
            setContent(prev => prev.filter(item => item.id !== payload.old.id));
            break;
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription active for content');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error for content');
        }
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, setContent]);
};
