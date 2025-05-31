
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
          <h2 className="text-base font-semibold mb-4 text-foreground hover:text-foreground/80 transition-colors duration-200 flex items-center gap-2">
            <History size={18} className="text-muted-foreground" />
            History
          </h2>
        </Link>
      </div>
      
      <RecentSection />
    </div>
  );
};
