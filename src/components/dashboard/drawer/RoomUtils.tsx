import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Pencil, Trash2, Check, X } from 'lucide-react';
import { Room } from '@/lib/types';

interface RoomItemProps {
  room: Room;
  editingRoomId: string | null;
  editedRoomName: string;
  setEditedRoomName: (name: string) => void;
  onRoomClick: (roomId: string) => void;
  onRenameClick: (e: React.MouseEvent, roomId: string) => void;
  onSaveRename: (e: React.MouseEvent, roomId: string) => void;
  onCancelRename: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent, roomId: string) => void;
}

export const RoomItem: React.FC<RoomItemProps> = ({
  room,
  editingRoomId,
  editedRoomName,
  setEditedRoomName,
  onRoomClick,
  onRenameClick,
  onSaveRename,
  onCancelRename,
  onDeleteClick
}) => {
  return (
    <Button 
      key={room.id} 
      variant="ghost" 
      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 
        text-primary/80 hover:bg-primary/5 hover:text-primary transition-colors duration-200
        group" 
      onClick={() => onRoomClick(room.id)}
    >
      {editingRoomId === room.id ? (
        <div className="flex-1 flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <input 
            type="text" 
            value={editedRoomName} 
            onChange={e => setEditedRoomName(e.target.value)} 
            className="flex-1 bg-transparent border-none border-b border-primary text-primary outline-none focus:outline-none focus:ring-0 focus:border-none" 
            style={{ borderBottom: '1px solid hsl(var(--primary))' }} 
            autoFocus 
            onKeyDown={e => {
              if (e.key === 'Enter') onSaveRename(e as any, room.id);
              if (e.key === 'Escape') onCancelRename(e as any);
            }} 
          />
          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/80 hover:bg-primary/5 hover:text-primary" onClick={e => onSaveRename(e, room.id)}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/80 hover:bg-primary/5 hover:text-primary" onClick={onCancelRename}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-primary/60" />
            <span className="flex-1 text-left truncate">{room.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/80 hover:bg-primary/5 hover:text-primary" onClick={e => onRenameClick(e, room.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/80 hover:bg-primary/5 hover:text-primary" onClick={e => onDeleteClick(e, room.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </Button>
  );
};

export const createRoomHandlers = (
  rooms: Room[],
  navigate: (path: string) => void,
  onOpenChange: (open: boolean) => void,
  setEditingRoomId: (id: string | null) => void,
  setEditedRoomName: (name: string) => void,
  setRoomToDelete: (id: string | null) => void,
  setRoomToDeleteName: (name: string) => void,
  setDeleteModalOpen: (open: boolean) => void,
) => {
  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
    onOpenChange(false);
  };

  const handleRenameClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setEditingRoomId(roomId);
      setEditedRoomName(room.name);
    }
  };

  const handleSaveRename = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (setEditedRoomName) {
      setEditingRoomId(null);
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRoomId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setRoomToDelete(roomId);
      setRoomToDeleteName(room.name);
      setDeleteModalOpen(true);
    }
  };

  return {
    handleRoomClick,
    handleRenameClick,
    handleSaveRename,
    handleCancelRename,
    handleDeleteClick
  };
};
