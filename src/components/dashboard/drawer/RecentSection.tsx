
import React from 'react';
import { Link } from 'react-router-dom';
import { File, Video, ImageIcon, FileText, Mic, Youtube, Link as LinkIcon, Text } from 'lucide-react';
import { useContentContext } from '@/contexts/ContentContext';
import { LearningCardMenu } from '../LearningCardMenu';
import { useRooms } from '@/hooks/useRooms';
import { toast } from 'sonner';

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
        <div key={item.id} className="relative group">
          <Link 
            to={`/content/${item.id}`} 
            className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
          >
            <div className="flex-shrink-0">
              <ContentTypeIcon type={item.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate text-sm">{item.title}</p>
            </div>
          </Link>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <LearningCardMenu
              onDelete={() => handleDeleteCard(item.id)}
              onShare={() => handleShareCard(item)}
              onAddToRoom={(roomId) => handleAddToRoom(item, roomId)}
              availableRooms={rooms}
            />
          </div>
        </div>
      ))}
    </div>;
}
