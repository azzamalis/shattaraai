import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  storage_path?: string;
  created_at: string;
  updated_at: string;
}

export const useContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async (roomId?: string) => {
    // Don't fetch if auth is still loading
    if (authLoading) {
      console.log('useContent - Auth still loading, waiting...');
      return;
    }

    if (!user) {
      console.log('useContent - No user found after auth loaded, setting empty content');
      setContent([]);
      setLoading(false);
      return;
    }

    console.log('useContent - Fetching content for authenticated user:', user.id);

    try {
      setLoading(true);
      let query = supabase
        .from('content')
        .select('*')
        .eq('user_id', user.id) // Explicitly filter by user_id for RLS
        .order('created_at', { ascending: false });

      if (roomId) {
        query = query.eq('room_id', roomId);
      }

      console.log('useContent - Executing query with user filter...');
      const { data, error } = await query;

      if (error) {
        console.error('useContent - Error fetching content:', error);
        toast.error(`Failed to load content: ${error.message}`);
        setContent([]);
      } else {
        console.log('useContent - Successfully fetched content:', data?.length || 0, 'items');
        // Cast the data to match our ContentItem interface
        setContent((data || []).map(item => ({
          ...item,
          type: item.type as ContentItem['type'],
          metadata: item.metadata as Record<string, any>
        })));
      }
    } catch (error) {
      console.error('useContent - Catch block error:', error);
      toast.error('Failed to load content');
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.log('useContent - No user for addContent');
      return null;
    }

    console.log('useContent - Adding content:', contentData);

    try {
      const { data, error } = await supabase
        .from('content')
        .insert([{ ...contentData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('useContent - Error creating content:', error);
        toast.error(`Failed to create content: ${error.message}`);
        return null;
      }

      console.log('useContent - Successfully created content:', data);

      const newContent = {
        ...data,
        type: data.type as ContentItem['type'],
        metadata: data.metadata as Record<string, any>
      };

      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully');
      return data.id;
    } catch (error) {
      console.error('useContent - Error creating content:', error);
      toast.error('Failed to create content');
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
      // Get the content item to check if it has a storage path
      const contentItem = content.find(item => item.id === contentId);
      
      // Delete file from storage if it exists
      if (contentItem?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('pdf-files')
          .remove([contentItem.storage_path]);
        
        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
          // Don't fail the entire operation if storage deletion fails
        }
      }

      // Delete the content record from database
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

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  // Only fetch content when auth loading is complete
  useEffect(() => {
    console.log('useContent - useEffect triggered, authLoading:', authLoading, 'user:', user?.id);
    
    if (!authLoading) {
      fetchContent();
    }
  }, [user, authLoading]);

  // Set up real-time subscription only when user is authenticated
  useEffect(() => {
    if (!user || authLoading) return;

    console.log('useContent - Setting up realtime subscription for user:', user.id);

    const channelId = `content-${user.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('useContent - Content change:', payload);
        fetchContent(); // Refetch on any change
      })
      .subscribe();

    return () => {
      console.log('useContent - Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, authLoading]);

  return {
    content,
    loading,
    addContent,
    updateContent,
    deleteContent,
    refreshContent: fetchContent,
    recentContent: content.slice(0, 10)
  };
};
