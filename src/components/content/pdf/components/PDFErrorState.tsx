
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PDFErrorStateProps {
  error: string;
  url?: string;
}

export function PDFErrorState({ error, url }: PDFErrorStateProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="text-lg font-medium">Error loading PDF</p>
        <p className="text-sm text-center max-w-md">{error}</p>
        {url && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <p className="text-xs text-center max-w-md text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
              PDF URL: {url}
            </p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm px-3 py-1 rounded border border-primary/20 hover:border-primary/40 transition-colors"
            >
              Open PDF directly
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
