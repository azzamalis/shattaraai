
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Configure PDF.js worker to use the local file
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
}

export function PDFThumbnailGenerator({ url, title, className }: PDFThumbnailGeneratorProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDF thumbnail loaded successfully, pages:', numPages, 'URL:', url);
    setNumPages(numPages);
    setError(null);
    setLoading(false);
    setRetryCount(0);
  }, [url]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF thumbnail load error:', error, 'URL:', url, 'Retry count:', retryCount);
    
    // Check if this is a CORS or network error
    const isCorsError = error.message.includes('CORS') || error.message.includes('Network');
    const isNetworkError = error.message.includes('fetch') || error.message.includes('Failed to load');
    
    if ((isCorsError || isNetworkError) && retryCount < maxRetries) {
      console.log(`Retrying PDF load in 2 seconds... (attempt ${retryCount + 1})`);
      setRetryCount(prev => prev + 1);
      retryTimeoutRef.current = setTimeout(() => {
        setLoading(true);
        setError(null);
        // Force re-render by updating a state
        setNumPages(0);
      }, 2000);
    } else {
      setError('Failed to load PDF thumbnail');
      setLoading(false);
    }
  }, [url, retryCount]);

  const onPageLoadSuccess = useCallback(() => {
    console.log('PDF thumbnail page rendered successfully for:', url);
  }, [url]);

  const onPageLoadError = useCallback((error: Error) => {
    console.error('PDF thumbnail page load error:', error, 'URL:', url);
    setError('Failed to render PDF page');
    setLoading(false);
  }, [url]);

  const handleRetry = useCallback(() => {
    console.log('Manual retry triggered for PDF:', url);
    setLoading(true);
    setError(null);
    setRetryCount(0);
    setNumPages(0);
  }, [url]);

  // Reset state when URL changes
  useEffect(() => {
    if (url) {
      console.log('PDF URL changed, resetting state:', url);
      setLoading(true);
      setError(null);
      setRetryCount(0);
      setNumPages(0);
      
      // Clear any pending retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    }
  }, [url]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20", className)}>
        <div className="flex flex-col items-center text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <span className="text-xs">No PDF</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20", className)}>
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <span className="text-xs">Loading PDF...</span>
          {retryCount > 0 && (
            <span className="text-xs mt-1">Retry {retryCount}/{maxRetries}</span>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20", className)}>
        <div className="flex flex-col items-center text-muted-foreground">
          <AlertTriangle className="h-6 w-6 mb-2 text-orange-500" />
          <span className="text-xs text-center">PDF Error</span>
          {retryCount < maxRetries && (
            <button
              onClick={handleRetry}
              className="mt-2 text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-white flex items-center justify-center", className)}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={null}
        error={null}
        options={{
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
          httpHeaders: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          },
          withCredentials: false
        }}
      >
        <Page
          pageNumber={1}
          scale={0.2}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          onLoadSuccess={onPageLoadSuccess}
          onLoadError={onPageLoadError}
          className="pdf-thumbnail-page max-w-full max-h-full"
          width={200}
        />
      </Document>
    </div>
  );
}
