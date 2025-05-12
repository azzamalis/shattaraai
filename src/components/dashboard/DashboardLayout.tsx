
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Use useEffect to add 'overflow-hidden' to body when drawer is open on mobile
  useEffect(() => {
    if (isDrawerOpen && window.innerWidth < 768) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isDrawerOpen]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#111]">
      <DashboardHeader onOpenDrawer={() => setIsDrawerOpen(true)} />
      <DashboardDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out", 
          isDrawerOpen ? "md:ml-[300px]" : "ml-0",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
