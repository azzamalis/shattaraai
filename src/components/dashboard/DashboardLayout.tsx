
import React, { useState, useEffect } from 'react';
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

  // Get the cookie value for sidebar state if it exists
  useEffect(() => {
    const cookies = document.cookie.split(';');
    const sidebarCookie = cookies.find(cookie => cookie.trim().startsWith('sidebar:state='));
    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split('=')[1];
      console.log("Found sidebar cookie:", sidebarState);
      setInitialOpen(sidebarState === 'true');
    }
  }, []);

  // Callback function to handle sidebar state changes
  const handleSidebarChange = (open: boolean) => {
    console.log("Sidebar state changed in provider:", open);
    
    // Set cookie to remember state
    document.cookie = `sidebar:state=${open}; path=/; max-age=${60 * 60 * 24 * 7}`;
  };

  return (
    <SidebarProvider 
      defaultOpen={initialOpen} 
      onOpenChange={handleSidebarChange}
    >
      <div className="flex h-screen w-full overflow-hidden bg-[#111111]">
        {/* Sidebar component */}
        <AppSidebar />
        
        {/* Main content area */}
        <main className="flex-1 relative overflow-auto">
          {/* Toggle button appears only when sidebar is collapsed */}
          <SidebarToggleButton />
          
          {/* Main content */}
          <div className={cn("h-full overflow-auto", className)}>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

// Separate component for the toggle button
function SidebarToggleButton() {
  const { state, setOpen } = useSidebar();
  
  // Only show the toggle button when the sidebar is collapsed
  if (state === "expanded") return null;
  
  return (
    <Button 
      onClick={() => {
        console.log("Opening sidebar from toggle button, current state:", state);
        setOpen(true);
      }}
      className="fixed top-4 left-4 z-50 bg-[#222222] border border-white/20 text-white hover:bg-primary/90"
      size="icon"
      aria-label="Open sidebar"
    >
      <PanelLeft size={18} />
      <span className="sr-only">Open sidebar</span>
    </Button>
  );
}
