
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandModal } from './CommandModal';
import { useAuth } from '@/hooks/useAuth';
import { ContentData } from '@/pages/ContentPage';
import { Room } from '@/lib/types';
import { useRooms } from '@/hooks/useRooms';

interface DashboardHeaderProps {
  onOpenDrawer: () => void;
  contentData?: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
  rooms: Room[];
}

export function DashboardHeader({ 
  onOpenDrawer, 
  contentData, 
  onUpdateContent,
  rooms 
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const { addRoom } = useRooms();
  const [commandModalOpen, setCommandModalOpen] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setCommandModalOpen(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showSearch = !contentData;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenDrawer}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open sidebar</span>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {showSearch && (
              <Button
                variant="outline"
                className={cn(
                  "relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
                )}
                onClick={() => setCommandModalOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline-flex">Search...</span>
                <span className="inline-flex lg:hidden">Search</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            )}
          </div>
        </div>
      </header>

      <CommandModal 
        open={commandModalOpen} 
        onOpenChange={setCommandModalOpen} 
        rooms={rooms}
        onAddRoom={addRoom}
      />
    </>
  );
}
