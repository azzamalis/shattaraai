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
        
      </div>
      
      <RecentSection />
    </div>;
};