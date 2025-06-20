import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ActionCards } from './ActionCards';
import { LearningCard } from './LearningCard';
import { PasteContentModal } from './PasteContentModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { ContentItem } from '@/lib/types';
interface RoomViewProps {
  title: string;
  description: string;
  isEmpty?: boolean;
  hideHeader?: boolean;
}
export function RoomView({
  title,
  description,
  isEmpty = false,
  hideHeader = false
}: RoomViewProps) {
  const {
    roomId
  } = useParams<{
    roomId: string;
  }>();
  const navigate = useNavigate();
  const {
    content,
    onAddContent,
    onDeleteContent,
    onUpdateContent
  } = useContent();
  const {
    rooms
  } = useRooms();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  // IMPORTANT: Filter content to only show items that belong to this specific room
  const roomContent = content.filter(item => item.room_id === roomId);
  const handlePasteSubmit = async (data: {
    url?: string;
    text?: string;
  }) => {
    let contentType = 'text';
    let contentTitle = 'Text Content';
    if (data.url) {
      if (data.url.includes('youtube.com') || data.url.includes('youtu.be')) {
        contentType = 'youtube';
        contentTitle = 'YouTube Video';
      } else {
        contentType = 'website';
        contentTitle = 'Website Content';
      }
    }

    // Create content WITHOUT automatic room assignment
    const contentId = await onAddContent({
      title: contentTitle,
      type: contentType as any,
      room_id: null,
      // Do not auto-assign to any room
      metadata: {},
      url: data.url,
      text_content: data.text
    });
    if (contentId) {
      const searchParams = new URLSearchParams({
        type: contentType,
        ...(data.url && {
          url: data.url
        }),
        ...(data.text && {
          text: data.text
        })
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
  const handleDeleteCard = (item: ContentItem) => {
    onDeleteContent(item.id);
  };
  const handleShareCard = (item: ContentItem) => {
    // Handle share functionality
  };
  const handleAddToRoom = async (item: ContentItem, targetRoomId: string) => {
    try {
      await onUpdateContent(item.id, {
        room_id: targetRoomId
      });
      const room = rooms.find(r => r.id === targetRoomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };
  if (!hideHeader) {
    return <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
          {description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className="mb-8">
          <ActionCards onPasteClick={() => setIsPasteModalOpen(true)} />
        </div>

        {roomContent.length === 0 ? <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No content in this room yet</p>
            <p className="text-muted-foreground">Use the actions above to add content to this room</p>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {roomContent.map(item => <LearningCard key={item.id} content={item} onDelete={() => handleDeleteCard(item)} onShare={() => handleShareCard(item)} onAddToRoom={targetRoomId => handleAddToRoom(item, targetRoomId)} availableRooms={rooms} />)}
          </div>}

        <PasteContentModal isOpen={isPasteModalOpen} onClose={() => setIsPasteModalOpen(false)} onSubmit={handlePasteSubmit} />
      </div>;
  }

  // When hideHeader is true, just show the content grid
  return <div className="max-w-7xl mx-auto px-4">
      {roomContent.length === 0 ? <div className="text-center py-[54px]">
          <p className="text-muted-foreground text-lg mb-4">No content in this room yet</p>
          <p className="text-muted-foreground">Add content to this room using the "Add" option on any content card</p>
        </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomContent.map(item => <LearningCard key={item.id} content={item} onDelete={() => handleDeleteCard(item)} onShare={() => handleShareCard(item)} onAddToRoom={targetRoomId => handleAddToRoom(item, targetRoomId)} availableRooms={rooms} />)}
        </div>}
    </div>;
}