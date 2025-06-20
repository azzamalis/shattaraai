
import React from 'react';
import { cn } from '@/lib/utils';
import { PDFThumbnailGenerator } from './PDFThumbnailGenerator';

interface LearningCardThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  contentType?: string;
  pdfUrl?: string;
  children?: React.ReactNode;
}

// Helper function to extract YouTube video ID and generate thumbnail URL
const getYouTubeThumbnail = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Use maxresdefault for best quality, fallback to hqdefault if not available
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
  }
  
  return null;
};

export function LearningCardThumbnail({ 
  thumbnailUrl, 
  title, 
  contentType,
  pdfUrl,
  children 
}: LearningCardThumbnailProps) {
  const isPdf = contentType === 'pdf' || contentType === 'file';
  const isYoutube = contentType === 'youtube';
  const hasPdfSource = pdfUrl;

  // Generate YouTube thumbnail if it's a YouTube content type
  const youtubeThumbnail = isYoutube && pdfUrl ? getYouTubeThumbnail(pdfUrl) : null;
  
  // Determine which thumbnail to use
  const displayThumbnail = thumbnailUrl || youtubeThumbnail;

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
            title={title}
            className="w-full h-full"
          />
        ) : displayThumbnail ? (
          <img
            src={displayThumbnail}
            alt={title}
            className="object-cover w-full h-full absolute inset-0"
            onError={(e) => {
              // If maxresdefault fails for YouTube, try hqdefault
              if (isYoutube && youtubeThumbnail && e.currentTarget.src.includes('maxresdefault')) {
                const videoId = youtubeThumbnail.split('/')[4];
                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
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
