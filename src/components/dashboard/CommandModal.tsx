import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, X, MessageSquare, Box } from 'lucide-react';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Reusable components
const CommandItem = ({ icon, text, rightContent }: { icon: React.ReactNode; text: string; rightContent?: React.ReactNode }) => (
  <div className="hover:bg-white/5 cursor-pointer transition-colors duration-200">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-gray-400">{icon}</div>
        <span className="text-[13px] text-white/90">{text}</span>
      </div>
      {rightContent}
    </div>
  </div>
);

const SpaceBadge = ({ name }: { name: string }) => (
  <div className="bg-[#222] rounded-md px-2.5 py-1 flex items-center gap-2 border border-white/5">
    <Box className="h-3.5 w-3.5 text-gray-400" />
    <span className="text-[13px] text-gray-300">{name}</span>
  </div>
);

export function CommandModal({ open, onOpenChange }: CommandModalProps) {
  return (
    <DialogContent className="bg-[#1A1A1A] border border-white/10 p-0 max-w-[460px] shadow-2xl rounded-xl overflow-hidden">
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5">
        <Search className="h-4 w-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 border-0 text-sm p-0"
        />
        <button 
          onClick={() => onOpenChange(false)}
          className="text-gray-400 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Recent section */}
      <div className="py-3 border-b border-white/5">
        <div className="px-4 pb-2 text-xs font-medium text-gray-400/80">Recents</div>
        <CommandItem 
          icon={<MessageSquare className="h-4 w-4" />}
          text="Python Language"
          rightContent={
            <SpaceBadge name="Azzam's Space" />
          }
        />
      </div>

      {/* Spaces section */}
      <div className="py-3">
        <div className="px-4 pb-2 text-xs font-medium text-gray-400/80">Spaces</div>
        {['Azzam\'s Space', 'Project \'Neom\'', 'Untitled Space'].map((space, index) => (
          <CommandItem 
            key={index}
            icon={<Box className="h-4 w-4" />}
            text={space}
          />
        ))}
      </div>
    </DialogContent>
  );
} 