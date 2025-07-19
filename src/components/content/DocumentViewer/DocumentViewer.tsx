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
      <div className="h-full flex flex-col bg-background">
        <DocumentHeader contentData={contentData} />
        <div className="flex-1 flex min-h-0">
          <DocumentSidebar />
          <DocumentContent contentData={contentData} onUpdateContent={onUpdateContent} />
        </div>
      </div>
    </DocumentViewerProvider>
  );
}