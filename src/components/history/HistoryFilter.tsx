
import React from 'react';
import { Filter, Folder, Play, Globe, MessageSquare, Grid3X3, FileText, Image } from 'lucide-react';
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
  // Define categorized content type filter options
  const filterCategories = [
    {
      label: 'Documents',
      icon: Folder,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'file', label: 'All Files' },
        { value: 'pdf', label: 'PDF' },
        { value: 'text', label: 'Text' }
      ]
    },
    {
      label: 'Media',
      icon: Play,
      options: [
        { value: 'video', label: 'Video' },
        { value: 'audio_file', label: 'Audio Files' },
        { value: 'recording', label: 'Recording' }
      ]
    },
    {
      label: 'Web Content',
      icon: Globe,
      options: [
        { value: 'website', label: 'Website' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'live_recording', label: 'Live Recording' }
      ]
    },
    {
      label: 'Communication',
      icon: MessageSquare,
      options: [
        { value: 'chat', label: 'Chat' }
      ]
    },
    {
      label: 'Other',
      icon: Grid3X3,
      options: [
        { value: 'upload', label: 'Upload' }
      ]
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select value={typeFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[220px] bg-card border-border text-foreground">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <SelectValue placeholder="Filter by type" />
          </div>
        </SelectTrigger>
        <SelectContent className="w-[220px] bg-card border-border text-foreground">
          {filterCategories.map((category, categoryIndex) => (
            <div key={category.label}>
              {/* Category Header */}
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/30 pointer-events-none">
                <category.icon size={12} />
                <span>{category.label}</span>
              </div>
              
              {/* Category Options */}
              {category.options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="pl-6 hover:bg-accent/50 focus:bg-accent data-[highlighted]:bg-accent"
                >
                  {option.label}
                </SelectItem>
              ))}
              
              {/* Divider between categories (except last) */}
              {categoryIndex < filterCategories.length - 1 && (
                <div className="h-px bg-border/50 my-1" />
              )}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
