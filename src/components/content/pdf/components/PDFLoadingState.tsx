
import React from 'react';
import { Loader2 } from 'lucide-react';

export function PDFLoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Loading PDF...</span>
      </div>
    </div>
  );
}
