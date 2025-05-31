import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import { Room } from '@/lib/types';
import { RoomItem, createRoomHandlers } from './RoomUtils';
import { useNavigate } from 'react-router-dom';

interface RoomsSectionProps {
  rooms: Room[];
  onAddRoom: () => void;
  onEditRoom: (id: string, newName: string) => void;
  onDeleteRoom: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  setRoomToDelete: (id: string | null) => void;
  setRoomToDeleteName: (name: string) => void;
  setDeleteModalOpen: (open: boolean) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  onAddRoom,
  onEditRoom,
  onOpenChange,
  setRoomToDelete,
  setRoomToDeleteName,
  setDeleteModalOpen
}) => {
  const navigate = useNavigate();
  const [showMoreRooms, setShowMoreRooms] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedRoomName, setEditedRoomName] = useState("");

  const visibleRooms = showMoreRooms ? rooms : rooms.slice(0, 3);
  const hasHiddenRooms = rooms.length > 3;

  const {
    handleRoomClick,
    handleRenameClick,
    handleSaveRename,
    handleCancelRename,
    handleDeleteClick
  } = createRoomHandlers(
    rooms,
    navigate,
    onOpenChange,
    setEditingRoomId,
    setEditedRoomName,
    setRoomToDelete,
    setRoomToDeleteName,
    setDeleteModalOpen
  );

  return (
    <div>
      <h2 className="ml-2 text-sm mb-2 font-semibold text-foreground">Rooms</h2>
      <div className="flex w-full flex-col space-y-1">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-start gap-2 
            bg-transparent border-2 border-dashed border-primary/10 
            text-primary/80 hover:bg-primary/5 hover:text-primary hover:border-primary/10
            transition-colors duration-200 rounded-lg py-2 px-2 mb-1" 
          onClick={onAddRoom}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-normal">Add room</span>
        </Button>

        {visibleRooms.map((room) => (
          <RoomItem
            key={room.id}
            room={room}
            editingRoomId={editingRoomId}
            editedRoomName={editedRoomName}
            setEditedRoomName={setEditedRoomName}
            onRoomClick={handleRoomClick}
            onRenameClick={handleRenameClick}
            onSaveRename={(e, id) => {
              handleSaveRename(e, id);
              onEditRoom(id, editedRoomName);
            }}
            onCancelRename={handleCancelRename}
            onDeleteClick={handleDeleteClick}
          />
        ))}

        {hasHiddenRooms && (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 
              bg-transparent text-primary/80 hover:bg-primary/5 hover:text-primary
              transition-colors duration-200 rounded-lg py-2 px-2"
            onClick={() => setShowMoreRooms(!showMoreRooms)}
          >
            <ChevronDown className="h-4 w-4" />
            <span className="text-sm font-normal">
              {showMoreRooms ? 'Show less' : `Show ${rooms.length - 3} more`}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
