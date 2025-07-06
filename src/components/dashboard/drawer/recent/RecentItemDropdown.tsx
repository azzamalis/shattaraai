
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Share, Trash2, Pencil } from 'lucide-react';

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
    console.log('Delete clicked for:', contentId, contentTitle);
    onDelete(e);
    onOpenChange(false);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Rename clicked for:', contentId, contentTitle);
    onRename(e);
    onOpenChange(false);
  };

  return (
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
  );
};
