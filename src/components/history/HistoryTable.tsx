import React, { useCallback } from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { HistoryEmptyState } from './HistoryEmptyState';
import { HistoryTableRow, HistoryItem } from './HistoryTableRow';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { Room } from '@/lib/types';
import { toast } from 'sonner';

// Re-export HistoryItem for backwards compatibility
export type { HistoryItem } from './HistoryTableRow';

interface HistoryTableProps {
  items: HistoryItem[];
  onItemClick: (id: string) => void;
  rooms?: Room[];
  onAddToRoom?: (contentId: string, roomId: string) => void;
  onDelete?: (id: string) => void;
  searchQuery?: string;
  onClearFilters?: () => void;
}

export function HistoryTable({ 
  items, 
  onItemClick, 
  rooms = [], 
  onAddToRoom,
  onDelete,
  searchQuery = '',
  onClearFilters
}: HistoryTableProps) {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<HistoryItem | null>(null);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const handleShareClick = useCallback((item: HistoryItem) => {
    setSelectedItem(item);
    setOpenDropdown(null);
    setShareModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((item: HistoryItem) => {
    setSelectedItem(item);
    setOpenDropdown(null);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem.id);
      setSelectedItem(null);
      setDeleteModalOpen(false);
    }
  }, [selectedItem, onDelete]);

  const handleShareModalClose = useCallback((open: boolean) => {
    setShareModalOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  }, []);

  const handleDeleteModalClose = useCallback((open: boolean) => {
    setDeleteModalOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  }, []);

  const handleDropdownChange = useCallback((open: boolean, itemId: string) => {
    setOpenDropdown(open ? itemId : null);
  }, []);

  const handleAddToRoom = useCallback(async (contentId: string, roomId: string) => {
    try {
      if (onAddToRoom) {
        await onAddToRoom(contentId, roomId);
        const room = rooms.find(r => r.id === roomId);
        if (room) {
          toast.success(`Added to "${room.name}"`);
        }
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  }, [onAddToRoom, rooms]);

  if (items.length === 0) {
    return (
      <HistoryEmptyState 
        hasSearch={searchQuery.length > 0}
        searchQuery={searchQuery}
        onClearFilters={onClearFilters}
      />
    );
  }

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
            <HistoryTableRow
              key={item.id}
              item={item}
              rooms={rooms}
              isDropdownOpen={openDropdown === item.id}
              onItemClick={onItemClick}
              onDropdownChange={handleDropdownChange}
              onShareClick={handleShareClick}
              onDeleteClick={handleDeleteClick}
              onAddToRoom={handleAddToRoom}
            />
          ))}
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
