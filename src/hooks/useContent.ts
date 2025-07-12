
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { uploadFileToStorage, uploadPastedContentMetadata, deleteFileFromStorage, isStorageUrl, StorageContentType, getStorageBucket } from '@/lib/storage';

export interface ContentItem {
  id: string;
  user_id: string;
  room_id: string | null;
  title: string;
  type: 'file' | 'video' | 'pdf' | 'live_recording' | 'audio_file' | 'youtube' | 'website' | 'text' | 'chat' | 'upload' | 'recording';
  url?: string;
  text_content?: string;
  filename?: string;
  storage_path?: string;
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

  const fetchContentById = async (contentId: string): Promise<ContentItem | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching content by ID:', error);
        return null;
      }

      return {
        ...data,
        type: data.type as ContentItem['type'],
        metadata: data.metadata as Record<string, any>
      };
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      return null;
    }
  };

  const addContent = async (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      // Ensure we're not storing blob URLs
      const cleanedContentData = {
        ...contentData,
        url: contentData.url && contentData.url.startsWith('blob:') ? undefined : contentData.url,
        storage_path: contentData.storage_path && contentData.storage_path.startsWith('blob:') ? undefined : contentData.storage_path
      };

      const { data, error } = await supabase
        .from('content')
        .insert([{ ...cleanedContentData, user_id: user.id }])
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
      
      // Handle file upload for ALL file-based content types
      if (file) {
        const storageContentType = mapContentTypeToStorage(contentData.type);
        if (storageContentType) {
          console.log('useContent: Uploading file to storage:', {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            storageContentType,
            userId: user.id
          });
          
          const uploadedUrl = await uploadFileToStorage(file, storageContentType, user.id);
          console.log('useContent: File uploaded successfully to:', uploadedUrl);
          
          // Store the proper Supabase storage URL
          finalContentData.url = uploadedUrl;
          finalContentData.storage_path = uploadedUrl;
          finalContentData.filename = file.name;
          
          // Add comprehensive file metadata
          finalContentData.metadata = {
            ...finalContentData.metadata,
            fileSize: file.size,
            fileType: file.type,
            isUploadedFile: true,
            uploadedAt: new Date().toISOString(),
            storageUrl: uploadedUrl,
            storageBucket: getStorageBucket(storageContentType)
          };
        } else {
          console.error('useContent: Unsupported file type for storage:', contentData.type);
          throw new Error(`Unsupported file type: ${contentData.type}`);
        }
      }

      // Clean any potential blob URLs before saving
      finalContentData.url = finalContentData.url && finalContentData.url.startsWith('blob:') ? undefined : finalContentData.url;
      finalContentData.storage_path = finalContentData.storage_path && finalContentData.storage_path.startsWith('blob:') ? undefined : finalContentData.storage_path;

      return await addContent(finalContentData);
    } catch (error) {
      console.error('Error creating content with file:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  // Enhanced addContent function to handle pasted content metadata storage
  const addContentWithMetadata = async (
    contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    metadata?: any
  ) => {
    if (!user) return null;

    try {
      let finalContentData = { ...contentData };
      
      // For pasted content types, store metadata in their respective storage buckets
      if (metadata && ['youtube', 'website', 'chat', 'text'].includes(contentData.type)) {
        try {
          // Generate a temporary ID for the metadata file
          const tempId = crypto.randomUUID();
          const metadataUrl = await uploadPastedContentMetadata(
            metadata, 
            contentData.type as 'youtube' | 'website' | 'chat' | 'text',
            user.id,
            tempId
          );
          
          // Store metadata URL in the content metadata
          finalContentData.metadata = {
            ...finalContentData.metadata,
            metadataStoragePath: metadataUrl,
            uploadedAt: new Date().toISOString()
          };
        } catch (metadataError) {
          console.warn('Failed to upload metadata to storage:', metadataError);
          // Continue without storing metadata - not critical
        }
      }

      // Clean any potential blob URLs before saving
      finalContentData.url = finalContentData.url && finalContentData.url.startsWith('blob:') ? undefined : finalContentData.url;
      finalContentData.storage_path = finalContentData.storage_path && finalContentData.storage_path.startsWith('blob:') ? undefined : finalContentData.storage_path;

      const contentId = await addContent(finalContentData);
      
      // For YouTube content, trigger extraction of video data
      if (contentId && contentData.type === 'youtube' && contentData.url) {
        try {
          console.log('Triggering YouTube data extraction for:', contentData.url);
          await supabase.functions.invoke('youtube-extractor', {
            body: {
              url: contentData.url,
              contentId: contentId
            }
          });
          toast.success('YouTube video data is being extracted...');
        } catch (extractionError) {
          console.error('Failed to extract YouTube data:', extractionError);
          toast.error('YouTube data extraction failed, but content was saved');
        }
      }
      
      return contentId;
    } catch (error) {
      console.error('Error creating content with metadata:', error);
      toast.error('Failed to create content');
      return null;
    }
  };

  const updateContent = async (contentId: string, updates: Partial<ContentItem>) => {
    if (!user) return;

    try {
      // Clean any potential blob URLs before updating
      const cleanedUpdates = {
        ...updates,
        url: updates.url && updates.url.startsWith('blob:') ? undefined : updates.url,
        storage_path: updates.storage_path && updates.storage_path.startsWith('blob:') ? undefined : updates.storage_path
      };

      const { error } = await supabase
        .from('content')
        .update(cleanedUpdates)
        .eq('id', contentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating content:', error);
        toast.error('Failed to update content');
        return;
      }

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...cleanedUpdates, updated_at: new Date().toISOString() } : item
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

      // If the content has a storage URL, delete the file from storage
      if (contentItem?.url && isStorageUrl(contentItem.url)) {
        try {
          const storageContentType = mapContentTypeToStorage(contentItem.type);
          await deleteFileFromStorage(contentItem.url, storageContentType);
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Don't show error to user as the content record was already deleted
        }
      }

      // Also delete metadata files if they exist
      if (contentItem?.metadata?.metadataStoragePath && isStorageUrl(contentItem.metadata.metadataStoragePath)) {
        try {
          const storageContentType = mapContentTypeToStorage(contentItem.type);
          await deleteFileFromStorage(contentItem.metadata.metadataStoragePath, storageContentType);
        } catch (storageError) {
          console.error('Error deleting metadata from storage:', storageError);
        }
      }

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  // Helper function to map content types to storage types
  const mapContentTypeToStorage = (contentType: ContentItem['type']): StorageContentType | null => {
    const mapping: Record<ContentItem['type'], StorageContentType | null> = {
      'pdf': 'pdf',
      'file': 'file',
      'video': 'video',
      'audio_file': 'audio_file',
      'upload': 'upload',
      'recording': 'recording',
      'live_recording': 'live_recording',
      // Pasted content types now have storage support
      'youtube': 'youtube',
      'website': 'website',
      'text': 'text',
      'chat': 'chat'
    };
    return mapping[contentType];
  };

  useEffect(() => {
    if (user) {
      fetchContent();
    }
  }, [user?.id]); // Use user.id instead of user object

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    
    const channelId = `content-realtime-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (!mounted) return;
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
        if (!mounted) return;
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription active for content');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error for content');
        }
      });

    return () => {
      mounted = false;
      console.log('Cleaning up real-time subscription');
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Use user.id instead of user object

  return {
    content,
    loading,
    addContent,
    addContentWithFile,
    addContentWithMetadata, // Enhanced function exposed
    updateContent,
    deleteContent,
    refreshContent: fetchContent,
    recentContent: content.slice(0, 10),
    fetchContentById
  };
};
