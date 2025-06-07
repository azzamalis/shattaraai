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
import { ExploreContentSection } from './ExploreContentSection';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { useContent } from '@/contexts/ContentContext';
import { motion } from 'framer-motion';

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

  const handleExploreCardDelete = (item: ContentItem) => {
    // For explore content, we just show a toast since these are not user content
    toast.success(`"${item.title}" removed from explore content`);
  };

  const handleExploreCardShare = (item: ContentItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-background transition-colors duration-300">
        <div className="max-w-[800px] mx-auto mb-12">
          <NewFeaturePromo />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8 md:mb-12 text-center"
          >
            What do you need help understanding today?
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative my-6 sm:my-8"
          >
            {/* Updated gradient background with more subtle blur effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl blur-md" />
            <div className="relative">
              <AIChatInput 
                onSubmit={handleAISubmit} 
                initialIsActive={false}
                className="backdrop-blur-[2px]" 
              />
            </div>
          </motion.div>

          {/* Quick Tips Section with matching subtle styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/30" />
              <span>Try asking about specific topics</span>
              <span className="h-1 w-1 rounded-full bg-primary/30" />
              <span>Paste content for analysis</span>
              <span className="h-1 w-1 rounded-full bg-primary/30" />
              <span>Get detailed explanations</span>
            </div>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <MyRoomsSection 
            rooms={rooms} 
            onAddRoom={onAddRoom} 
            onEditRoom={onEditRoom} 
            onDeleteRoom={handleDeleteClick} 
          />

          <ContinueLearningSection 
            onDeleteCard={handleCardDelete} 
            onShareCard={handleCardShare} 
          />

          <ExploreContentSection 
            onDeleteCard={handleExploreCardDelete} 
            onShareCard={handleExploreCardShare} 
          />
        </div>
      </main>

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
    </div>
  );
}
