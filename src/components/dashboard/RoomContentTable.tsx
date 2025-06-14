
import React, { useState } from 'react';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { EditContentModal } from '@/components/dashboard/modals/edit-content-modal';
import { ContentItem } from '@/lib/types';
import { RoomContentTableProps } from './table/types';
import { ContentTableHeader } from './table/ContentTableHeader';
import { ContentTableRow } from './table/ContentTableRow';
import { TablePagination } from './table/TablePagination';

export function RoomContentTable({
  items,
  onEdit,
  onDelete,
  onShare,
  showSelectionColumn,
  onSelect,
  selectedItems = []
}: RoomContentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  
  const itemsPerPage = 5;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const handleShareClick = (item: ContentItem) => {
    setSelectedItem(item);
    setShareModalOpen(true);
  };

  const handleDeleteClick = (item: ContentItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem.id);
      setSelectedItem(null);
      setDeleteModalOpen(false);
    }
  };

  const handleEditClick = (item: ContentItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleEditSave = (updatedItem: ContentItem) => {
    console.log('Saving updated item:', updatedItem);
    if (onEdit) {
      onEdit(updatedItem.id);
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

  const handleEditModalClose = (open: boolean) => {
    setEditModalOpen(open);
    if (!open) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="w-full flex flex-col pt-8 py-[20px]">
      <table className="w-full border-collapse">
        <ContentTableHeader showSelectionColumn={showSelectionColumn} />
        <tbody>
          {currentItems.map(item => (
            <ContentTableRow
              key={item.id}
              item={item}
              showSelectionColumn={showSelectionColumn}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => onSelect?.(item.id)}
              onEdit={() => handleEditClick(item)}
              onShare={() => handleShareClick(item)}
              onDelete={() => handleDeleteClick(item)}
            />
          ))}
        </tbody>
      </table>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Edit Modal */}
      <EditContentModal 
        open={editModalOpen} 
        onOpenChange={handleEditModalClose} 
        contentItem={selectedItem} 
        onSave={handleEditSave} 
      />

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
    </div>
  );
}

// Re-export types for backward compatibility
export type { ContentTag, ContentType } from './table/types';
