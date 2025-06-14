
import React from 'react';
import { cn } from '@/lib/utils';

interface LearningCardThumbnailProps {
  thumbnailUrl?: string;
  title: string;
  children?: React.ReactNode;
}

export function LearningCardThumbnail({ thumbnailUrl, title, children }: LearningCardThumbnailProps) {
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
        {thumbnailUrl ? (
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
