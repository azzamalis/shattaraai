import React from 'react';
import { ChatTabType } from '@/lib/types';
import { MessageCircle, FileStack, Brain, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
interface ChatTabNavigationProps {
  activeTab: ChatTabType;
  onTabChange: (tab: ChatTabType) => void;
}
const tabs = [{
  id: 'chat' as ChatTabType,
  label: 'Chat',
  icon: MessageCircle
}, {
  id: 'flashcards' as ChatTabType,
  label: 'Flashcards',
  icon: FileStack
}, {
  id: 'quizzes' as ChatTabType,
  label: 'Quizzes',
  icon: Brain
}, {
  id: 'notes' as ChatTabType,
  label: 'Notes',
  icon: FileText
}];
export function ChatTabNavigation({
  activeTab,
  onTabChange
}: ChatTabNavigationProps) {
  return <Tabs value={activeTab} onValueChange={value => onTabChange(value as ChatTabType)} className="w-full bg-background ">
      <TabsList className={cn("w-[calc(100%-2rem)] justify-start gap-1 p-1 h-12 shrink-0 mx-4 mt-2 mb-4", "bg-dashboard-bg dark:bg-dashboard-bg", "transition-colors duration-200", "rounded-xl")}>
        {tabs.map(tab => {
        const Icon = tab.icon;
        return <TabsTrigger key={tab.id} value={tab.id} className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70", "hover:text-dashboard-text dark:hover:text-dashboard-text", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none")}>
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>;
      })}
      </TabsList>
    </Tabs>;
}