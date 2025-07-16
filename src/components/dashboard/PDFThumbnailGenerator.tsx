
import React from 'react';
import { FileText, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFThumbnailGeneratorProps {
  url?: string;
  title: string;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
}

export function PDFThumbnailGenerator({ url, title, className, onClick }: PDFThumbnailGeneratorProps) {
  if (!url) {
    return (
      <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
        <File className="w-12 h-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full flex items-center justify-center bg-card", className)} onClick={onClick}>
      <FileText className="w-12 h-12 text-muted-foreground" />
    </div>
  );
}
