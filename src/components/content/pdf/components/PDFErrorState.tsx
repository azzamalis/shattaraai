
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PDFErrorStateProps {
  error: string;
  url?: string;
}

export function PDFErrorState({ error, url }: PDFErrorStateProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-4 text-dashboard-text-secondary dark:text-dashboard-text-secondary max-w-lg mx-4">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-2" />
        <h3 className="text-xl font-semibold text-center">Error loading PDF</h3>
        <p className="text-base text-center leading-relaxed">{error}</p>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Retry Loading
          </button>
          {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-primary border border-primary/20 hover:border-primary/40 rounded-md hover:bg-primary/5 transition-colors text-center font-medium"
            >
              Open PDF Directly
            </a>
          )}
        </div>
        
        {url && (
          <details className="mt-4 w-full">
            <summary className="text-xs cursor-pointer text-dashboard-text-secondary/60 hover:text-dashboard-text-secondary/80 transition-colors">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-muted rounded text-xs font-mono break-all text-dashboard-text-secondary/80">
              <p><strong>URL:</strong> {url}</p>
              <p><strong>Error:</strong> {error}</p>
              <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
