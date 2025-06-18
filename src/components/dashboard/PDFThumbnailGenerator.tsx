
import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Loader2, AlertTriangle } from 'lucide-react';
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

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF');
    setLoading(false);
  }, []);

  const onPageLoadSuccess = useCallback(() => {
    console.log('PDF page rendered successfully');
  }, []);

  const onPageLoadError = useCallback((error: Error) => {
    console.error('PDF page load error:', error);
    setError('Failed to render PDF page');
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
