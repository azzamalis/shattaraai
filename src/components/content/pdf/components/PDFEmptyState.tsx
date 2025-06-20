
import React from 'react';
import { FileText } from 'lucide-react';

export function PDFEmptyState() {
  return (
    <div className="flex items-center justify-center h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
      <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">No PDF loaded</p>
        <p className="text-sm text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
          Please upload a PDF file to view
        </p>
      </div>
    </div>
  );
}
