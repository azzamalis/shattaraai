import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, X, MessageSquare, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Reusable components
const CommandItem = ({ icon, text, rightContent }: { icon: React.ReactNode; text: string; rightContent?: React.ReactNode }) => (
  <div className="hover:bg-[#F7F7F7] dark:hover:bg-white/5 cursor-pointer transition-colors duration-200">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="dark:text-gray-400 text-[#0A0A0A]">{icon}</div>
        <span className="text-[13px] dark:text-white/90 text-[#0A0A0A]">{text}</span>
      </div>
      {rightContent}
    </div>
  </div>
);

const SpaceBadge = ({ name }: { name: string }) => (
  <div className="dark:bg-[#222] bg-[#0A0A0A] rounded-md px-2.5 py-1 flex items-center gap-2 dark:border-white/5 border-[#0A0A0A]">
    <Box className="h-3.5 w-3.5 dark:text-gray-400 text-white" />
    <span className="text-[13px] dark:text-gray-300 text-white">{name}</span>
  </div>
);

export function CommandModal({ open, onOpenChange }: CommandModalProps) {
  return (
    <DialogContent className="bg-[#FFFFFF] dark:bg-[#1A1A1A] border dark:border-white/10 border-white/10 p-0 max-w-[460px] shadow-2xl rounded-xl overflow-hidden">
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b dark:border-white/5 border-[#F0F0F0]">
        <Search className="h-4 w-4 dark:text-gray-400 text-[#0A0A0A]" />
        <input 
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent dark:text-white text-[#0A0A0A] dark:placeholder:text-gray-400 placeholder:text-[#767676] focus:outline-none focus:ring-0 border-0 text-sm p-0"
        />
        <button 
          onClick={() => onOpenChange(false)}
          className="text-gray-400 dark:hover:text-white hover:text-[#0A0A0A] p-1.5 rounded-md hover:bg-[#F7F7F7] dark:hover:bg-white/5 transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Recent section */}
      <div className="py-3 border-b dark:border-white/5 border-[#F0F0F0]">
        <div className="px-4 pb-2 text-xs font-medium dark:text-gray-400/80 text-[#767676]">Recents</div>
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
        <div className="px-4 pb-2 text-xs font-medium dark:text-gray-400/80 text-[#767676]">Spaces</div>
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