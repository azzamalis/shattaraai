
import React from 'react';
import { FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
}

export function PDFThumbnailGenerator({ url, title, className }: PDFThumbnailGeneratorProps) {
  // For now, we'll show a simple PDF icon instead of generating thumbnails
  // This can be enhanced later with thumbnail generation using the new PDF viewer
  
  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20", className)}>
        <div className="flex flex-col items-center text-muted-foreground">
          <File className="h-8 w-8 mb-2" />
          <span className="text-xs">No File</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center border border-red-200 dark:border-red-800", className)}>
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
