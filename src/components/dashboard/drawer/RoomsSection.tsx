
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Box, ChevronDown, Plus } from 'lucide-react';
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
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [editedRoomName, setEditedRoomName] = useState("");
  const [showMoreRooms, setShowMoreRooms] = useState(false);

  // Split rooms into visible and hidden
  const visibleRooms = rooms.slice(0, 3);
  const hiddenRooms = rooms.slice(3);
  const hasHiddenRooms = rooms.length > 3;

  const {
    handleRoomClick,
    handleRenameClick,
    handleSaveRename: baseHandleSaveRename,
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

  // Override handleSaveRename to include the onEditRoom callback
  const handleSaveRename = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (editedRoomName.trim()) {
      onEditRoom(roomId, editedRoomName.trim());
      setEditingRoomId(null);
    }
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-dashboard-text text-base font-medium">Rooms</h3>
        <span className="text-dashboard-text-secondary text-xs">{rooms.length} rooms</span>
      </div>

      <div className="space-y-1">
        <Button variant="ghost" className="w-full flex items-center justify-center gap-2 
            text-dashboard-text hover:bg-dashboard-card-hover 
            border border-dashed border-dashboard-separator 
            rounded-md mb-2 transition-colors duration-200
            hover:text-dashboard-text" onClick={onAddRoom}>
          <Plus size={18} />
          <span>Add a Room</span>
        </Button>

        {visibleRooms.map(room => (
          <RoomItem
            key={room.id}
            room={room}
            editingRoomId={editingRoomId}
            editedRoomName={editedRoomName}
            setEditedRoomName={setEditedRoomName}
            onRoomClick={handleRoomClick}
            onRenameClick={handleRenameClick}
            onSaveRename={handleSaveRename}
            onCancelRename={handleCancelRename}
            onDeleteClick={handleDeleteClick}
          />
        ))}

        {hasHiddenRooms && (
          <Popover open={showMoreRooms} onOpenChange={setShowMoreRooms}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full flex items-center justify-between px-2 py-1.5 
                  text-dashboard-text-secondary hover:bg-dashboard-card-hover hover:text-dashboard-text 
                  transition-colors duration-200 group">
                <span className="flex items-center gap-2">
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                  <span>Show More</span>
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(300px-2rem)] bg-dashboard-card border-dashboard-separator p-1" align="center" sideOffset={5}>
              <div className="space-y-1">
                {hiddenRooms.map(room => (
                  <RoomItem
                    key={room.id}
                    room={room}
                    editingRoomId={editingRoomId}
                    editedRoomName={editedRoomName}
                    setEditedRoomName={setEditedRoomName}
                    onRoomClick={handleRoomClick}
                    onRenameClick={handleRenameClick}
                    onSaveRename={handleSaveRename}
                    onCancelRename={handleCancelRename}
                    onDeleteClick={handleDeleteClick}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
