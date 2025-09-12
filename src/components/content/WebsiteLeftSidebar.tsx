import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WebsiteContentTabs } from './website/WebsiteContentTabs';
import { ContentData } from '@/pages/ContentPage';

interface WebsiteLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function WebsiteLeftSidebar({
  contentData,
  onUpdateContent,
  onTextAction
}: WebsiteLeftSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <ScrollArea className="flex-1">
        <WebsiteContentTabs 
          contentData={contentData}
          onTextExpand={() => {}}
          isProcessing={contentData.processing_status === 'processing'}
        />
      </ScrollArea>
    </div>
  );
}