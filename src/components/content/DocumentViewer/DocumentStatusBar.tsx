import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';

export function DocumentStatusBar() {
  const {
    currentPage,
    totalPages,
    zoom,
    nextPage,
    previousPage,
  } = useDocumentViewer();

  return (
    <div className="flex items-center justify-between p-2 border-t border-border bg-card">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={previousPage}
          disabled={currentPage <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Zoom: {zoom}%
        </span>
        <span className="text-sm text-muted-foreground">
          Word Document Viewer
        </span>
      </div>
    </div>
  );
}