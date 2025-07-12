
import React from 'react';
import { Loader2 } from 'lucide-react';

export function PDFLoadingState() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-4 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium">Loading PDF...</span>
        </div>
        <div className="text-sm text-center max-w-md text-dashboard-text-secondary/80 dark:text-dashboard-text-secondary/80">
          <p>This may take a moment for large files.</p>
          <p className="mt-1">If the PDF doesn't load, try refreshing the page.</p>
        </div>
      </div>
    </div>
  );
}
