
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Room } from '@/hooks/useRooms';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
  return (
    <div className="flex items-center justify-between gap-2">
      {editingRoomId === room.id ? (
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={editedRoomName}
            onChange={(e) => setEditedRoomName(e.target.value)}
            className="flex-1 h-8"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSaveRename(e, room.id);
              } else if (e.key === 'Escape') {
                onCancelRename(e);
              }
            }}
          />
          <Button
            size="sm"
            onClick={(e) => onSaveRename(e, room.id)}
            className="h-8 px-2"
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancelRename}
            className="h-8 px-2"
          >
            Cancel
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => onRenameClick(e, room.id, room.name)}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => onDeleteClick(e, room.id, room.name)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};
