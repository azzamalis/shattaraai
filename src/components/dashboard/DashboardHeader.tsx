import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Search, Menu, History, BarChart } from 'lucide-react';
import Logo from '@/components/Logo';
import { CommandModal } from './CommandModal';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
}

export function DashboardHeader({
  onOpenDrawer
}: DashboardHeaderProps) {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <header className="flex items-center p-4 sticky top-0 z-50 bg-dashboard-bg transition-colors duration-300">
      <div className="grid grid-cols-3 w-full items-center">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onOpenDrawer} className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover">
            <Menu size={22} />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Logo className="h-8 w-auto" textColor="text-dashboard-text" />
        </div>
        
        {/* Center section - add navigation links */}
        <div className="flex justify-center space-x-2">
          <Button variant="ghost" className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover" asChild>
            
          </Button>
          <Button variant="ghost" className="dashboard-text hover:dashboard-text hover:bg-dashboard-card-hover" asChild>
            
          </Button>
        </div>
        
        {/* Right section */}
        <div className="flex justify-end items-center gap-3 pr-2">
          {/* Upgrade button */}
          <Link to="/pricing">
            <Button variant="outline" className="bg-transparent border-2 border-[#00A3FF] text-[#00A3FF] hover:text-[#00A3FF] hover:bg-[#00A3FF]/5 transition-all rounded-full px-8 py-5 h-9 shadow-[0_2px_8px_rgba(0,163,255,0.25)] hover:shadow-[0_2px_12px_rgba(0,163,255,0.35)]">
              Upgrade
            </Button>
          </Link>

          {/* Command button */}
          <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="
                bg-[#F3F3F3] border-none 
                text-[#8D8D8D] 
                hover:bg-[#F7F7F7] hover:text-[#8D8D8D]
                dark:bg-[#292929] dark:text-dashboard-text-secondary 
                dark:hover:bg-white/5 dark:hover:text-dashboard-text
                rounded-full px-6 py-5 h-9 flex items-center justify-center gap-1.5 min-w-[120px] transition-all duration-200
              ">
                <Search className="h-4 w-4" />
                <span className="text-sm font-medium mx-0.5">⌘</span>
                <span className="text-sm font-medium">K</span>
              </Button>
            </DialogTrigger>
            <CommandModal open={commandOpen} onOpenChange={setCommandOpen} />
          </Dialog>
        </div>
      </div>
    </header>
  );
}
