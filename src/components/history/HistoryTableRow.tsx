import React, { memo, useCallback } from 'react';
import { format } from 'date-fns';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { FileText, Play, Youtube, Mic, Globe, MessageSquare, MoreHorizontal, Type, AudioLines, Text } from 'lucide-react';
import { Room } from '@/lib/types';

export interface HistoryItem {
  id: string;
  title: string;
  room: string;
  date: Date;
  type: string;
  url?: string;
}

interface HistoryTableRowProps {
  item: HistoryItem;
  rooms: Room[];
  isDropdownOpen: boolean;
  onItemClick: (id: string) => void;
  onDropdownChange: (open: boolean, itemId: string) => void;
  onShareClick: (item: HistoryItem) => void;
  onDeleteClick: (item: HistoryItem) => void;
  onAddToRoom: (contentId: string, roomId: string) => void;
}

// Helper function to get content type icon
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="h-4 w-4 text-primary" />;
    case 'pdf':
      return <Text className="h-4 w-4 text-primary" />;
    case 'file':
    case 'upload':
      return <FileText className="h-4 w-4 text-primary" />;
    case 'recording':
    case 'live_recording':
      return <Mic className="h-4 w-4 text-primary" />;
    case 'audio_file':
      return <AudioLines className="h-4 w-4 text-primary" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-primary" />;
    case 'website':
      return <Globe className="h-4 w-4 text-primary" />;
    case 'text':
      return <Type className="h-4 w-4 text-primary" />;
    case 'chat':
      return <MessageSquare className="h-4 w-4 text-primary" />;
    default:
      return <FileText className="h-4 w-4 text-primary" />;
  }
};

// Helper function to format content type for display
const formatContentType = (type: string): string => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'pdf':
      return 'PDF';
    case 'file':
      return 'File';
    case 'upload':
      return 'Upload';
    case 'recording':
      return 'Recording';
    case 'live_recording':
      return 'Live Recording';
    case 'audio_file':
      return 'Audio File';
    case 'youtube':
      return 'YouTube';
    case 'website':
      return 'Website';
    case 'text':
      return 'Text';
    case 'chat':
      return 'Chat';
    default:
      return 'File';
  }
};

const HistoryTableRowComponent: React.FC<HistoryTableRowProps> = ({
  item,
  rooms,
  isDropdownOpen,
  onItemClick,
  onDropdownChange,
  onShareClick,
  onDeleteClick,
  onAddToRoom
}) => {
  const handleRowClick = useCallback(() => {
    onItemClick(item.id);
  }, [onItemClick, item.id]);

  const handleDropdownOpenChange = useCallback((open: boolean) => {
    onDropdownChange(open, item.id);
  }, [onDropdownChange, item.id]);

  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onShareClick(item);
  }, [onShareClick, item]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick(item);
  }, [onDeleteClick, item]);

  const handleAddToRoom = useCallback((e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    onAddToRoom(item.id, roomId);
  }, [onAddToRoom, item.id]);

  const formattedDate = format(item.date, 'dd/MM/yyyy');

  return (
    <TableRow 
      className="border-border hover:bg-accent cursor-pointer"
      onClick={handleRowClick}
    >
      <TableCell className="font-medium">
        <span className="text-foreground">{item.title}</span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {item.room || '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {getContentTypeIcon(item.type)}
          <span className="text-muted-foreground">{formatContentType(item.type)}</span>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formattedDate}
      </TableCell>
      <TableCell>
        <DropdownMenu
          open={isDropdownOpen}
          onOpenChange={handleDropdownOpenChange}
        >
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            {rooms.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-foreground">
                  Add to Room
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-card border-border">
                  {rooms.map((room) => (
                    <DropdownMenuItem
                      key={room.id}
                      onClick={(e) => handleAddToRoom(e as unknown as React.MouseEvent, room.id)}
                      className="text-foreground hover:bg-accent"
                    >
                      {room.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuItem
              onClick={handleShareClick}
              className="text-foreground hover:bg-accent"
            >
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="text-foreground hover:bg-accent"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

// Memoize row to prevent re-renders when other rows change
export const HistoryTableRow = memo(HistoryTableRowComponent, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.title === nextProps.item.title &&
    prevProps.item.room === nextProps.item.room &&
    prevProps.item.type === nextProps.item.type &&
    prevProps.item.date.getTime() === nextProps.item.date.getTime() &&
    prevProps.isDropdownOpen === nextProps.isDropdownOpen &&
    prevProps.rooms.length === nextProps.rooms.length
  );
});
