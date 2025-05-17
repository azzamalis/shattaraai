import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, X } from 'lucide-react';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Reusable components
const CommandItem = ({ icon, text, rightContent }: { icon: React.ReactNode; text: string; rightContent?: React.ReactNode }) => (
  <div className="hover:bg-white/5 cursor-pointer">
    <div className="flex items-center justify-between px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className="text-gray-400">{icon}</div>
        <span className="text-[13px] text-white">{text}</span>
      </div>
      {rightContent}
    </div>
  </div>
);

const SpaceBadge = ({ name }: { name: string }) => (
  <div className="bg-[#222] rounded-md px-2.5 py-1 flex items-center gap-2">
    <CubeIcon />
    <span className="text-[13px] text-gray-300">{name}</span>
  </div>
);

const CubeIcon = () => (
  <svg 
    className="h-3.5 w-3.5 text-gray-400" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
  </svg>
);

const MessageSquareIcon = () => (
  <svg 
    className="h-4 w-4 text-gray-400" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export function CommandModal({ open, onOpenChange }: CommandModalProps) {
  return (
    <DialogContent className="bg-[#1A1A1A] border border-zinc-800/50 p-0 max-w-[460px] shadow-2xl">
      {/* Search header */}
      <div className="flex items-center p-3">
        <Search className="h-4 w-4 text-gray-400 mr-2.5" />
        <input 
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none focus:ring-0 border-0 text-sm p-0"
        />
        <button 
          onClick={() => onOpenChange(false)}
          className="text-gray-400 hover:text-white p-0.5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Recent section */}
      <div className="py-1">
        <div className="px-3 py-1.5 text-xs text-gray-400/80">Recents</div>
        <CommandItem 
          icon={<MessageSquareIcon />}
          text="Python Language"
          rightContent={
            <SpaceBadge name="Azzam's Space" />
          }
        />
      </div>

      {/* Spaces section */}
      <div className="py-1">
        <div className="px-3 py-1.5 text-xs text-gray-400/80">Spaces</div>
        {['Azzam\'s Space', 'Project \'Neom\'', 'Untitled Space'].map((space, index) => (
          <CommandItem 
            key={index}
            icon={<CubeIcon />}
            text={space}
          />
        ))}
      </div>
    </DialogContent>
  );
} 