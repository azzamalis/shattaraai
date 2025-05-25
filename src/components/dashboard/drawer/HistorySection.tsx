import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';

export const HistorySection: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <Link 
          to="/history" 
          className="block"
        >
          <h2 className="text-base font-semibold mb-4 text-dashboard-text dark:text-dashboard-text hover:text-dashboard-text/80 dark:hover:text-dashboard-text/80 transition-colors duration-200">
            History
          </h2>
        </Link>
      </div>
      
      <RecentSection />
    </div>
  );
};