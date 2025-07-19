import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BaseModal } from '@/components/ui/base-modal';
import { Input } from '@/components/ui/input';
import { useContent } from '@/contexts/ContentContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Share, Trash2, Pencil, X, Copy, Check, Link2, Twitter, Linkedin, MessageCircle } from 'lucide-react';

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
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { deleteContent } = useContent();

  const shareUrl = `${window.location.origin}/content/${contentId}`;

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
    setShowShareModal(true);
    onOpenChange(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out this content: ${contentTitle}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
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
            "<span className="truncate max-w-[300px]">{contentTitle}</span>" will be permanently deleted.
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

      {/* Share Modal */}
      <BaseModal 
        open={showShareModal} 
        onOpenChange={setShowShareModal} 
        title="Share Content" 
        description="Share this content with others"
        className="sm:max-w-md"
      >
        <div className="space-y-6 py-4">
          {/* URL Input Section */}
          <div className="space-y-2">
            <label htmlFor="share-url" className="text-sm font-medium text-foreground">
              Share Link
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="share-url" 
                  readOnly 
                  value={shareUrl} 
                  className="pl-9 bg-muted/50 border-border/50 text-foreground" 
                />
              </div>
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className="flex items-center gap-2 min-w-[100px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Share via
            </label>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]" 
                onClick={() => handleSocialShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 hover:bg-[#25D366]/10 hover:text-[#25D366]" 
                onClick={() => handleSocialShare('whatsapp')}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Share on WhatsApp</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="flex-1 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]" 
                onClick={() => handleSocialShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
      </BaseModal>
    </>
  );
};
