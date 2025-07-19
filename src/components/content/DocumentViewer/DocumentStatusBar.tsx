import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
export function DocumentStatusBar() {
  const {
    currentPage,
    totalPages,
    zoom,
    documentHtml,
    searchResults,
    nextPage,
    previousPage
  } = useDocumentViewer();
  return (
    <div className="flex items-center justify-between p-2 border-t border-border bg-background">
      <div className="flex items-center gap-4">
        {searchResults.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {searchResults.length} search results
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {documentHtml ? 'Visual Document Viewer' : 'Word Document Viewer'}
          </span>
        </div>
        
        <span className="text-sm text-muted-foreground">
          Zoom: {zoom}%
        </span>
      </div>
    </div>
  );
}