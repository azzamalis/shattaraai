
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
        <button onClick={handleMenuClick} className={cn(
          "absolute z-30 top-2.5 right-2.5",
          "p-1 rounded-full",
          "bg-transparent group-hover:bg-white/10",
          "transition-all duration-200",
          "hover:scale-110"
        )}>
          <MoreVertical className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" side="right" align="start" sideOffset={8}>
        <div className="flex flex-col">
          <Popover open={addToRoomOpen} onOpenChange={setAddToRoomOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                e.stopPropagation();
                setAddToRoomOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-1" side="right" align="start" sideOffset={8}>
              <div className="flex flex-col">
                {availableRooms.length > 0 ? (
                  availableRooms.map(room => (
                    <Button key={room.id} variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                      e.stopPropagation();
                      handleAddToRoom(room.id, room.name);
                    }}>
                      {room.name}
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

          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
            e.stopPropagation();
            setMenuOpen(false);
            onShare();
          }}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Separator className="my-1" />
          
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
            e.stopPropagation();
            setMenuOpen(false);
            onDelete();
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
