
import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { DashboardDrawer } from './DashboardDrawer';
import { cn } from '@/lib/utils';
import { ContentData } from '@/pages/ContentPage';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  contentData?: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}

export function DashboardLayout({ children, className, contentData, onUpdateContent }: DashboardLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className={cn('min-h-screen bg-dashboard-bg transition-colors duration-300', className)}>
      <DashboardHeader 
        onOpenDrawer={openDrawer} 
        contentData={contentData}
        onUpdateContent={onUpdateContent}
      />
      <DashboardDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
      {children}
    </div>
  );
}
