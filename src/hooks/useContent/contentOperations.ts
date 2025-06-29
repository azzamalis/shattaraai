
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContentItem } from './types';

export const fetchContentFromDB = async (userId: string, roomId?: string) => {
  let query = supabase
    .from('content')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (roomId) {
    query = query.eq('room_id', roomId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching content:', error);
    toast.error('Failed to load content');
    return [];
  }

  return (data || []).map(item => ({
    ...item,
    type: item.type as ContentItem['type'],
    metadata: item.metadata as Record<string, any>
  }));
};

export const fetchContentByIdFromDB = async (contentId: string, userId: string): Promise<ContentItem | null> => {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .eq('user_id', userId)
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

export const createContentInDB = async (
  contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  userId: string
) => {
  // Ensure we're not storing blob URLs
  const cleanedContentData = {
    ...contentData,
    url: contentData.url && contentData.url.startsWith('blob:') ? undefined : contentData.url,
    storage_path: contentData.storage_path && contentData.storage_path.startsWith('blob:') ? undefined : contentData.storage_path
  };

  const { data, error } = await supabase
    .from('content')
    .insert([{ ...cleanedContentData, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating content:', error);
    toast.error('Failed to create content');
    return null;
  }

  toast.success('Content created successfully');
  return {
    ...data,
    type: data.type as ContentItem['type'],
    metadata: data.metadata as Record<string, any>
  };
};

export const updateContentInDB = async (
  contentId: string,
  updates: Partial<ContentItem>,
  userId: string
) => {
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
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating content:', error);
    toast.error('Failed to update content');
    throw error;
  }

  toast.success('Content updated successfully');
  return cleanedUpdates;
};

export const deleteContentFromDB = async (contentId: string, userId: string) => {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', contentId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting content:', error);
    toast.error('Failed to delete content');
    throw error;
  }

  toast.success('Content deleted successfully');
};
