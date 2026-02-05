
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';
import { ContentData } from '@/pages/ContentPage';
import { useAutoCompleteOnboarding } from '@/hooks/useAutoCompleteOnboarding';

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
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const { rooms, addRoom, editRoom, deleteRoom } = useRooms();
  const { content } = useContent();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Listen for onboarding events and auto-complete tasks
  useAutoCompleteOnboarding();

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

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (!loading && user && profile && !profile.onboarding_completed) {
      navigate('/onboarding');
    }
  }, [user, profile, loading, navigate]);

  // Redirect to sign-in if not authenticated (after auth finishes initializing)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
    }
  }, [loading, user, navigate]);

  // Don't render app chrome until auth resolves or onboarding is complete
  if (loading || (user && profile && !profile.onboarding_completed) || (!user && !loading)) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background transition-colors duration-300">
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
          "flex-1 transition-all duration-300 ease-in-out bg-background", 
          isDrawerOpen ? "lg:ml-[300px]" : "ml-0",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}
