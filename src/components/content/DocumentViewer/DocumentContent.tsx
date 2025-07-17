import React, { useRef, useEffect, useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useDocumentViewerContext } from './DocumentViewerContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

// Import CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function DocumentContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  const {
    zoom,
    currentPage,
    goToPage,
    setTotalPages,
    contentData,
    document
  } = useDocumentViewerContext();
  
  // Create the plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Disable default sidebar since we have our own
  });
  
  useEffect(() => {
    // Simple timeout to simulate document loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [contentData]);
  
  // Handle zoom level
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `scale(${zoom / 100})`;
      containerRef.current.style.transformOrigin = 'center top';
    }
  }, [zoom]);
  
  // Mock function to get document URL
  const getDocumentUrl = () => {
    if (contentData.url) {
      return contentData.url;
    }
    
    // If no URL, return an error
    setError('No document URL provided.');
    return null;
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center">
        <Skeleton className="h-96 w-full max-w-3xl mb-4 rounded-md" />
        <Skeleton className="h-96 w-full max-w-3xl rounded-md" />
      </div>
    );
  }
  
  // Handle error state
  if (error || !getDocumentUrl()) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading document</AlertTitle>
          <AlertDescription>
            {error || 'Could not load the document. Please check the URL and try again.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Render a PDF document
  if (contentData.type === 'pdf' || (contentData.url && contentData.url.endsWith('.pdf'))) {
    return (
      <div className="flex-1 overflow-auto bg-muted/10 flex justify-center">
        <div
          ref={containerRef}
          className={cn(
            "transition-transform duration-200 w-full max-w-5xl",
            zoom !== 100 && "my-4"
          )}
        >
          <Worker workerUrl="/pdf.worker.min.mjs">
            <Viewer
              fileUrl={getDocumentUrl() || ''}
              plugins={[defaultLayoutPluginInstance]}
              theme={theme === 'dark' ? 'dark' : 'light'}
              onDocumentLoad={(e) => {
                setTotalPages(e.doc.numPages);
              }}
              defaultScale={1}
            />
          </Worker>
        </div>
      </div>
    );
  }
  
  // Render a generic document viewer for other document types
  return (
    <div className="flex-1 overflow-auto bg-muted/10 flex justify-center">
      <div className="flex flex-col items-center justify-center max-w-md p-8 text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <FileText className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
        <p className="text-muted-foreground mb-4">
          {contentData.type === 'file' ? 
            `This file type (${contentData.filename?.split('.').pop() || 'unknown'}) cannot be previewed directly.` : 
            'This document type is not supported for preview.'}
        </p>
        <a
          href={getDocumentUrl() || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm"
        >
          Open Document Externally
        </a>
      </div>
    </div>
  );
}