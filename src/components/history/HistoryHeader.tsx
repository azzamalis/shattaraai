
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface HistoryHeaderProps {
  onClearHistory: () => void;
}

export function HistoryHeader({ onClearHistory }: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold dashboard-text">History</h1>
      <Button 
        variant="outline" 
        className="gap-2 bg-dashboard-text text-dashboard-bg hover:bg-dashboard-text/90 hover:text-dashboard-bg border-dashboard-text [&>svg]:text-current"
        onClick={onClearHistory}
      >
        <Trash2 size={16} />
        <span>Clear History</span>
      </Button>
    </div>
  );
}
