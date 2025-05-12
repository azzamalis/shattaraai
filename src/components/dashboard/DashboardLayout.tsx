
import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <SidebarProvider defaultOpen={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full bg-[#222222]">
        {/* Sidebar will be hidden completely when collapsed */}
        <AppSidebar />
        
        {/* SidebarInset contains the main content */}
        <SidebarInset className={cn("p-0 relative", className)}>
          {/* The floating trigger button that appears when sidebar is collapsed */}
          {!sidebarOpen && (
            <Button 
              onClick={() => setSidebarOpen(true)} 
              className="absolute top-4 left-4 z-50 bg-[#222222] border border-white/20 text-white hover:bg-primary/90"
              size="icon"
            >
              <PanelLeft size={18} />
              <span className="sr-only">Open sidebar</span>
            </Button>
          )}
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
