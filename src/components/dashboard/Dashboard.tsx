import React, { useState } from 'react';
import { Room, RoomHandlers, DeleteItem, ContentItem } from '@/lib/types';
import { toast } from "sonner";
import { DashboardHero } from './DashboardHero';
import { DashboardSections } from './DashboardSections';
import { DashboardModals } from './DashboardModals';
import { useContent } from '@/contexts/ContentContext';
import { useLocation } from 'react-router-dom';

interface DashboardProps extends RoomHandlers {
  rooms: Room[];
}

export function Dashboard({
  rooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: DashboardProps) {
  const location = useLocation();
  const { onDeleteContent, onUpdateContent } = useContent();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const [itemToShare, setItemToShare] = useState<ContentItem | null>(null);

  // Get current room from URL if we're in a room
  const currentRoom = React.useMemo(() => {
    const roomId = location.pathname.split('/').pop();
    if (roomId && roomId !== 'dashboard') {
      const room = rooms.find(r => r.id === roomId);
      return room ? { id: room.id, name: room.name } : undefined;
    }
    return undefined;
  }, [location.pathname, rooms]);

  const handleDeleteClick = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setItemToDelete({
        id: roomId,
        type: 'room',
        name: room.name
      });
      setDeleteModalOpen(true);
    }
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
    setItemToDelete({
      id: item.id,
      type: 'card',
      name: item.title
    });
    setDeleteModalOpen(true);
  };

  const handleExploreCardShare = (item: ContentItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-background transition-colors duration-300">
        <DashboardHero onPasteClick={() => setIsPasteModalOpen(true)} />

        <DashboardSections
          rooms={rooms}
          onAddRoom={onAddRoom}
          onEditRoom={onEditRoom}
          onDeleteRoom={handleDeleteClick}
          onCardDelete={handleCardDelete}
          onCardShare={handleCardShare}
          onExploreCardDelete={handleExploreCardDelete}
          onExploreCardShare={handleExploreCardShare}
          currentRoom={currentRoom}
          onUpdateContent={onUpdateContent}
        />

        <DashboardModals
          isPasteModalOpen={isPasteModalOpen}
          setIsPasteModalOpen={setIsPasteModalOpen}
          shareModalOpen={shareModalOpen}
          setShareModalOpen={setShareModalOpen}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          itemToDelete={itemToDelete}
          setItemToDelete={setItemToDelete}
          itemToShare={itemToShare}
          onDeleteRoom={handleDeleteClick}
        />
      </main>
    </div>
  );
}
