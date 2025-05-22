
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistorySection: React.FC = () => {
  return (
    <div className="px-4 py-2">
      <h3 className="text-white/70 text-xs font-medium mb-2 px-2">History</h3>
      <div className="space-y-1">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white transition-colors duration-200" asChild>
          <Link to="/history">
            <History size={18} className="mr-2" />
            <span>History</span>
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/5 hover:text-white transition-colors duration-200" asChild>
          <Link to="/recent">
            <Clock size={18} className="mr-2" />
            <span>Recents</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};
