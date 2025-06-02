import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room, RoomHandlers, DeleteItem, ContentItem } from '@/lib/types';
import { toast } from "sonner";
import { AIChatInput } from '@/components/ui/ai-chat-input';
import { PasteContentModal } from '@/components/dashboard/PasteContentModal';
import { NewFeaturePromo } from './NewFeaturePromo';
import { ActionCards } from './ActionCards';
import { MyRoomsSection } from './MyRoomsSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { useContent } from '@/contexts/ContentContext';

interface DashboardProps extends RoomHandlers {
  rooms: Room[];
}

export function Dashboard({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: DashboardProps) {
  const navigate = useNavigate();
  const { onAddContent, onDeleteContent } = useContent();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const [itemToShare, setItemToShare] = useState<ContentItem | null>(null);

  const handlePasteSubmit = (data: { url?: string; text?: string; }) => {
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

    // Add content to tracking system
    const contentId = onAddContent({
      title,
      type: contentType as any,
      url: data.url,
      text: data.text
    });

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
    setIsPasteModalOpen(false);
  };

  const handleAISubmit = (value: string) => {
    // Create new chat content
    const contentId = onAddContent({
      title: 'Chat with Shattara AI',
      type: 'chat',
      text: value
    });

    // Navigate to chat page with the query
    const searchParams = new URLSearchParams({
      query: value
    });
    navigate(`/chat/${contentId}?${searchParams.toString()}`);
    toast.success("Starting conversation with Shattara AI");
  };

  const handleDeleteClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setItemToDelete({
        id: room.id,
        type: 'room',
        name: room.name
      });
      setDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'room') {
      onDeleteRoom(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" has been deleted`);
    } else if (itemToDelete.type === 'card') {
      onDeleteContent(itemToDelete.id);
      toast.success(`"${itemToDelete.name}" has been deleted`);
    }
    setItemToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleCardDelete = (item: ContentItem) => {
    setItemToDelete({
      id: item.id,
      type: 'card',
      name: item.title
    });
    setDeleteModalOpen(true);
  };

  const handleCardShare = (item: ContentItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-background transition-colors duration-300">
        <div className="max-w-[800px] mx-auto mb-12">
          <NewFeaturePromo />
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12 text-center">
            What do you need help understanding today?
          </h1>
          
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
          
          <div className="my-6 sm:my-8">
            <AIChatInput onSubmit={handleAISubmit} initialIsActive={false} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <MyRoomsSection rooms={rooms} onAddRoom={onAddRoom} onEditRoom={onEditRoom} onDeleteRoom={handleDeleteClick} />

          <ContinueLearningSection onDeleteCard={handleCardDelete} onShareCard={handleCardShare} />
        </div>
      </main>

      <PasteContentModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onSubmit={handlePasteSubmit} />
      
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
    </div>
  );
}
