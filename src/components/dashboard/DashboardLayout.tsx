
import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  // This state is only used for the initial value
  const [initialOpen, setInitialOpen] = useState(true);

  return (
    <SidebarProvider defaultOpen={initialOpen} onOpenChange={(open) => console.log("Sidebar state changed:", open)}>
      <div className="flex min-h-screen w-full bg-[#222222]">
        {/* Sidebar will be hidden completely when collapsed */}
        <AppSidebar />
        
        {/* SidebarInset contains the main content */}
        <SidebarInset className={cn("p-0 relative", className)}>
          {/* The floating trigger button that appears when sidebar is collapsed */}
          <SidebarToggleButton />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

// Extract the toggle button to its own component for clarity
function SidebarToggleButton() {
  // Use the proper useSidebar hook instead of directly accessing the context
  const { state, setOpen } = useSidebar();
  
  // Only show the toggle button when the sidebar is collapsed
  if (state === "expanded") return null;
  
  return (
    <Button 
      onClick={() => setOpen(true)}
      className="absolute top-4 left-4 z-50 bg-[#222222] border border-white/20 text-white hover:bg-primary/90"
      size="icon"
    >
      <PanelLeft size={18} />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
}
