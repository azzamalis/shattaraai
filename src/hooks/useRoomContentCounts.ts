
import { useState, useEffect } from 'react';
import { useContentContext } from '@/contexts/ContentContext';

export const useRoomContentCounts = () => {
  const { content } = useContentContext();
  const [contentCounts, setContentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate content counts for each room
    const counts: Record<string, number> = {};
    
    content.forEach(item => {
      if (item.room_id) {
        counts[item.room_id] = (counts[item.room_id] || 0) + 1;
      }
    });

    setContentCounts(counts);
  }, [content]);

  const getContentCountForRoom = (roomId: string): number => {
    return contentCounts[roomId] || 0;
  };

  return {
    contentCounts,
    getContentCountForRoom
  };
};
