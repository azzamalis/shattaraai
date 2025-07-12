
import React, { useState, useEffect, useRef } from 'react';
import { FileText, File, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
  onClick?: () => void;
}

export function PDFThumbnailGenerator({ url, title, className, onClick }: PDFThumbnailGeneratorProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!url) return;

    const generateThumbnail = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // Load the PDF document
        const pdf = await pdfjsLib.getDocument(url).promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        // Set up canvas
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        // Calculate scale to fit thumbnail size
        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(200 / viewport.width, 250 / viewport.height);
        const scaledViewport = page.getViewport({ scale });
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Render the page
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        setThumbnailUrl(dataUrl);
      } catch (err) {
        console.error('Error generating PDF thumbnail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    generateThumbnail();
  }, [url]);

  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors", className)} onClick={onClick}>
        <div className="flex flex-col items-center text-muted-foreground">
          <File className="h-8 w-8 mb-2" />
          <span className="text-xs">No File</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center border border-red-200 dark:border-red-800 cursor-pointer", className)} onClick={onClick}>
        <div className="flex flex-col items-center text-red-600 dark:text-red-400">
          <Loader2 className="h-8 w-8 mb-1 animate-spin" />
          <span className="text-xs font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !thumbnailUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center border border-red-200 dark:border-red-800 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors", className)} onClick={onClick}>
        <div className="flex flex-col items-center text-red-600 dark:text-red-400">
          <FileText className="h-8 w-8 mb-1" />
          <span className="text-xs font-medium">PDF</span>
          {title && (
            <span className="text-xs text-center px-2 truncate max-w-full mt-1 text-red-500 dark:text-red-300">
              {title.length > 15 ? `${title.substring(0, 15)}...` : title}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden border border-border cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all group", className)} onClick={onClick}>
      <canvas ref={canvasRef} className="hidden" />
      <img 
        src={thumbnailUrl} 
        alt={`PDF preview: ${title}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-2 left-2 right-2">
          <span className="text-white text-xs font-medium truncate block">
            {title}
          </span>
          <span className="text-white/70 text-xs">Click to view</span>
        </div>
      </div>
    </div>
  );
}
