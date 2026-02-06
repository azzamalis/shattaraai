import React, { useEffect, useRef, useState } from 'react';
import { Grid, FileText } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import * as pdfjsLib from 'pdfjs-dist';

interface PDFThumbnailProps {
  pageNumber: number;
  isCurrentPage: boolean;
  onClick: () => void;
  pdfUrl: string;
}

function PDFThumbnail({ pageNumber, isCurrentPage, onClick, pdfUrl }: PDFThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  useEffect(() => {
    const renderThumbnail = async () => {
      if (!canvasRef.current || !pdfUrl || isRendering) return;
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      setIsRendering(true);
      try {
        // Configure PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(pageNumber);
        
        // Scale down for thumbnail
        const viewport = page.getViewport({ scale: 0.3 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
      } catch (error) {
        console.error('Error rendering PDF thumbnail:', error);
      } finally {
        setIsRendering(false);
      }
    };

    renderThumbnail();
  }, [pageNumber, pdfUrl]);

  return (
    <div
      onClick={onClick}
      className="p-2 cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        className={`transition-all hover:shadow-lg max-w-[150px] ${
          isCurrentPage 
            ? 'outline outline-2 outline-primary' 
            : 'hover:outline hover:outline-1 hover:outline-muted-foreground/30'
        }`}
        role="button"
        tabIndex={0}
      />
      <div className="text-center mt-1">
        <span className={`text-xs ${isCurrentPage ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          {pageNumber}
        </span>
      </div>
    </div>
  );
}

export function ThumbnailView() {
  const {
    currentPage,
    totalPages,
    documentType,
    goToPage,
    pdfUrl,
  } = useUnifiedDocument();

  if (documentType === 'pdf' && pdfUrl) {
    // For PDF, show page thumbnails
    return (
      <div className="overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col items-center py-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            
            return (
              <PDFThumbnail
                key={pageNumber}
                pageNumber={pageNumber}
                isCurrentPage={isCurrentPage}
                onClick={() => goToPage(pageNumber)}
                pdfUrl={pdfUrl}
              />
            );
          })}
        </div>
      </div>
    );
  }


  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          Thumbnail view not available for this document type
        </p>
      </div>
    </div>
  );
}