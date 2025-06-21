
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
  // Define valid filter options with non-empty values
  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'file', label: 'File' },
    { value: 'video', label: 'Video' },
    { value: 'website', label: 'Website' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'recording', label: 'Recording' }
  ];

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
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
