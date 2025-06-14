
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Room {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    if (!user) {
      setRooms([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to load rooms');
      } else {
        setRooms(data || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (name: string = 'New Room') => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating room:', error);
        toast.error('Failed to create room');
        return null;
      }

      setRooms(prev => [data, ...prev]);
      toast.success('Room created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
      return null;
    }
  };

  const editRoom = async (roomId: string, newName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ name: newName })
        .eq('id', roomId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating room:', error);
        toast.error('Failed to update room');
        return;
      }

      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, name: newName, updated_at: new Date().toISOString() } : room
      ));
      toast.success('Room updated successfully');
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    }
  };

  const deleteRoom = async (roomId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
        return;
      }

      setRooms(prev => prev.filter(room => room.id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [user]);

  // Set up real-time subscription for rooms - fix multiple subscription issue
  useEffect(() => {
    if (!user) return;

    // Create a unique channel name with timestamp to avoid conflicts
    const channelName = `rooms-changes-${user.id}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Room change:', payload);
        fetchRooms(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    rooms,
    loading,
    addRoom,
    editRoom,
    deleteRoom,
    refreshRooms: fetchRooms
  };
};
