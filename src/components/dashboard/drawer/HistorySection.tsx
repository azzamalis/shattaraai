
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';
import { RecentSection } from './RecentSection';
import { Room } from '@/lib/types';

interface HistorySectionProps {
  rooms: Room[];
  onShareClick?: (contentId: string, contentTitle: string) => void;
  onDeleteClick?: (contentId: string, contentTitle: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ 
  rooms,
  onShareClick,
  onDeleteClick 
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 px-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-foreground">Recent</h3>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="px-1">
          <RecentSection 
            onShareClick={onShareClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
