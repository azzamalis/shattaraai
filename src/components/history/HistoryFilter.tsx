
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Room } from '@/lib/types';

interface HistoryFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedRoom: string;
  onRoomChange: (value: string) => void;
  rooms: Room[];
  totalItems: number;
}

export function HistoryFilter({ 
  searchQuery,
  onSearchChange,
  selectedType, 
  onTypeChange,
  selectedRoom,
  onRoomChange,
  rooms,
  totalItems
}: HistoryFilterProps) {
  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'file', label: 'File' },
    { value: 'video', label: 'Video' },
    { value: 'website', label: 'Website' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'recording', label: 'Recording' }
  ];

  const roomOptions = [
    { value: 'all', label: 'All Rooms' },
    { value: 'no-room', label: 'No Room' },
    ...rooms.map(room => ({ value: room.name, label: room.name }))
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 border-b border-border">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card border-border text-foreground"
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <SelectValue placeholder="Type" />
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

        <Select value={selectedRoom} onValueChange={onRoomChange}>
          <SelectTrigger className="w-[140px] bg-card border-border text-foreground">
            <SelectValue placeholder="Room" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border text-foreground">
            {roomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        {totalItems} items
      </div>
    </div>
  );
}
