
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { DeleteItem, ContentItem } from '@/lib/types';
import { useContentContext } from '@/contexts/ContentContext';

interface DashboardModalsProps {
  isPasteModalOpen: boolean;
  setIsPasteModalOpen: (open: boolean) => void;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  itemToDelete: DeleteItem | null;
  setItemToDelete: (item: DeleteItem | null) => void;
  itemToShare: ContentItem | null;
  onDeleteRoom: (roomId: string) => Promise<void>;
}

export function DashboardModals({
  isPasteModalOpen,
  setIsPasteModalOpen,
  shareModalOpen,
  setShareModalOpen,
  deleteModalOpen,
  setDeleteModalOpen,
  itemToDelete,
  setItemToDelete,
  itemToShare,
  onDeleteRoom
}: DashboardModalsProps) {
  const navigate = useNavigate();
  const { onAddContent, onAddContentWithMetadata, onDeleteContent } = useContentContext();

  const handlePasteSubmit = async (data: { url?: string; text?: string; }) => {
    // Determine content type based on URL
    let contentType = 'text';
    let title = 'Text Content';
    if (data.url) {
      if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
        contentType = 'youtube';
        title = 'YouTube Video';
      } else {
        contentType = 'website';
        title = 'Website Content';
      }
    }

    // Add content WITHOUT automatic room assignment (room_id: null)
    // For YouTube/website content, store metadata in appropriate storage bucket
    const contentData = {
      title,
      type: contentType as any,
      room_id: null, // Explicitly set to null - user can add to room later using the Add dropdown
      metadata: {},
      url: data.url,
      text_content: data.text
    };

    const metadata = data.url ? { url: data.url, extractedAt: new Date().toISOString() } : undefined;
    const contentId = await onAddContentWithMetadata(contentData, metadata);

    if (contentId) {
      // Navigate to content page
      const searchParams = new URLSearchParams({
        type: contentType,
        ...(data.url && { url: data.url }),
        ...(data.text && { text: data.text })
      });
      navigate(`/content/${contentId}?${searchParams.toString()}`);
      
      if (data.url) {
        toast.success("URL content added successfully");
      } else if (data.text) {
        toast.success("Text content added successfully");
      }
    }
    
    setIsPasteModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.type === 'room') {
        await onDeleteRoom(itemToDelete.id);
        toast.success(`"${itemToDelete.name}" has been deleted`);
      } else if (itemToDelete.type === 'card') {
        await onDeleteContent(itemToDelete.id);
        toast.success(`"${itemToDelete.name}" has been deleted`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
    
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  return (
    <>
      <PasteContentModal 
        isOpen={isPasteModalOpen} 
        onClose={() => setIsPasteModalOpen(false)} 
        onSubmit={handlePasteSubmit} 
      />
      
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen}
        type="content"
        itemToShare={{
          id: itemToShare?.id || '',
          title: itemToShare?.title || '',
          url: itemToShare?.url,
        }}
      />
      
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        type={itemToDelete?.type === 'card' ? 'content' : itemToDelete?.type || 'content'}
        itemToDelete={{
          id: itemToDelete?.id || '',
          title: itemToDelete?.name || '',
          parentName: itemToDelete?.parentName
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
