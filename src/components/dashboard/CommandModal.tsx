
import React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Mic,
  Upload,
  Box,
  FileText,
  Video,
  Globe,
  Youtube
} from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';
import { Room } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  onAddRoom: () => Promise<string | null>;
}

export function CommandModal({ open, onOpenChange, rooms, onAddRoom }: CommandModalProps) {
  const navigate = useNavigate();
  const { recentContent } = useContent();

  const handleRoomClick = (roomId: string) => {
    navigate(`/rooms/${roomId}`);
    onOpenChange(false);
  };

  const handleContentClick = (contentId: string, type: string) => {
    navigate(`/content/${contentId}?type=${type}`);
    onOpenChange(false);
  };

  const handleAddRoom = async () => {
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
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick start">
          <CommandItem>
            <Mic size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>New Recording</span>
          </CommandItem>
          <CommandItem>
            <Upload size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Upload Content</span>
          </CommandItem>
          <CommandItem onSelect={handleAddRoom}>
            <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Add a Room</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          {recentContent && recentContent.length > 0 ? (
            recentContent.slice(0, 5).map((content) => (
              <CommandItem 
                key={content.id}
                onSelect={() => handleContentClick(content.id, content.type)}
              >
                <FileText size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                <span>{content.title}</span>
                {content.room_id && (
                  <div className="ms-auto flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5">
                      <Box size={12} />
                      <span className="text-xs text-foreground">
                        {rooms.find(r => r.id === content.room_id)?.name || 'Unknown Room'}
                      </span>
                    </div>
                  </div>
                )}
              </CommandItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No recent content
            </div>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Rooms">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <CommandItem 
                key={room.id}
                onSelect={() => handleRoomClick(room.id)}
              >
                <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
                <span>Go to {room.name}</span>
              </CommandItem>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No rooms available
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
