import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { searchPlugin } from '@react-pdf-viewer/search';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

interface PDFRendererProps {
  url: string;
}

export function PDFRenderer({ url }: PDFRendererProps) {
  const {
    zoom,
    currentPage,
    rotation,
    viewMode,
    searchTerm,
    setTotalPages,
    setCurrentPage,
    setIsLoading,
    setError,
    error,
    isLoading
  } = useUnifiedDocument();

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [internalPage, setInternalPage] = useState(currentPage);
  const isUserScrolling = React.useRef(false);
  
  // Initialize page navigation plugin
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;

  // Initialize search plugin
  const searchPluginInstance = searchPlugin({
    keyword: searchTerm || '',
  });
  const { highlight } = searchPluginInstance;

  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setError(null);
      setPdfFile(url);
      setIsLoading(false);
    }
  }, [url, setIsLoading, setError]);

  // Highlight search term when it changes
  useEffect(() => {
    if (searchTerm && highlight) {
      highlight([searchTerm]);
    }
  }, [searchTerm, highlight]);

  // Only jump to page when it's a programmatic change (not from user scrolling)
  useEffect(() => {
    if (currentPage !== internalPage && !isUserScrolling.current) {
      // Programmatic page change (from search, thumbnail, etc.)
      if (jumpToPage) {
        jumpToPage(currentPage - 1);
        setInternalPage(currentPage);
      }
    }
  }, [currentPage, internalPage, jumpToPage]);

  const handleDocumentLoad = (e: any) => {
    if (e.doc) {
      setTotalPages(e.doc.numPages || 1);
      setInternalPage(1);
    }
  };

  const handlePageChange = (e: any) => {
    const newPage = e.currentPage + 1;
    // Mark as user scrolling
    isUserScrolling.current = true;
    setInternalPage(newPage);
    setCurrentPage(newPage);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <p className="text-sm font-medium text-foreground">Failed to load PDF</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pdfFile) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/10">
        <p className="text-sm text-muted-foreground">No PDF file available</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white dark:bg-neutral-800/50 flex justify-center overflow-auto">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div className="h-full w-full max-w-4xl">
          <Viewer
            fileUrl={pdfFile}
            defaultScale={zoom / 100}
            initialPage={currentPage - 1}
            onDocumentLoad={handleDocumentLoad}
            onPageChange={handlePageChange}
            plugins={[pageNavigationPluginInstance, searchPluginInstance]}
            theme={{
              theme: 'auto',
            }}
            renderLoader={() => (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          />
        </div>
      </Worker>
    </div>
  );
}