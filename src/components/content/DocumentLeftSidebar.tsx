import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { ContentViewer } from '@/components/content/ContentViewer';
import { DocumentViewer } from '@/components/content/DocumentViewer/DocumentViewer';
import { ContentData } from '@/pages/ContentPage';
interface DocumentLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  currentTimestamp?: number;
  onSeekToTimestamp?: (timestamp: number) => void;
}
export function DocumentLeftSidebar({
  contentData,
  onUpdateContent,
  onTextAction,
  currentTimestamp,
  onSeekToTimestamp
}: DocumentLeftSidebarProps) {
  // Check if it's a Word document
  const isWordDocument = (contentData.type === 'file' || contentData.type === 'upload') && contentData.filename?.match(/\.(doc|docx)$/i);
  const renderEmptyState = () => <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <FileText className="h-12 w-12 mb-4 text-muted-foreground/30" />
      <p className="text-[14px] font-medium text-primary mb-1.5 text-center">No Document Yet</p>
      <p className="text-[13px] text-muted-foreground text-center">Upload a document to view it here</p>
    </div>;

  // Show DocumentViewer for Word documents
  if (isWordDocument) {
    return <div className="h-full flex flex-col bg-background overflow-hidden">
        <ScrollArea className="flex-1">
          {contentData.url ? <DocumentViewer contentData={contentData} onUpdateContent={onUpdateContent} /> : renderEmptyState()}
        </ScrollArea>
      </div>;
  }

  // Default document viewer for other types
  return <div className="h-full flex flex-col bg-background overflow-hidden">
      <ScrollArea className="flex-1">
        {contentData.url || contentData.text ? <div className="p-4 px-[8px] py-0">
            <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} onTextAction={onTextAction} currentTimestamp={currentTimestamp} onExpandText={() => {}} onSeekToTimestamp={onSeekToTimestamp} />
          </div> : renderEmptyState()}
      </ScrollArea>
    </div>;
}