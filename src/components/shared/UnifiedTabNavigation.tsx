import React from 'react';
import { BookOpenCheck, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type UnifiedTabType = 'chat' | 'flashcards' | 'quizzes' | 'summary' | 'notes';

interface TabConfig {
  id: UnifiedTabType;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  customIcon?: React.ReactNode;
  hasStatusDot?: boolean;
}

interface UnifiedTabNavigationProps {
  activeTab: UnifiedTabType;
  onTabChange: (tab: UnifiedTabType) => void;
  variant?: 'content' | 'chat';
  className?: string;
  excludeTabs?: UnifiedTabType[];
}

// Flashcards icon from the reference design
const FlashcardsIcon = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 256 256"
    className={className}
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M180,72H36A20,20,0,0,0,16,92V204a20,20,0,0,0,20,20H180a20,20,0,0,0,20-20V92A20,20,0,0,0,180,72Zm-4,128H40V96H176ZM240,52V176a12,12,0,0,1-24,0V56H64a12,12,0,0,1,0-24H220A20,20,0,0,1,240,52Z" />
  </svg>
);

// Notes icon from the reference design
const NotesIcon = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 256 256"
    className={className}
    aria-hidden="true"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M84,108A12,12,0,0,1,96,96h64a12,12,0,0,1,0,24H96A12,12,0,0,1,84,108Zm32,28H96a12,12,0,0,0,0,24h20a12,12,0,0,0,0-24ZM228,48V156.69a19.86,19.86,0,0,1-5.86,14.14l-51.31,51.31A19.86,19.86,0,0,1,156.69,228H48a20,20,0,0,1-20-20V48A20,20,0,0,1,48,28H208A20,20,0,0,1,228,48ZM52,204h92V156a12,12,0,0,1,12-12h48V52H52Zm139-36H168v23Z" />
  </svg>
);

const tabs: TabConfig[] = [
  {
    id: 'chat',
    label: 'Chat',
    hasStatusDot: true
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: FlashcardsIcon
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    icon: BookOpenCheck
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: BookOpenCheck
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: NotesIcon
  }
];

export function UnifiedTabNavigation({
  activeTab,
  onTabChange,
  variant = 'chat',
  className,
  excludeTabs = []
}: UnifiedTabNavigationProps) {
  const containerClassName = variant === 'content' 
    ? "border-b border-border/10 bg-background px-2 py-2"
    : "flex justify-center px-4 pt-2 pb-4";

  const tabsListClassName = cn(
    "inline-flex p-1 text-muted-foreground relative h-auto items-center",
    "overflow-x-auto rounded-2xl border border-primary/10",
    "bg-white dark:border-primary/5 dark:bg-neutral-800/50",
    "px-[3px] w-fit justify-center"
  );

  const triggerClassName = cn(
    "justify-center whitespace-nowrap px-3 py-1.5 text-sm",
    "transition-all focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "rounded-lg font-normal",
    "hover:bg-primary/5 flex items-center gap-2",
    "text-primary/80 hover:text-primary",
    "data-[state=active]:text-primary",
    "data-[state=active]:bg-primary/5",
    "dark:data-[state=active]:bg-primary/10",
    "border-0 outline-none ring-0",
    "focus:ring-0 focus:outline-none"
  );

  const iconSize = "h-4 w-4";

  return (
    <div className={cn(containerClassName, className)}>
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as UnifiedTabType)} className="w-fit">
        <TabsList className={tabsListClassName}>
          <div className="flex items-center gap-1 overflow-x-auto overscroll-x-none scrollbar-hide">
            {tabs.filter(tab => !excludeTabs.includes(tab.id)).map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className={triggerClassName}
                >
                  <div className="flex items-center gap-2">
                    {tab.hasStatusDot ? (
                      <div className="mx-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                    ) : Icon ? (
                      <Icon className={iconSize} />
                    ) : null}
                    {tab.label}
                  </div>
                </TabsTrigger>
              );
            })}
          </div>
        </TabsList>
      </Tabs>
    </div>
  );
}
