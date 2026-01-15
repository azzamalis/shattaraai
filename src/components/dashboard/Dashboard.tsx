
import React, { useState, useMemo, useCallback } from 'react';
import { Room, useRooms } from '@/hooks/useRooms';
import { ContentItem } from '@/hooks/useContent';
import { DeleteItem } from '@/lib/types';
import { DashboardHero } from './DashboardHero';
import { DashboardSections } from './DashboardSections';
import { DashboardModals } from './DashboardModals';
import { useContentContext } from '@/contexts/ContentContext';
import { useLocation } from 'react-router-dom';

interface DashboardProps {
  rooms?: Room[];
  content?: ContentItem[];
  onAddRoom?: () => Promise<string | null>;
  onEditRoom?: (id: string, name: string) => Promise<void>;
  onDeleteRoom?: (id: string) => Promise<void>;
}

export function Dashboard(props: DashboardProps = {}) {
  const location = useLocation();
  const { onDeleteContent, onUpdateContent, content } = useContentContext();
  const { rooms, addRoom, editRoom, deleteRoom } = useRooms();
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const [itemToShare, setItemToShare] = useState<ContentItem | null>(null);

  // Get current room from URL if we're in a room - memoized
  const currentRoom = useMemo(() => {
    const roomId = location.pathname.split('/').pop();
    if (roomId && roomId !== 'dashboard') {
      const room = rooms.find(r => r.id === roomId);
      return room ? { id: room.id, name: room.name } : undefined;
    }
    return undefined;
  }, [location.pathname, rooms]);

  // Memoized callback handlers to prevent child re-renders
  const handleDeleteClick = useCallback(async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setItemToDelete({
        id: roomId,
        type: 'room',
        name: room.name
      });
      setDeleteModalOpen(true);
    }
  }, [rooms]);

  const handleCardDelete = useCallback((item: ContentItem) => {
    setItemToDelete({
      id: item.id,
      type: 'card',
      name: item.title
    });
    setDeleteModalOpen(true);
  }, []);

  const handleCardShare = useCallback((item: ContentItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  }, []);

  const handleExploreCardDelete = useCallback((item: ContentItem) => {
    setItemToDelete({
      id: item.id,
      type: 'card',
      name: item.title
    });
    setDeleteModalOpen(true);
  }, []);

  const handleExploreCardShare = useCallback((item: ContentItem) => {
    setItemToShare(item);
    setShareModalOpen(true);
  }, []);

  const handleUpdateContent = useCallback((content: ContentItem) => {
    onUpdateContent(content.id, content);
  }, [onUpdateContent]);

  const handlePasteClick = useCallback(() => {
    setIsPasteModalOpen(true);
  }, []);

  // Memoize modal handlers
  const modalHandlers = useMemo(() => ({
    setIsPasteModalOpen,
    setShareModalOpen,
    setDeleteModalOpen,
    setItemToDelete,
  }), []);

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-background transition-colors duration-300">
        <DashboardHero onPasteClick={handlePasteClick} />

        <DashboardSections
          rooms={rooms}
          onAddRoom={addRoom}
          onEditRoom={editRoom}
          onDeleteRoom={handleDeleteClick}
          onCardDelete={handleCardDelete}
          onCardShare={handleCardShare}
          onExploreCardDelete={handleExploreCardDelete}
          onExploreCardShare={handleExploreCardShare}
          currentRoom={currentRoom}
          onUpdateContent={handleUpdateContent}
        />

        <DashboardModals
          isPasteModalOpen={isPasteModalOpen}
          setIsPasteModalOpen={modalHandlers.setIsPasteModalOpen}
          shareModalOpen={shareModalOpen}
          setShareModalOpen={modalHandlers.setShareModalOpen}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={modalHandlers.setDeleteModalOpen}
          itemToDelete={itemToDelete}
          setItemToDelete={modalHandlers.setItemToDelete}
          itemToShare={itemToShare}
          onDeleteRoom={deleteRoom}
        />
      </main>
    </div>
  );
}
