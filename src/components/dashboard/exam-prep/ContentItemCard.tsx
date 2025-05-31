
import React from 'react';
import { Check, FileText, Video, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContentItem } from './types';

interface ContentItemCardProps {
  item: ContentItem;
  onToggle: () => void;
}

export function ContentItemCard({ item, onToggle }: ContentItemCardProps) {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-muted-foreground" />;
      case 'document':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'audio':
        return <Headphones className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg",
        "border border-border",
        "hover:border-muted-foreground/50",
        "transition-colors cursor-pointer"
      )}
      onClick={onToggle}
    >
      <div className={cn(
        "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200",
        item.isSelected 
          ? "bg-primary border-primary" 
          : "border-muted-foreground"
      )}>
        {item.isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
      </div>
      
      <div className="flex items-center gap-3 flex-1 text-left">
        {getContentIcon(item.type)}
        <span className="font-medium text-foreground">{item.title}</span>
      </div>
      
      <div className="text-xs text-muted-foreground capitalize">
        {item.type}
      </div>
    </div>
  );
}
