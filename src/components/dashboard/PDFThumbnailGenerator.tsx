
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { FileText, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';

// Import CSS
import '@react-pdf-viewer/core/lib/styles/index.css';

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

const PDFThumbnailGeneratorComponent = ({ url, title, className, onClick }: PDFThumbnailGeneratorProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const { theme } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Set loading timeout
  useEffect(() => {
    if (url && loading) {
      timeoutRef.current = setTimeout(() => {
        setTimedOut(true);
        setError(true);
        setLoading(false);
      }, 10000); // 10 second timeout
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [url, loading]);

  const handleDocumentLoad = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
    setError(false);
    setTimedOut(false);
  }, []);

  const handleDocumentError = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLoading(false);
    setError(true);
  }, []);

  if (!url) {
    return (
      <div 
        className={cn("w-full h-full flex items-center justify-center bg-card", className)} 
        onClick={onClick}
        role="img"
        aria-label={`${title} - No file available`}
      >
        <File className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={cn("w-full h-full flex items-center justify-center bg-card", className)} 
        onClick={onClick}
        role="img"
        aria-label={`${title} - ${timedOut ? 'Loading timed out' : 'Failed to load PDF'}`}
      >
        <FileText className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn("w-full h-full relative overflow-hidden bg-card", className)} 
      onClick={onClick}
      role="img"
      aria-label={`${title} - PDF thumbnail`}
    >
      {loading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-card z-10"
          aria-label="Loading PDF thumbnail"
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div 
          className="w-full h-full pdf-thumbnail-container"
          style={{ overflow: 'hidden' }}
        >
          <style>{`
            .pdf-thumbnail-container .rpv-core__viewer {
              height: 100% !important;
              overflow: hidden !important;
            }
            .pdf-thumbnail-container .rpv-core__inner-pages {
              padding: 0 !important;
              margin: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: flex-start !important;
              overflow: hidden !important;
              height: 100% !important;
            }
            .pdf-thumbnail-container .rpv-core__inner-page {
              margin: 0 !important;
              padding: 0 !important;
              transform: scale(0.75);
              transform-origin: top center;
              overflow: hidden !important;
            }
            .pdf-thumbnail-container .rpv-core__page-navigation,
            .pdf-thumbnail-container .rpv-core__toolbar,
            .pdf-thumbnail-container .rpv-core__scrollbar {
              display: none !important;
            }
          `}</style>
          <Viewer
            fileUrl={url}
            theme={theme === 'dark' ? 'dark' : 'light'}
            onDocumentLoad={handleDocumentLoad}
            initialPage={0}
          />
        </div>
      </Worker>
    </div>
  );
};

// Memoize component for performance
export const PDFThumbnailGenerator = React.memo(PDFThumbnailGeneratorComponent);
