
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ContentItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LearningCardMenu } from './LearningCardMenu';
import { LearningCardThumbnail } from './LearningCardThumbnail';
import { LearningCardTitle } from './LearningCardTitle';
import { LearningCardFooter } from './LearningCardFooter';
import { useContentContext } from '@/contexts/ContentContext';

interface LearningCardProps {
  content: ContentItem;
  onDelete: () => void;
  onShare: () => void;
  onAddToRoom?: (roomId: string) => void;
  availableRooms?: Array<{ id: string; name: string }>;
  currentRoom?: { id: string; name: string };
}

export function LearningCard({
  content,
  onDelete,
  onShare,
  onAddToRoom,
  availableRooms = [],
  currentRoom
}: LearningCardProps) {
  const navigate = useNavigate();
  const { onUpdateContent } = useContentContext();

  const handleCardClick = () => {
    navigate(`/content/${content.id}?type=${content.type}`);
  };

  const handleAddToRoom = async (roomId: string) => {
    try {
      // Update the content with the selected room_id
      await onUpdateContent(content.id, { room_id: roomId });
      
      const room = availableRooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
      
      // Call the optional callback
      if (onAddToRoom) {
        onAddToRoom(roomId);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  const handleTitleUpdate = async (newTitle: string) => {
    try {
      await onUpdateContent(content.id, { title: newTitle });
    } catch (error) {
      console.error('Error updating content title:', error);
      toast.error('Failed to update title');
    }
  };

  // Get the room name from availableRooms if content has a room_id
  const contentRoom = content.room_id ? availableRooms.find(r => r.id === content.room_id) : undefined;

  return (
    <div onClick={handleCardClick} className="block w-full cursor-pointer">
      <div className={cn(
        // Card container
        "bg-card/20 dark:bg-neutral-900/80",
        "flex flex-col justify-between",
        "p-1.5 h-[280px]",
        "rounded-xl border border-border/5",
        "transition-all duration-200",
        "hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
        "group relative"
      )}>
        {/* Content preview section */}
        <LearningCardThumbnail 
          thumbnailUrl={content.metadata?.thumbnailUrl} 
          title={content.title}
          contentType={content.type}
          pdfUrl={content.url}
        >
          <LearningCardMenu
            onDelete={onDelete}
            onShare={onShare}
            onAddToRoom={handleAddToRoom}
            availableRooms={availableRooms}
          />
        </LearningCardThumbnail>

        {/* Content Info Section */}
        <div className="flex flex-col gap-2 p-2">
          <LearningCardTitle 
            title={content.title} 
            onSave={handleTitleUpdate}
          />
          <LearningCardFooter roomName={contentRoom?.name} />
        </div>
      </div>
    </div>
  );
}
