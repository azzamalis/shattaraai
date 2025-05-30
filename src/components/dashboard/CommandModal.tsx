
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
  <div className="hover:bg-accent cursor-pointer transition-colors duration-200">
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-[13px] text-foreground">{text}</span>
      </div>
      {rightContent}
    </div>
  </div>
);

const SpaceBadge = ({ name }: { name: string }) => (
  <div className="bg-muted rounded-md px-2.5 py-1 flex items-center gap-2 border border-border">
    <Box className="h-3.5 w-3.5 text-muted-foreground" />
    <span className="text-[13px] text-muted-foreground">{name}</span>
  </div>
);

export function CommandModal({ open, onOpenChange }: CommandModalProps) {
  return (
    <DialogContent className="bg-card border-border p-0 max-w-[460px] shadow-2xl rounded-xl overflow-hidden">
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 border-0 text-sm p-0"
        />
        <button 
          onClick={() => onOpenChange(false)}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Recent section */}
      <div className="py-3 border-b border-border">
        <div className="px-4 pb-2 text-xs font-medium text-muted-foreground">Recents</div>
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
        <div className="px-4 pb-2 text-xs font-medium text-muted-foreground">Spaces</div>
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
