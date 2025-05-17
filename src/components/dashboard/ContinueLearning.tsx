
import React, { useState } from 'react';
import { Check, Copy, Globe, MessageSquare, MoreVertical, Pencil, Share, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ContinueLearningProps {
  onShare: () => void;
  onDelete: () => void;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ onShare, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("Python Language");
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setShareModalOpen(true);
    onShare();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setDeleteModalOpen(true);
  };

  const handleSaveTitle = () => {
    toast.success("Title updated successfully");
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    toast.success(`"${title}" has been deleted`);
    setDeleteModalOpen(false);
    onDelete();
  };

  return (
    <div className="mt-8">
      {/* Header with View all link */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">Continue learning</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
      </div>
      
      {/* Card container */}
      <div className="flex flex-col gap-4">
        {/* Learning card - Main dark container */}
        <div className="w-[320px] bg-[#1A1A1A] rounded-2xl overflow-hidden group transition-shadow hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          {/* Content wrapper */}
          <div className="p-3">
            {/* White area container */}
            <div className="bg-white rounded-xl w-full mb-3 relative">
              {/* Three dots menu - only visible on hover */}
              <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                <PopoverTrigger asChild>
                  <button onClick={handleMenuClick} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[140px] bg-black/90 rounded-lg border-none p-1" align="end" sideOffset={5}>
                  <div className="flex flex-col">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={handleDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="pt-8 pb-3 px-4">
                {/* Centered chat icon */}
                <div className="flex justify-center mb-8">
                  <MessageSquare className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Left-aligned space name - updated to black text */}
                <div className="flex items-center gap-2 text-sm text-black">
                  <Globe className="w-4 h-4" />
                  <span className="text-base">Azzam's Space</span>
                </div>
              </div>
            </div>
            
            {/* Title area with edit functionality */}
            <div className="px-2 flex justify-between items-center">
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    className="flex-1 bg-transparent text-white text-lg font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 border-b border-white/20 px-0 selection:bg-white/10" 
                    autoFocus 
                    spellCheck="false" 
                  />
                  <button 
                    onClick={handleSaveTitle} 
                    className="text-gray-400 hover:text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">{title}</h3>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="p-0 border-0">
          <div className="bg-[#1A1A1A] rounded-xl w-full">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Share className="w-5 h-5 text-white" />
                <span className="text-white text-base">Share public link to content</span>
              </div>
              <DialogClose asChild>
                <button className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </DialogClose>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 min-w-0 bg-black/50 rounded-lg px-3 py-2 text-gray-400 text-sm">
                  <span className="truncate block">https://shattara.ai/dashboard/room/1588830905134054</span>
                </div>
                <Button className="bg-white hover:bg-white/90 rounded-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap" onClick={() => {
                  navigator.clipboard.writeText("https://shattara.ai/dashboard/room/1588830905134054");
                  toast.success("Link copied to clipboard");
                }}>
                  <Copy className="w-4 h-4 text-black" />
                  <span className="text-sm font-medium text-black">Copy link</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 text-white p-0 rounded-xl w-[480px]">
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-medium">Delete content</h3>
              </div>
              <DialogClose asChild>
                <button className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </DialogClose>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-gray-400 truncate">
                  Are you sure you want to delete "{title}"?
                </p>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="ghost" className="text-white hover:bg-white/5">
                    Cancel
                  </Button>
                </DialogClose>
                <Button 
                  className="bg-red-500 text-white hover:bg-red-600" 
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
