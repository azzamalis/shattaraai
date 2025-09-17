
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ContentItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
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
  // Selection mode props
  isExamSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (contentId: string) => void;
}

export function LearningCard({
  content,
  onDelete,
  onShare,
  onAddToRoom,
  availableRooms = [],
  currentRoom,
  isExamSelectionMode = false,
  isSelected = false,
  onToggleSelection
}: LearningCardProps) {
  const navigate = useNavigate();
  const { onUpdateContent } = useContentContext();

  const handleCardClick = () => {
    if (isExamSelectionMode && onToggleSelection) {
      onToggleSelection(content.id);
    } else {
      // Route to chat page for chat content types, otherwise to content page
      if (content.type === 'chat') {
        navigate(`/chat/${content.id}`);
      } else {
        navigate(`/content/${content.id}?type=${content.type}`);
      }
    }
  };

  const handleAddToRoom = async (roomId: string) => {
    try {
      await onUpdateContent(content.id, { room_id: roomId });
      
      const room = availableRooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
      
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

  const contentRoom = content.room_id ? availableRooms.find(r => r.id === content.room_id) : undefined;

  return (
    <div onClick={handleCardClick} className="block w-full cursor-pointer">
      <div className={cn(
        // Card container - matching ActionCard styling
        "bg-card border-border shadow-sm",
        "flex flex-col justify-between",
        "p-1.5 h-[280px]",
        "rounded-xl",
        "transition-all duration-200",
        "hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
        "group relative",
        // Selection mode styles
        isExamSelectionMode && "hover:border-primary/50",
        isSelected && "border-primary bg-primary/5 shadow-lg"
      )}>
        {/* Selection overlay */}
        {isExamSelectionMode && isSelected && (
          <div className="absolute inset-0 bg-primary/10 rounded-xl flex items-center justify-center z-10">
            <div className="bg-primary text-primary-foreground rounded-full p-2">
              <Check className="h-6 w-6" />
            </div>
          </div>
        )}

        {/* Content preview section */}
        <LearningCardThumbnail 
          thumbnailUrl={content.metadata?.thumbnailUrl} 
          title={content.title}
          contentType={content.type}
          pdfUrl={content.url}
        >
          {!isExamSelectionMode && (
            <LearningCardMenu
              onDelete={onDelete}
              onShare={onShare}
              onAddToRoom={handleAddToRoom}
              availableRooms={availableRooms}
            />
          )}
        </LearningCardThumbnail>

        {/* Content Info Section */}
        <div className="flex flex-col gap-2 p-2">
          <LearningCardTitle 
            title={content.title} 
            contentId={content.id}
            onSave={handleTitleUpdate}
            disabled={isExamSelectionMode}
          />
          <LearningCardFooter 
            roomName={contentRoom?.name} 
            content={content}
          />
        </div>
      </div>
    </div>
  );
}
