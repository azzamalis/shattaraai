
import React from 'react';
import { Room, ContentItem, DeleteItem } from '@/lib/types';
import { MyRoomsSection } from './MyRoomsSection';
import { ContinueLearningSection } from './ContinueLearningSection';
import { ExploreContentSection } from './ExploreContentSection';
import { toast } from "sonner";

interface DashboardSectionsProps {
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (roomId: string, newName: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onCardDelete: (item: ContentItem) => void;
  onCardShare: (item: ContentItem) => void;
  onExploreCardDelete: (item: ContentItem) => void;
  onExploreCardShare: (item: ContentItem) => void;
}

export function DashboardSections({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onCardDelete,
  onCardShare,
  onExploreCardDelete,
  onExploreCardShare
}: DashboardSectionsProps) {
  const handleAddToRoom = (item: ContentItem, roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      // In a real app, this would add the content to the room
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
      />

      <ExploreContentSection 
        onDeleteCard={onExploreCardDelete} 
        onShareCard={onExploreCardShare} 
      />
    </div>
  );
}
