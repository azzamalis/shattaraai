
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Globe, 
  FileText 
} from 'lucide-react';
import { TextActionPosition } from './types';

interface PDFTextActionPopoverProps {
  selectedText: string;
  textActionPosition: TextActionPosition | null;
  onTextAction: (action: 'explain' | 'search' | 'summarize') => void;
}

export function PDFTextActionPopover({
  selectedText,
  textActionPosition,
  onTextAction
}: PDFTextActionPopoverProps) {
  if (!selectedText || !textActionPosition) {
    return null;
  }

  return (
    <div
      className="fixed z-50 bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator rounded-lg shadow-lg p-2"
      style={{
        left: Math.max(10, Math.min(textActionPosition.x, window.innerWidth - 250)),
        top: Math.max(10, textActionPosition.y),
      }}
    >
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTextAction('explain')}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
        >
          <MessageSquare className="h-3 w-3 mr-1" />
          Explain
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTextAction('search')}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
        >
          <Globe className="h-3 w-3 mr-1" />
          Search
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onTextAction('summarize')}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
        >
          <FileText className="h-3 w-3 mr-1" />
          Summarize
        </Button>
      </div>
    </div>
  );
}
