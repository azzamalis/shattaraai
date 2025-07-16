
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export function PDFThumbnailGenerator({ url, title, className, onClick }: PDFThumbnailGeneratorProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingTaskRef = useRef<any>(null);

  const generateThumbnail = useCallback(async (pdfUrl: string) => {
    if (!pdfUrl) return;

    setIsLoading(true);
    setHasError(false);
    setThumbnailUrl(null);

    try {
      // Cancel any existing loading task
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy();
      }

      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });
      
      loadingTaskRef.current = loadingTask;
      const pdf = await loadingTask.promise;

      // Get the first page
      const page = await pdf.getPage(1);
      
      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Failed to get canvas context');
      }

      // Calculate scale to fit within a reasonable thumbnail size
      const viewport = page.getViewport({ scale: 1 });
      const scale = Math.min(200 / viewport.width, 280 / viewport.height);
      const scaledViewport = page.getViewport({ scale });

      // Set canvas dimensions
      canvas.width = scaledViewport.width;
      canvas.height = scaledViewport.height;

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
      };

      await page.render(renderContext).promise;

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setThumbnailUrl(dataUrl);

      // Cleanup
      page.cleanup();
      canvas.remove();
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (url) {
      generateThumbnail(url);
    }

    // Cleanup on unmount
    return () => {
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy();
      }
    };
  }, [url, generateThumbnail]);

  // No URL provided
  if (!url) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <File className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </div>
    );
  }

  // Error state - fallback to icon
  if (hasError || !thumbnailUrl) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <FileText className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  // Success state - show thumbnail
  return (
    <div className={cn("w-full h-full overflow-hidden bg-card", className)} onClick={onClick}>
      <img
        src={thumbnailUrl}
        alt={`PDF thumbnail for ${title}`}
        className="w-full h-full object-cover object-top"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
