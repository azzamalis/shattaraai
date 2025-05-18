import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, MessageSquare, MoreVertical, Pencil, Check, Share, Trash2, Copy } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
interface LearningCardProps {
  title: string;
  onDelete: () => void;
  onShare: () => void;
}
export function LearningCard({
  title: initialTitle,
  onDelete,
  onShare
}: LearningCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSaveTitle = () => {
    // Add your save logic here
    toast.success("Title updated successfully");
    setIsEditing(false);
  };
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(true);
  };
  return <div className="w-[320px] bg-[#1A1A1A] rounded-2xl overflow-hidden group transition-shadow hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]">
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
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                e.stopPropagation();
                setMenuOpen(false);
                onShare();
              }}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-primary/10 hover:text-white rounded-md px-3 py-2 text-sm font-normal" onClick={e => {
                e.stopPropagation();
                setMenuOpen(false);
                onDelete();
              }}>
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
              <span className="text-base">Azzam's Room</span>
            </div>
          </div>
        </div>
        
        {/* Title area with edit functionality */}
        <div className="px-2 flex justify-between items-center">
          {isEditing ? <div className="flex-1 flex items-center gap-2">
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="flex-1 bg-transparent text-white text-lg font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 border-b border-white/20 px-0 selection:bg-white/10" autoFocus spellCheck="false" />
              <button onClick={handleSaveTitle} className="text-gray-400 hover:text-white">
                <Check className="w-4 h-4" />
              </button>
            </div> : <div className="flex-1 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{title}</h3>
              <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
            </div>}
        </div>
      </div>
    </div>;
}