
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { uploadPDFToStorage, deletePDFFromStorage, isPDFStorageUrl } from '@/lib/storage';

export interface ContentItem {
  id: string;
  user_id: string;
  room_id: string | null;
  title: string;
  type: 'file' | 'video' | 'pdf' | 'live_recording' | 'audio_file' | 'youtube' | 'website' | 'text' | 'chat' | 'upload' | 'recording';
  url?: string;
  text_content?: string;
  filename?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useContent = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async (roomId?: string) => {
    if (!user) {
      setContent([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (roomId) {
        query = query.eq('room_id', roomId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching content:', error);
        toast.error('Failed to load content');
      } else {
        // Cast the data to match our ContentItem interface
        setContent((data || []).map(item => ({
          ...item,
          type: item.type as ContentItem['type'],
          metadata: item.metadata as Record<string, any>
        })));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('content')
        .insert([{ ...contentData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating content:', error);
        toast.error('Failed to create content');
        return null;
      }

      const newContent = {
        ...data,
        type: data.type as ContentItem['type'],
        metadata: data.metadata as Record<string, any>
      };

      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
      return null;
    }
  };

  const addContentWithFile = async (
    contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    file?: File
  ) => {
    if (!user) return null;

    try {
      let finalContentData = { ...contentData };
      
      // If it's a PDF file, upload to storage
      if (file && contentData.type === 'pdf') {
        const uploadedUrl = await uploadPDFToStorage(file, user.id);
        finalContentData.url = uploadedUrl;
      }

      return await addContent(finalContentData);
    } catch (error) {
      console.error('Error creating content with file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  const updateContent = async (contentId: string, updates: Partial<ContentItem>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('content')
        .update(updates)
        .eq('id', contentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating content:', error);
        toast.error('Failed to update content');
        return;
      }

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!user) return;

    try {
      // Get the content item to check if it has a storage URL
      const contentItem = content.find(item => item.id === contentId);
      
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
        return;
      }

      // If the content has a PDF storage URL, delete the file from storage
      if (contentItem?.url && isPDFStorageUrl(contentItem.url)) {
        try {
          await deletePDFFromStorage(contentItem.url);
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Don't show error to user as the content record was already deleted
        }
      }

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  useEffect(() => {
    fetchContent();
  }, [user]);

  // Set up real-time subscription for content - ensure unique channel and proper cleanup
  useEffect(() => {
    if (!user) return;

    // Create a completely unique channel name to avoid conflicts
    const channelId = `content-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Content change:', payload);
        fetchContent(); // Refetch on any change
      })
      .subscribe();

    return () => {
      // Properly cleanup the channel
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    content,
    loading,
    addContent,
    addContentWithFile,
    updateContent,
    deleteContent,
    refreshContent: fetchContent,
    recentContent: content.slice(0, 10)
  };
};
