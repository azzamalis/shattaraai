
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#111]">
      <DashboardHeader onOpenDrawer={() => setIsDrawerOpen(true)} />
      <DashboardDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen} 
      />
      <main className={cn("flex-1 p-0", className)}>
        {children}
      </main>
    </div>
  );
}
