
import React from 'react';
import { Room, ContentItem } from '@/lib/types';
import { MyRoomsSection } from './MyRoomsSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { toast } from "sonner";

interface DashboardSectionsProps {
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
  onEditRoom: (roomId: string, newName: string) => Promise<void>;
  onDeleteRoom: (roomId: string) => Promise<void>;
  onCardDelete: (item: ContentItem) => void;
  onCardShare: (item: ContentItem) => void;
  onExploreCardDelete: (item: ContentItem) => void;
  onExploreCardShare: (item: ContentItem) => void;
  currentRoom?: { id: string; name: string };
  onUpdateContent?: (content: ContentItem) => void;
}

export function DashboardSections({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onCardDelete,
  onCardShare,
  currentRoom,
  onUpdateContent
}: DashboardSectionsProps) {
  const handleAddToRoom = (item: ContentItem, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room && onUpdateContent) {
      // Update the content with the new roomId
      const updatedContent = {
        ...item,
        room_id: roomId
      };
      onUpdateContent(updatedContent);
      toast.success(`"${item.title}" added to "${room.name}"`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <MyRoomsSection 
        rooms={rooms} 
        onAddRoom={onAddRoom} 
        onEditRoom={onEditRoom} 
        onDeleteRoom={onDeleteRoom} 
      />

      <ContinueLearningSection 
        onDeleteCard={onCardDelete} 
        onShareCard={onCardShare}
        onAddToRoom={handleAddToRoom}
        availableRooms={rooms}
        currentRoom={currentRoom}
      />
    </div>
  );
}
