
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useContentContext } from '@/contexts/ContentContext';
import { Room } from '@/hooks/useRooms';
import { ContentItem } from '@/hooks/useContent';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RoomUtilsProps {
  content: ContentItem[];
  rooms: Room[];
}

export function RoomUtils({ content, rooms }: RoomUtilsProps) {
  const { onUpdateContent } = useContentContext();
  const [movingItems, setMovingItems] = useState<Set<string>>(new Set());

  const moveToRoom = async (contentId: string, targetRoomId: string) => {
    try {
      await onUpdateContent(contentId, { room_id: targetRoomId });
      setMovingItems(prev => new Set([...prev].filter(id => id !== contentId)));
      toast.success('Content moved successfully');
    } catch (error) {
      console.error('Error moving content:', error);
      toast.error('Failed to move content');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {content.map(item => (
        <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-secondary">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Move to room</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {rooms.map(room => (
                <DropdownMenuItem key={room.id} onClick={() => moveToRoom(item.id, room.id)}>
                  {room.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}

// Export the components that RoomsSection needs
export { RoomItem } from './RoomItem';
export { createRoomHandlers } from './RoomHandlers';
