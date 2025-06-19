import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Room {
  id: string;
  name: string;
  description?: string | null;
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
    if (!user) {
      console.error('No authenticated user found');
      toast.error('You must be logged in to create a room');
      return null;
    }

    console.log('Creating room with user_id:', user.id, 'and name:', name);

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([{ 
          name, 
          user_id: user.id 
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating room:', error);
        
        // Provide more specific error messages
        if (error.message.includes('row-level security')) {
          toast.error('Permission denied: Unable to create room');
        } else if (error.message.includes('violates')) {
          toast.error('Database constraint violation');
        } else {
          toast.error(`Failed to create room: ${error.message}`);
        }
        return null;
      }

      console.log('Room created successfully:', data);
      setRooms(prev => [data, ...prev]);
      toast.success('Room created successfully');
      return data.id;
    } catch (error) {
      console.error('Unexpected error creating room:', error);
      toast.error('An unexpected error occurred while creating the room');
      return null;
    }
  };

  const editRoom = async (roomId: string, newName: string, newDescription?: string) => {
    if (!user) return;

    try {
      const updateData: { name: string; description?: string } = { name: newName };
      if (newDescription !== undefined) {
        updateData.description = newDescription;
      }

      const { error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', roomId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating room:', error);
        toast.error('Failed to update room');
        return;
      }

      setRooms(prev => prev.map(room => 
        room.id === roomId ? { 
          ...room, 
          name: newName, 
          description: newDescription !== undefined ? newDescription : room.description,
          updated_at: new Date().toISOString() 
        } : room
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

  // Set up real-time subscription for rooms - ensure unique channel and proper cleanup
  useEffect(() => {
    if (!user) return;

    // Create a completely unique channel name to avoid conflicts
    const channelId = `rooms-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
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
      // Properly cleanup the channel
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
