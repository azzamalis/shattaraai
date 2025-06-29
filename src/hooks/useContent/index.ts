
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ContentItem } from './types';
import { 
  fetchContentFromDB, 
  fetchContentByIdFromDB, 
  createContentInDB, 
  updateContentInDB, 
  deleteContentFromDB 
} from './contentOperations';
import { 
  handleFileUpload, 
  handleMetadataUpload, 
  handleStorageCleanup 
} from './storageHelpers';
import { useContentRealtime } from './realtimeSubscription';

export { ContentItem } from './types';

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
      const data = await fetchContentFromDB(user.id, roomId);
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentById = async (contentId: string): Promise<ContentItem | null> => {
    if (!user) return null;
    return await fetchContentByIdFromDB(contentId, user.id);
  };

  const addContent = async (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const newContent = await createContentInDB(contentData, user.id);
      if (newContent) {
        setContent(prev => [newContent, ...prev]);
        return newContent.id;
      }
      return null;
    } catch (error) {
      console.error('Error creating content:', error);
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
      
      // Handle file upload for supported types
      if (file) {
        try {
          const { url, filename } = await handleFileUpload(file, contentData.type, user.id);
          finalContentData.url = url;
          finalContentData.storage_path = url;
          finalContentData.filename = filename;
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }

      return await addContent(finalContentData);
    } catch (error) {
      console.error('Error creating content with file:', error);
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
      
      // For pasted content types, optionally store metadata in their respective storage buckets
      if (metadata && ['youtube', 'website', 'chat', 'text'].includes(contentData.type)) {
        const tempId = crypto.randomUUID();
        const metadataUrl = await handleMetadataUpload(
          metadata, 
          contentData.type as 'youtube' | 'website' | 'chat' | 'text',
          user.id,
          tempId
        );
        
        if (metadataUrl) {
          finalContentData.metadata = {
            ...finalContentData.metadata,
            metadataStoragePath: metadataUrl
          };
        }
      }

      return await addContent(finalContentData);
    } catch (error) {
      console.error('Error creating content with metadata:', error);
      return null;
    }
  };

  const updateContent = async (contentId: string, updates: Partial<ContentItem>) => {
    if (!user) return;

    try {
      await updateContentInDB(contentId, updates, user.id);
      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!user) return;

    try {
      // Get the content item to check if it has a storage URL
      const contentItem = content.find(item => item.id === contentId);
      
      await deleteContentFromDB(contentId, user.id);

      // If the content has a storage URL, delete the file from storage
      if (contentItem) {
        await handleStorageCleanup(contentItem);
      }

      setContent(prev => prev.filter(item => item.id !== contentId));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [user]);

  // Set up real-time subscription
  useContentRealtime(user?.id, setContent);

  return {
    content,
    loading,
    addContent,
    addContentWithFile,
    addContentWithMetadata,
    updateContent,
    deleteContent,
    refreshContent: fetchContent,
    recentContent: content.slice(0, 10),
    fetchContentById
  };
};
