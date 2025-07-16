
import React, { useState } from 'react';
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

export function PDFThumbnailGenerator({ url, title, className, onClick }: PDFThumbnailGeneratorProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { theme } = useTheme();

  const handleDocumentLoad = () => {
    setLoading(false);
    setError(false);
  };

  if (!url) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <File className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <FileText className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full relative overflow-hidden bg-card", className)} onClick={onClick}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div 
          className="w-full h-full pdf-thumbnail-container"
          style={{
            overflow: 'hidden'
          }}
        >
          <style>{`
            .pdf-thumbnail-container .rpv-core__viewer {
              height: 100% !important;
            }
            .pdf-thumbnail-container .rpv-core__inner-pages {
              padding: 0 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .pdf-thumbnail-container .rpv-core__inner-page {
              margin: 0 !important;
              transform: scale(0.75);
              transform-origin: center center;
            }
            .pdf-thumbnail-container .rpv-core__page-navigation {
              display: none !important;
            }
            .pdf-thumbnail-container .rpv-core__toolbar {
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
}
