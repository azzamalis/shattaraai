
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useLearningSpaces() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);

  // Fetch all learning spaces for the current user
  const { data: spaces, isLoading, error } = useQuery({
    queryKey: ['learning-spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_spaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
  });

  // Create a new learning space
  const createSpace = useMutation({
    mutationFn: async ({ title, description, isPublic = false }: { 
      title: string;
      description?: string;
      isPublic?: boolean;
    }) => {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from('learning_spaces')
        .insert({
          title,
          description,
          is_public: isPublic
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-spaces'] });
      toast.success('Learning space created successfully');
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Error creating learning space:', error);
      toast.error('Failed to create learning space');
      setIsCreating(false);
    }
  });

  // Delete a learning space
  const deleteSpace = useMutation({
    mutationFn: async (spaceId: string) => {
      const { error } = await supabase
        .from('learning_spaces')
        .delete()
        .eq('id', spaceId);
      
      if (error) {
        throw error;
      }
      
      return spaceId;
    },
    onSuccess: (spaceId) => {
      queryClient.invalidateQueries({ queryKey: ['learning-spaces'] });
      toast.success('Learning space deleted');
    },
    onError: (error) => {
      console.error('Error deleting learning space:', error);
      toast.error('Failed to delete learning space');
    }
  });

  // Update a learning space
  const updateSpace = useMutation({
    mutationFn: async ({ id, title, description, isPublic }: {
      id: string;
      title?: string;
      description?: string;
      isPublic?: boolean;
    }) => {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (isPublic !== undefined) updateData.is_public = isPublic;
      
      const { data, error } = await supabase
        .from('learning_spaces')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['learning-spaces'] });
      queryClient.invalidateQueries({ queryKey: ['learning-space', data.id] });
      toast.success('Learning space updated');
    },
    onError: (error) => {
      console.error('Error updating learning space:', error);
      toast.error('Failed to update learning space');
    }
  });

  // Fetch a single learning space by ID
  const getSpace = async (id: string) => {
    const { data, error } = await supabase
      .from('learning_spaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  };

  return {
    spaces,
    isLoading,
    error,
    isCreating,
    createSpace,
    deleteSpace,
    updateSpace,
    getSpace
  };
}
