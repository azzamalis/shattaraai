import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { FileText, Video, Youtube, Mic, Globe, MessageSquare, MoreHorizontal } from 'lucide-react';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { Room } from '@/lib/types';

export interface HistoryItem {
  id: string;
  title: string;
  room: string;
  date: Date;
  type: string;
  url?: string;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onItemClick: (id: string) => void;
  rooms?: Room[];
  onAddToRoom?: (contentId: string, roomId: string) => void;
  onDelete?: (id: string) => void;
}

// Helper function to get content type icon
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-primary" />;
    case 'pdf':
      return <FileText className="h-4 w-4 text-primary" />;
    case 'recording':
      return <Mic className="h-4 w-4 text-primary" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-primary" />;
    case 'website':
      return <Globe className="h-4 w-4 text-primary" />;
    case 'text':
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
    case 'recording':
      return 'Recording';
    case 'youtube':
      return 'YouTube';
    case 'website':
      return 'Website';
    case 'text':
      return 'Text';
    default:
      return 'File';
  }
};

export function HistoryTable({ 
  items, 
  onItemClick, 
  rooms = [], 
  onAddToRoom,
  onDelete 
}: HistoryTableProps) {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<HistoryItem | null>(null);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const handleShareClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setOpenDropdown(null); // Close dropdown
    setShareModalOpen(true);
  };

  const handleDeleteClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setOpenDropdown(null); // Close dropdown
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem.id);
      setSelectedItem(null);
      setDeleteModalOpen(false);
    }
  };

  const handleShareModalClose = (open: boolean) => {
    setShareModalOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  };

  const handleDeleteModalClose = (open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="border-border hover:bg-accent">
            <TableHead className="text-foreground">Title</TableHead>
            <TableHead className="text-foreground">Room</TableHead>
            <TableHead className="text-foreground">Type</TableHead>
            <TableHead className="text-foreground">Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow 
              key={item.id} 
              className="border-border hover:bg-accent cursor-pointer"
              onClick={() => onItemClick(item.id)}
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
                {format(item.date, 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Add to Room
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {rooms.map((room) => (
                          <DropdownMenuItem
                            key={room.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToRoom?.(item.id, room.id);
                            }}
                          >
                            {room.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setShareModalOpen(true);
                        setSelectedItem(item);
                      }}
                    >
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModalOpen(true);
                        setSelectedItem(item);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-8 w-8 mb-2" />
                  <p>No history items found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Share Modal */}
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={handleShareModalClose} 
        type="content" 
        itemToShare={{
          id: selectedItem?.id || '',
          title: selectedItem?.title || '',
          url: selectedItem?.url
        }} 
      />
      
      {/* Delete Modal */}
      <DeleteModal 
        open={deleteModalOpen} 
        onOpenChange={handleDeleteModalClose} 
        type="content" 
        itemToDelete={{
          id: selectedItem?.id || '',
          title: selectedItem?.title || ''
        }} 
        onConfirm={handleDeleteConfirm} 
      />
    </>
  );
}
