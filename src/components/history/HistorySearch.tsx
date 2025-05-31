
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HistorySearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function HistorySearch({ searchQuery, onSearchChange }: HistorySearchProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        placeholder="Search history..." 
        className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
