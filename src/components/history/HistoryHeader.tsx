import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
interface HistoryHeaderProps {
  onClearHistory: () => void;
}
export function HistoryHeader({
  onClearHistory
}: HistoryHeaderProps) {
  return <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">History</h1>
      
    </div>;
}