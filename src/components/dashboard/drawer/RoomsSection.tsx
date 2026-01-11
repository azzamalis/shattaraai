import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import { Room } from '@/hooks/useRooms';
import { RoomItem } from './RoomItem';
import { createRoomHandlers } from './RoomHandlers';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
interface RoomsSectionProps {
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
  onEditRoom: (id: string, newName: string) => Promise<void>;
  onDeleteRoom: (id: string) => Promise<void>;
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
  const [isCreating, setIsCreating] = useState(false);
  const visibleRooms = showMoreRooms ? rooms : rooms.slice(0, 3);
  const hasHiddenRooms = rooms.length > 3;
  const {
    handleRoomClick,
    handleRenameClick,
    handleSaveRename,
    handleCancelRename,
    handleDeleteClick
  } = createRoomHandlers(rooms, navigate, onOpenChange, setEditingRoomId, setEditedRoomName, setRoomToDelete, setRoomToDeleteName, setDeleteModalOpen);
  const handleAddRoomClick = async () => {
    setIsCreating(true);
    try {
      const roomId = await onAddRoom();
      if (roomId) {
        onOpenChange(false);
        // Add delay before navigation to ensure room is created in Supabase
        setTimeout(() => {
          navigate(`/rooms/${roomId}`);
        }, 800);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };
  const handleSaveRenameWithEdit = async (e: React.MouseEvent, id: string) => {
    handleSaveRename(e, id);
    await onEditRoom(id, editedRoomName);
  };
  return <div>
      <h2 className="ml-2 mb-2 text-foreground text-sm font-medium">Rooms</h2>
      <div className="flex w-full flex-col space-y-1 text-muted-foreground font-medium">
        <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
            bg-accent text-accent-foreground 
            hover:bg-primary/5 hover:text-primary
            transition-all duration-200 rounded-xl py-2 px-2 mb-1
            disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleAddRoomClick} disabled={isCreating}>
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isCreating ? 'Creating...' : 'Add room'}
          </span>
        </Button>

        {visibleRooms.map(room => <RoomItem key={room.id} room={room} editingRoomId={editingRoomId} editedRoomName={editedRoomName} setEditedRoomName={setEditedRoomName} onRoomClick={handleRoomClick} onRenameClick={handleRenameClick} onSaveRename={handleSaveRenameWithEdit} onCancelRename={handleCancelRename} onDeleteClick={handleDeleteClick} />)}

        {hasHiddenRooms && <Button variant="ghost" className="w-full flex items-center justify-start gap-2 
              bg-transparent text-muted-foreground hover:bg-primary/5 hover:text-primary
              transition-all duration-200 rounded-xl py-2 px-2" onClick={() => setShowMoreRooms(!showMoreRooms)}>
            <ChevronDown className="h-4 w-4" />
            <span className="text-sm font-normal">
              {showMoreRooms ? 'Show less' : `Show ${rooms.length - 3} more`}
            </span>
          </Button>}
      </div>
    </div>;
};