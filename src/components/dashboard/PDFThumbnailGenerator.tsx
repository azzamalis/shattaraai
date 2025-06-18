
import React, { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Loader2 } from 'lucide-react';
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
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setError('Failed to load PDF');
    setLoading(false);
    console.error('PDF load error:', error);
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
          <FileText className="h-8 w-8 mb-2" />
          <span className="text-xs">PDF Preview</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={null}
        error={null}
      >
        <Page
          pageNumber={1}
          scale={0.3}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="pdf-thumbnail-page"
          width={280}
        />
      </Document>
    </div>
  );
}
