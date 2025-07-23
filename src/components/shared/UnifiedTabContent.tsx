import React from 'react';
import { TabsContent, Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { UnifiedTabType } from './UnifiedTabNavigation';

interface UnifiedTabContentProps {
  activeTab: UnifiedTabType;
  variant?: 'content' | 'chat';
  children: React.ReactNode;
  className?: string;
}

export function UnifiedTabContent({
  activeTab,
  variant = 'chat',
  children,
  className
}: UnifiedTabContentProps) {
  const contentClassName = variant === 'chat'
    ? "flex-1 overflow-hidden mx-4 mb-4"
    : "flex-1 overflow-hidden mx-4 mb-4";

  const wrapperClassName = variant === 'chat'
    ? "h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl"
    : "h-full bg-dashboard-bg dark:bg-dashboard-bg rounded-xl";

  return (
    <TabsContent 
      value={activeTab} 
      className={cn(contentClassName, className)}
    >
      <div className={wrapperClassName}>
        {children}
      </div>
    </TabsContent>
  );
}

interface UnifiedTabContainerProps {
  activeTab: UnifiedTabType;
  variant?: 'content' | 'chat';
  onTabChange: (tab: UnifiedTabType) => void;
  children: React.ReactNode;
  className?: string;
}

export function UnifiedTabContainer({
  activeTab,
  variant = 'chat',
  onTabChange,
  children,
  className
}: UnifiedTabContainerProps) {
  const containerClassName = variant === 'content'
    ? "flex-1 overflow-hidden"
    : "flex-1 overflow-hidden";

  const tabsClassName = variant === 'content'
    ? "h-full flex flex-col bg-background"
    : "h-full flex flex-col bg-background";

  return (
    <div className={cn(containerClassName, className)}>
      <div className={tabsClassName}>
        {children}
      </div>
    </div>
  );
}