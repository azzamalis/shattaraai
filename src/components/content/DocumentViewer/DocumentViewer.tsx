import React from 'react';
import { DocumentHeader } from './DocumentHeader';
import { DocumentSidebar } from './DocumentSidebar';
import { DocumentContent } from './DocumentContent';
import { DocumentViewerProvider } from './DocumentViewerContext';
import { ContentData } from '@/pages/ContentPage';

interface DocumentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
}

export function DocumentViewer({ contentData, onUpdateContent }: DocumentViewerProps) {
  return (
    <DocumentViewerProvider>
      <div className="h-full w-full flex flex-col bg-background overflow-hidden">
        <DocumentHeader contentData={contentData} />
        <div className="flex-1 flex min-h-0 w-full overflow-hidden">
          <DocumentSidebar />
          <DocumentContent contentData={contentData} onUpdateContent={onUpdateContent} />
        </div>
      </div>
    </DocumentViewerProvider>
  );
}