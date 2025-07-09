
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';
import { useTheme } from '@/hooks/useTheme';
import { ContentData } from '@/pages/ContentPage';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentData?: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}

export function DashboardLayout({ 
  children, 
  className,
  contentData,
  onUpdateContent 
}: DashboardLayoutProps) {
  const { user } = useAuth();
  const { rooms, addRoom, editRoom, deleteRoom } = useRooms();
  const { content } = useContent();
  const { theme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Use useEffect to add 'overflow-hidden' to body when drawer is open on mobile
  useEffect(() => {
    if (isDrawerOpen && isMobile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isDrawerOpen, isMobile]);

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className={cn(
      "dashboard-layout flex min-h-screen w-full flex-col bg-dashboard-bg overflow-hidden transition-colors duration-300",
      theme === 'dark' ? 'dark' : ''
    )}>
      <DashboardHeader 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        contentData={contentData}
        onUpdateContent={onUpdateContent}
        rooms={rooms}
        onAddRoom={addRoom}
      />
      <DashboardDrawer 
        open={isDrawerOpen} 
        onOpenChange={setIsDrawerOpen}
        rooms={rooms}
        onAddRoom={addRoom}
        onEditRoom={editRoom}
        onDeleteRoom={deleteRoom}
      />
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out bg-dashboard-bg", 
          isDrawerOpen ? "lg:ml-[300px]" : "ml-0",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
