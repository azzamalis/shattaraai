
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface HistoryHeaderProps {
  onClearHistory?: () => void;
}

export function HistoryHeader({ onClearHistory }: HistoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">History</h1>
      {onClearHistory && (
        <Button 
          variant="outline" 
          className="gap-2 bg-foreground text-background hover:bg-foreground/90 hover:text-background border-foreground [&>svg]:text-current"
          onClick={onClearHistory}
        >
          <Trash2 size={16} />
          <span>Clear History</span>
        </Button>
      )}
    </div>
  );
}
