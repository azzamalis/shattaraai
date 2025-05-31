import React from 'react';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';

export const HistorySection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Link 
          to="/history" 
          className="block"
        >
          <h2 className="ml-2 text-sm mb-2 font-semibold text-foreground flex items-center gap-2 hover:text-primary transition-colors duration-200">
            <History className="h-4 w-4 text-primary/60" />
            History
          </h2>
        </Link>
      </div>
      
      <RecentSection />
    </div>
  );
};
