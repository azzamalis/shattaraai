
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';
import { Room, RoomHandlers } from '@/lib/types';
import { toast } from 'sonner';
import { ContentProvider } from '@/contexts/ContentContext';
import { useLocation } from 'react-router-dom';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // Room state management
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Azzam's Room", lastActive: "12:00 PM" },
    { id: "2", name: "Untitled Room", lastActive: "12:00 PM" },
    { id: "3", name: "Project 'Neom'", lastActive: "12:00 PM" },
  ]);

  // Room handlers
  const handleAddRoom = () => {
    const newRoom: Room = {
      id: (rooms.length + 1).toString(),
      name: "New Room",
      lastActive: "Just now"
    };
    setRooms(prevRooms => [...prevRooms, newRoom]);
    toast.success("New room created successfully");
  };

  const handleEditRoom = (roomId: string, newName: string) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, name: newName } : room
      )
    );
    toast.success("Room name updated successfully");
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    toast.success("Room deleted successfully");
  };

  const roomHandlers: RoomHandlers = {
    onAddRoom: handleAddRoom,
    onEditRoom: handleEditRoom,
    onDeleteRoom: handleDeleteRoom
  };
  
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

  // Clone children with room props only if they accept them
  const childWithProps = React.isValidElement(children) && children.type.toString().includes('Dashboard') 
    ? React.cloneElement(children as React.ReactElement, {
        rooms,
        ...roomHandlers
      })
    : children;

  return (
    <ContentProvider>
      <div className="dashboard-layout flex min-h-screen w-full flex-col bg-background overflow-hidden transition-colors duration-300">
        <DashboardHeader 
          onOpenDrawer={() => setIsDrawerOpen(true)} 
          contentData={contentData}
          onUpdateContent={onUpdateContent}
        />
        <DashboardDrawer 
          open={isDrawerOpen} 
          onOpenChange={setIsDrawerOpen}
          rooms={rooms}
          {...roomHandlers}
        />
        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out", 
            isDrawerOpen ? "lg:ml-[300px]" : "ml-0",
            className
          )}
        >
          {childWithProps}
        </main>
      </div>
    </ContentProvider>
  );
}
