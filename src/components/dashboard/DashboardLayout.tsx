
import React from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#222222]">
        <AppSidebar />
        <SidebarInset className={cn("p-0", className)}>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
