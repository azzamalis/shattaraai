
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSections } from './DashboardSections';
import { DashboardDrawer } from './DashboardDrawer';
import { DashboardModals } from './DashboardModals';
import { DeleteItem, ContentItem } from '@/lib/types';
import { Room } from '@/lib/types';

interface DashboardProps {
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
  onEditRoom: (id: string, newName: string) => Promise<void>;
  onDeleteRoom: (id: string) => Promise<void>;
}

export function Dashboard({ 
  rooms, 
  onAddRoom, 
  onEditRoom, 
  onDeleteRoom 
}: DashboardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<DeleteItem | null>(null);
  const [itemToShare, setItemToShare] = useState<ContentItem | null>(null);

  const handleShareClick = (contentId: string, contentTitle: string) => {
    console.log('Dashboard - Share clicked:', contentId, contentTitle);
    setItemToShare({
      id: contentId,
      title: contentTitle,
      type: 'text', // Use a valid ContentType instead of 'content'
      user_id: '',
      room_id: null,
      metadata: {},
      created_at: '',
      updated_at: ''
    });
    setShareModalOpen(true);
  };

  const handleDeleteClick = (contentId: string, contentTitle: string) => {
    console.log('Dashboard - Delete clicked:', contentId, contentTitle);
    setItemToDelete({
      id: contentId,
      name: contentTitle,
      type: 'card'
    });
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onOpenDrawer={() => setDrawerOpen(true)}
        rooms={rooms}
        onAddRoom={onAddRoom}
      />
      
      <DashboardSections 
        rooms={rooms}
        onAddRoom={onAddRoom}
        onEditRoom={onEditRoom}
        onDeleteRoom={onDeleteRoom}
        onCardDelete={handleDeleteClick}
        onCardShare={handleShareClick}
        onExploreCardDelete={handleDeleteClick}
        onExploreCardShare={handleShareClick}
      />
      
      <DashboardDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        rooms={rooms}
        onAddRoom={onAddRoom}
        onEditRoom={onEditRoom}
        onDeleteRoom={onDeleteRoom}
        onShareClick={handleShareClick}
        onDeleteClick={handleDeleteClick}
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
        onDeleteRoom={onDeleteRoom}
      />
    </div>
  );
}
