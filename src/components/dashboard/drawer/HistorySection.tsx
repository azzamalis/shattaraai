
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';

export const HistorySection: React.FC = () => {
  return (
    <div>
      <RecentSection />
      <div className="px-4 py-2 border-t border-dashboard-separator mt-2">
        
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start dashboard-text hover:bg-dashboard-card-hover hover:text-dashboard-text transition-colors duration-200" asChild>
            <Link to="/history">
              <History size={18} className="mr-2" />
              <span>History</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
