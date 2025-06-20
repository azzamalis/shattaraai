
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RoomContentCount {
  roomId: string;
  count: number;
}

export const useRoomContentCounts = () => {
  const { user } = useAuth();
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchContentCounts = async () => {
    if (!user) {
      setContentCounts({});
      setLoading(false);
      return;
    }

    try {
      // Get content counts for each room
      const { data, error } = await supabase
        .from('content')
        .select('room_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching content counts:', error);
        return;
      }

      // Count content per room
      const counts: Record<string, number> = {};
      data?.forEach(item => {
        if (item.room_id) {
          counts[item.room_id] = (counts[item.room_id] || 0) + 1;
        }
      });

      setContentCounts(counts);
    } catch (error) {
      console.error('Error fetching content counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContentCounts();
  }, [user]);

  // Set up real-time subscription for content changes
  useEffect(() => {
    if (!user) return;

    const channelId = `content-counts-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchContentCounts(); // Refetch counts on any content change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getContentCount = (roomId: string): number => {
    return contentCounts[roomId] || 0;
  };

  return {
    contentCounts,
    loading,
    getContentCount,
    refreshCounts: fetchContentCounts
  };
};
