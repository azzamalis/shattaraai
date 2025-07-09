import React from 'react';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';
import { Room } from '@/hooks/useRooms';
interface HistorySectionProps {
  rooms?: Room[];
}
export const HistorySection: React.FC<HistorySectionProps> = ({
  rooms
}) => {
  return <div className="space-y-6">
      <div>
        <Link to="/history" className="block">
          <h2 className="ml-2 mb-2 text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors duration-200 text-sm font-semibold">
            <History className="h-4 w-4 text-foreground " />
            History
          </h2>
        </Link>
      </div>
      
      <RecentSection />
    </div>;
};