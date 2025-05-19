import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface HistoryHeaderProps {
  onClearHistory: () => void;
}

export function HistoryHeader({ onClearHistory }: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white">History</h1>
      <Button 
        variant="outline" 
        className="gap-2 border-white/20 text-black hover:bg-white/10 hover:text-white [&>svg]:text-current"
        onClick={onClearHistory}
      >
        <Trash2 size={16} />
        <span>Clear History</span>
      </Button>
    </div>
  );
}
