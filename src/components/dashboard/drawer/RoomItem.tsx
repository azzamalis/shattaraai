
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room } from '@/hooks/useRooms';
import { MoreHorizontal, Check, X, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // Create a mock mouse event for the save handler
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      onSaveRename(mockMouseEvent, room.id);
    } else if (e.key === 'Escape') {
      // Create a mock mouse event for the cancel handler
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      onCancelRename(mockMouseEvent);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {editingRoomId === room.id ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={editedRoomName}
            onChange={(e) => setEditedRoomName(e.target.value)}
            className="flex-1 h-8"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <Button
            size="sm"
            onClick={(e) => onSaveRename(e, room.id)}
            className="h-8 w-8 p-0"
            variant="ghost"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancelRename}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <Button
            variant="ghost"
            className="flex-1 justify-start text-left h-8 px-2"
            onClick={(e) => onRoomClick(e, room.id)}
          >
            <span className="truncate">{room.name}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-1">
              <DropdownMenuItem 
                onClick={(e) => onRenameClick(e, room.id, room.name)}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => onDeleteClick(e, room.id, room.name)}
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
