
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { DbRecording } from '@/lib/types';

export interface Recording extends DbRecording {
  // Additional computed properties can be added here
}

export const useRecordings = (contentId?: string) => {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = async () => {
    if (!user) {
      setRecordings([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (contentId) {
        query = query.eq('content_id', contentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recordings:', error);
        toast.error('Failed to load recordings');
      } else {
        setRecordings(data || []);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const createRecording = async (recordingData: Omit<Recording, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert([recordingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating recording:', error);
        toast.error('Failed to create recording');
        return null;
      }

      setRecordings(prev => [data, ...prev]);
      toast.success('Recording created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating recording:', error);
      toast.error('Failed to create recording');
      return null;
    }
  };

  const updateRecording = async (recordingId: string, updates: Partial<Recording>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recordings')
        .update(updates)
        .eq('id', recordingId);

      if (error) {
        console.error('Error updating recording:', error);
        toast.error('Failed to update recording');
        return;
      }

      setRecordings(prev => prev.map(item => 
        item.id === recordingId ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));
      toast.success('Recording updated successfully');
    } catch (error) {
      console.error('Error updating recording:', error);
      toast.error('Failed to update recording');
    }
  };

  const deleteRecording = async (recordingId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('recordings')
        .delete()
        .eq('id', recordingId);

      if (error) {
        console.error('Error deleting recording:', error);
        toast.error('Failed to delete recording');
        return;
      }

      setRecordings(prev => prev.filter(item => item.id !== recordingId));
      toast.success('Recording deleted successfully');
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Failed to delete recording');
    }
  };

  const uploadAudioFile = async (file: File, recordingId: string) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${recordingId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('audio-recordings')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading audio file:', uploadError);
        toast.error('Failed to upload audio file');
        return null;
      }

      // Update recording with file path
      await updateRecording(recordingId, {
        audio_file_path: fileName,
        processing_status: 'processing'
      });

      return fileName;
    } catch (error) {
      console.error('Error uploading audio file:', error);
      toast.error('Failed to upload audio file');
      return null;
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [user, contentId]);

  // Set up real-time subscription for recordings
  useEffect(() => {
    if (!user) return;

    const channelId = `recordings-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recordings',
      }, (payload) => {
        console.log('Recording change:', payload);
        fetchRecordings(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    recordings,
    loading,
    createRecording,
    updateRecording,
    deleteRecording,
    uploadAudioFile,
    refreshRecordings: fetchRecordings
  };
};
