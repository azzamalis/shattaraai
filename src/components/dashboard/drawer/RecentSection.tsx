
import React from 'react';
import { Link } from 'react-router-dom';
import { File, Video, ImageIcon, FileText, Mic, Youtube, Link as LinkIcon, Text, MoreHorizontal, Trash2, Share, Plus } from 'lucide-react';
import { useContentContext } from '@/contexts/ContentContext';
import { useRooms } from '@/hooks/useRooms';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface ContentTypeIconProps {
  type: string;
}

function ContentTypeIcon({
  type
}: ContentTypeIconProps) {
  switch (type) {
    case 'file':
      return <File className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'image':
      return <ImageIcon className="w-4 h-4" />;
    case 'pdf':
      return <FileText className="w-4 h-4" />;
    case 'recording':
      return <Mic className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'website':
      return <LinkIcon className="w-4 h-4" />;
    case 'text':
      return <Text className="w-4 h-4" />;
    default:
      return <File className="w-4 h-4" />;
  }
}

export function RecentSection() {
  const {
    recentContent,
    onDeleteContent,
    onUpdateContent
  } = useContentContext();
  const { rooms } = useRooms();

  const handleDeleteCard = (itemId: string) => {
    onDeleteContent(itemId);
    toast.success('Content deleted');
  };

  const handleShareCard = (item: any) => {
    // Handle share functionality
    toast.info('Share functionality coming soon');
  };

  const handleAddToRoom = async (item: any, roomId: string) => {
    try {
      await onUpdateContent(item.id, { room_id: roomId });
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  if (!recentContent || recentContent.length === 0) {
    return <div className="px-3 py-2 text-sm text-muted-foreground">
        No recent content
      </div>;
  }

  return <div className="space-y-1">
      {recentContent.slice(0, 5).map(item => (
        <div key={item.id} className="flex items-center justify-between gap-2">
          <Link 
            to={`/content/${item.id}`} 
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors flex-1 min-w-0"
          >
            <div className="flex-shrink-0">
              <ContentTypeIcon type={item.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-1">
              <DropdownMenuItem 
                onClick={() => handleShareCard(item)}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              
              {rooms.length > 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to room
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48">
                    {rooms.map((room) => (
                      <DropdownMenuItem
                        key={room.id}
                        onClick={() => handleAddToRoom(item, room.id)}
                        className="text-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {room.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteCard(item.id)}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>;
}
