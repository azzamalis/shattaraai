import React from 'react';
import { Filter } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface HistoryFilterProps {
  typeFilter: string;
  onFilterChange: (value: string) => void;
}

export function HistoryFilter({ typeFilter, onFilterChange }: HistoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={typeFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px] bg-card border-border text-foreground">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <SelectValue placeholder="Filter by type" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border text-foreground">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="file">File</SelectItem>
          <SelectItem value="video">Video</SelectItem>
          <SelectItem value="website">Website</SelectItem>
          <SelectItem value="youtube">YouTube</SelectItem>
          <SelectItem value="recording">Recording</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
