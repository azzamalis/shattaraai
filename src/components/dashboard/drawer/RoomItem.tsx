import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room } from '@/hooks/useRooms';
import { MoreHorizontal, Check, Pencil, Trash2, Box } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface RoomItemProps {
  room: Room;
  editingRoomId: string | null;
  editedRoomName: string;
  setEditedRoomName: (name: string) => void;
  onRoomClick: (e: React.MouseEvent, id: string) => void;
  onRenameClick: (e: React.MouseEvent, id: string, name: string) => void;
  onSaveRename: (e: React.MouseEvent, id: string) => void;
  onCancelRename: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent, id: string, name: string) => void;
}

const RoomItemComponent: React.FC<RoomItemProps> = ({
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
  const isEditing = editingRoomId === room.id;

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      onSaveRename(mockMouseEvent, room.id);
    } else if (e.key === 'Escape') {
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      onCancelRename(mockMouseEvent);
    }
  }, [onSaveRename, onCancelRename, room.id]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedRoomName(e.target.value);
  }, [setEditedRoomName]);

  const handleRoomClick = useCallback((e: React.MouseEvent) => {
    onRoomClick(e, room.id);
  }, [onRoomClick, room.id]);

  const handleRenameClick = useCallback((e: React.MouseEvent) => {
    onRenameClick(e, room.id, room.name);
  }, [onRenameClick, room.id, room.name]);

  const handleSaveRename = useCallback((e: React.MouseEvent) => {
    onSaveRename(e, room.id);
  }, [onSaveRename, room.id]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    onDeleteClick(e, room.id, room.name);
  }, [onDeleteClick, room.id, room.name]);

  return (
    <div className="flex items-center justify-between gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <Input 
            value={editedRoomName} 
            onChange={handleInputChange} 
            className="flex-1 h-8" 
            autoFocus 
            onKeyDown={handleKeyDown} 
          />
          <Button 
            size="sm" 
            onClick={handleSaveRename} 
            className="h-8 w-8 p-0" 
            variant="ghost"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Button 
            variant="ghost" 
            className="flex-1 justify-start text-left h-8 px-2 min-w-0 rounded-xl hover:bg-primary/5 hover:text-primary transition-all" 
            onClick={handleRoomClick}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex-shrink-0 w-4 h-4">
                <Box className="h-4 w-4" />
              </div>
              <span className="truncate text-sm min-w-0">{room.name}</span>
            </div>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-1">
              <DropdownMenuItem 
                onClick={handleRenameClick} 
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteClick} 
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};

// Memoize with custom comparison for performance
export const RoomItem = memo(RoomItemComponent, (prevProps, nextProps) => {
  // Only re-render if this specific room's editing state or data changed
  const prevIsEditing = prevProps.editingRoomId === prevProps.room.id;
  const nextIsEditing = nextProps.editingRoomId === nextProps.room.id;
  
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.room.name === nextProps.room.name &&
    prevIsEditing === nextIsEditing &&
    (prevIsEditing ? prevProps.editedRoomName === nextProps.editedRoomName : true)
  );
});
