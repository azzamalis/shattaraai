import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';
export const HistorySection: React.FC = () => {
  return <div className="space-y-6">
      <div className="px-2">
        <Button variant="ghost" className="w-full justify-start text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover hover:text-dashboard-text dark:hover:text-dashboard-text transition-colors duration-200" asChild>
          <Link to="/history">
            <History size={18} className="mr-3" />
            <span className="text-base">History</span>
          </Link>
        </Button>
      </div>
      
      <RecentSection />
    </div>;
};