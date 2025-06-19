
import React from 'react';
import { Room } from '@/hooks/useRooms';
import { NavigateFunction } from 'react-router-dom';

export const createRoomHandlers = (
  rooms: Room[],
  navigate: NavigateFunction,
  onOpenChange: (open: boolean) => void,
  setEditingRoomId: (id: string | null) => void,
  setEditedRoomName: (name: string) => void,
  setRoomToDelete: (id: string | null) => void,
  setRoomToDeleteName: (name: string) => void,
  setDeleteModalOpen: (open: boolean) => void
) => {
  const handleRoomClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    navigate(`/rooms/${id}`);
    onOpenChange(false);
  };

  const handleRenameClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingRoomId(id);
    setEditedRoomName(name);
  };

  const handleSaveRename = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingRoomId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingRoomId(null);
    setEditedRoomName("");
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setRoomToDelete(id);
    setRoomToDeleteName(name);
    setDeleteModalOpen(true);
  };

  return {
    handleRoomClick,
    handleRenameClick,
    handleSaveRename,
    handleCancelRename,
    handleDeleteClick
  };
};
