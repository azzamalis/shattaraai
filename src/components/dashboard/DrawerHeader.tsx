
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ChevronsLeft } from 'lucide-react';

interface DrawerHeaderProps {
  onClose: () => void;
}

export function DrawerHeader({ onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      <div className="flex items-center gap-2">
        <Logo className="h-8 md:h-10 w-auto" textColor="text-white" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose} 
        className="text-white hover:bg-white/10 hover:text-primary"
      >
        <ChevronsLeft size={22} />
        <span className="sr-only">Close sidebar</span>
      </Button>
    </div>
  );
}
