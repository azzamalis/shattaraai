import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BaseModal } from '@/components/ui/base-modal';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Share, Trash2, Pencil, X } from 'lucide-react';

interface RecentItemDropdownProps {
  contentId: string;
  contentTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRename: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const RecentItemDropdown: React.FC<RecentItemDropdownProps> = ({
  contentId,
  contentTitle,
  isOpen,
  onOpenChange,
  onRename,
  onShare,
  onDelete
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleteContent } = useContent();

  // Disable body interactions when dropdown is open
  useEffect(() => {
    if (isOpen) {
      // Disable pointer events on body
      document.body.style.pointerEvents = 'none';
      
      return () => {
        // Re-enable pointer events on body
        document.body.style.pointerEvents = 'auto';
      };
    }
  }, [isOpen]);

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Share clicked for:', contentId, contentTitle);
    onShare(e);
    onOpenChange(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
    onOpenChange(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteContent(contentId);
      setShowDeleteModal(false);
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Rename clicked for:', contentId, contentTitle);
    onRename(e);
    onOpenChange(false);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          side="right"
          className="w-[200px] p-1 bg-popover border border-border z-[9999]"
          style={{ pointerEvents: 'auto' }}
          sideOffset={8}
        >
          <DropdownMenuItem 
            onClick={handleRenameClick}
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={handleShareClick}
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
          
          <Separator className="my-1" />
          
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <BaseModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        title="" 
        className="sm:max-w-lg" 
        showCloseButton={false}
      >
        <div className="space-y-4 py-1">
          {/* Header with close button */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Are you sure you want to delete this content?
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowDeleteModal(false)} 
              className="h-8 w-8 rounded-md hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground">
            "<span className="truncate inline-block max-w-[300px]">{contentTitle}</span>" will be permanently deleted.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 py-0">
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)} 
              className="hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 focus:ring-2 focus:ring-red-500/20"
            >
              Delete
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};