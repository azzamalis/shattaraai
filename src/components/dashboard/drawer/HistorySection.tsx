
import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentSection } from './RecentSection';

export const HistorySection: React.FC = () => {
  return (
    <div>
      <RecentSection />
      <div className="px-4 py-2 border-t border-white/10 mt-2">
        <h3 className="text-white/70 text-xs font-medium mb-2 px-2">History</h3>
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white transition-colors duration-200" asChild>
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
