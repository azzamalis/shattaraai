
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
        <SelectTrigger className="w-[180px] bg-[#1A1A1A] border-white/20 text-white">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <SelectValue placeholder="Filter by type" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-[#1A1A1A] border-white/20 text-white">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="Document Analysis">Document Analysis</SelectItem>
          <SelectItem value="Meeting Notes">Meeting Notes</SelectItem>
          <SelectItem value="Chat">Chat</SelectItem>
          <SelectItem value="Research">Research</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
