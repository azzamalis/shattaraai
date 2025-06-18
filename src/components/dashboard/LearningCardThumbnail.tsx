
import React from 'react';
import { cn } from '@/lib/utils';
import { PDFThumbnailGenerator } from './PDFThumbnailGenerator';

interface LearningCardThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  contentType?: string;
  pdfUrl?: string;
  pdfFilePath?: string;
  children?: React.ReactNode;
}

export function LearningCardThumbnail({ 
  thumbnailUrl, 
  title, 
  contentType,
  pdfUrl,
  pdfFilePath,
  children 
}: LearningCardThumbnailProps) {
  const isPdf = contentType === 'pdf' || contentType === 'file';
  const hasPdfSource = pdfUrl || pdfFilePath;

  return (
    <div className={cn(
      "relative w-full aspect-video",
      "rounded-lg overflow-hidden",
      "border border-border/10"
    )}>
      {children}
      
      <div className={cn(
        "w-full h-full",
        "relative",
        "flex items-center justify-center",
        "bg-gradient-to-b from-transparent to-black/5 dark:to-black/20"
      )}>
        {isPdf && hasPdfSource ? (
          <PDFThumbnailGenerator
            url={pdfUrl}
            filePath={pdfFilePath}
            title={title}
            className="w-full h-full"
          />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="object-cover w-full h-full absolute inset-0"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <span className="text-muted-foreground text-sm">No thumbnail</span>
          </div>
        )}
      </div>
    </div>
  );
}
