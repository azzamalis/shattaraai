
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Plus, Share, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LearningCardMenuProps {
  onShare: () => void;
  onDelete: () => void;
  onAddToRoom?: (roomId: string) => void;
  availableRooms?: Array<{ id: string; name: string }>;
}

export function LearningCardMenu({
  onShare,
  onDelete,
  onAddToRoom,
  availableRooms = []
}: LearningCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addToRoomOpen, setAddToRoomOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(true);
  };

  const handleAddToRoom = (roomId: string, roomName: string) => {
    if (onAddToRoom) {
      onAddToRoom(roomId);
    }
    setAddToRoomOpen(false);
    setMenuOpen(false);
  };

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger asChild>
        <div 
          onClick={handleMenuClick}
          className={cn(
            "absolute z-30 top-2.5 right-2.5",
            "p-1 hover:scale-110 duration-200 cursor-pointer rounded-full",
            "lg:bg-transparent hover:bg-accent",
            "group-hover:bg-accent transition-all"
          )}
        >
          <MoreVertical className="w-3.5 h-3.5 opacity-100 xl:opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-accent-foreground group-hover:text-accent-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" side="right" align="start" sideOffset={8}>
        <div className="flex flex-col max-w-full">
          <Popover open={addToRoomOpen} onOpenChange={setAddToRoomOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal min-w-0" onClick={e => {
                e.stopPropagation();
                setAddToRoomOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="truncate overflow-hidden">Add</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-1" side="right" align="start" sideOffset={8}>
              <div className="flex flex-col max-w-full">
                {availableRooms.length > 0 ? (
                  availableRooms.map(room => (
                    <Button key={room.id} variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal min-w-0" onClick={e => {
                      e.stopPropagation();
                      handleAddToRoom(room.id, room.name);
                    }}>
                      <span className="truncate overflow-hidden">{room.name}</span>
                    </Button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No rooms available
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal min-w-0" onClick={e => {
            e.stopPropagation();
            setMenuOpen(false);
            onShare();
          }}>
            <Share className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate overflow-hidden">Share</span>
          </Button>

          <Separator className="my-1" />
          
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal min-w-0" onClick={e => {
            e.stopPropagation();
            setMenuOpen(false);
            onDelete();
          }}>
            <Trash2 className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate overflow-hidden">Delete</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
