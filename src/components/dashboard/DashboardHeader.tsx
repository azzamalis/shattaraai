
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Logo from '@/components/Logo';

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
}

export function DashboardHeader({ onOpenDrawer }: DashboardHeaderProps) {
  return (
    <header className="flex items-center border-b border-white/20 bg-[#111] p-4 sticky top-0 z-10">
      <div className="grid grid-cols-3 w-full items-center">
        {/* Left section with menu toggle and logo */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenDrawer} 
            className="text-white hover:bg-primary/10"
          >
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Logo className="h-8 w-auto" textColor="text-white" />
        </div>
        
        {/* Center section with search */}
        <div className="flex justify-center">
          <div className="relative w-64 lg:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search or use /commands" 
              className="pl-9 bg-dark h-9 border-gray-800 focus:border-primary text-white" 
            />
            <div className="absolute right-3 top-2.5 text-xs text-gray-500">⌘K</div>
          </div>
        </div>
        
        {/* Right section with upgrade button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary-light text-white">Upgrade</Button>
        </div>
      </div>
    </header>
  );
}
