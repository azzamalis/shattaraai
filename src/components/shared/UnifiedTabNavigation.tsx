import React from 'react';
import { MessageSquare, FileStack, BookCheck, FileBarChart, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type UnifiedTabType = 'chat' | 'flashcards' | 'quizzes' | 'summary' | 'notes';

interface TabConfig {
  id: UnifiedTabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UnifiedTabNavigationProps {
  activeTab: UnifiedTabType;
  onTabChange: (tab: UnifiedTabType) => void;
  variant?: 'content' | 'chat';
  className?: string;
}

const tabs: TabConfig[] = [
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: FileStack
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    icon: BookCheck
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: FileBarChart
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: FileText
  }
];

export function UnifiedTabNavigation({
  activeTab,
  onTabChange,
  variant = 'chat',
  className
}: UnifiedTabNavigationProps) {
  const containerClassName = variant === 'content' 
    ? "border-b border-border/10 bg-background px-[8px] py-[8px]"
    : "";

  const tabsListClassName = variant === 'content'
    ? cn(
        "w-full justify-center gap-1 p-1 h-12 shrink-0",
        "bg-card dark:bg-card",
        "transition-colors duration-200",
        "rounded-xl"
      )
    : cn(
        "w-[calc(100%-2rem)] justify-start gap-1 p-1 h-12 shrink-0 mx-4 mt-2 mb-4",
        "bg-card dark:bg-card",
        "transition-colors duration-200",
        "rounded-xl"
      );

  const triggerClassName = cn(
    "flex-1 h-full rounded-md flex items-center justify-center gap-2",
    "text-sm font-medium",
    "text-muted-foreground",
    "hover:text-foreground",
    "data-[state=active]:text-primary",
    "data-[state=active]:bg-primary/10",
    "data-[state=active]:hover:bg-primary/20",
    "transition-colors duration-200",
    "focus-visible:ring-0 focus-visible:ring-offset-0",
    "focus:ring-0 focus:ring-offset-0",
    "ring-0 ring-offset-0",
    "border-0 outline-none",
    "data-[state=active]:ring-0",
    "data-[state=active]:ring-offset-0",
    "data-[state=active]:border-0",
    "data-[state=active]:outline-none"
  );

  const iconSize = variant === 'content' ? "h-[14px] w-[14px]" : "h-4 w-4";

  return (
    <div className={cn(containerClassName, className)}>
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as UnifiedTabType)} className="w-full">
        <TabsList className={tabsListClassName}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className={triggerClassName}
              >
                <Icon className={iconSize} />
                <span className="text-sm">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}