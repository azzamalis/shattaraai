
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PDFThumbnailGenerator } from './PDFThumbnailGenerator';
import { Play } from 'lucide-react';

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

// Helper function to extract video thumbnail from various video platforms
const getVideoThumbnail = (url: string): string | null => {
  if (!url) return null;
  
  // Vimeo thumbnail extraction
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(?:.*\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }
  
  // Dailymotion thumbnail extraction
  const dailymotionMatch = url.match(/(?:dailymotion\.com\/video\/)([^_]+)/);
  if (dailymotionMatch && dailymotionMatch[1]) {
    return `https://www.dailymotion.com/thumbnail/video/${dailymotionMatch[1]}`;
  }
  
  return null;
};

// Component to generate thumbnail from video file
const VideoThumbnailGenerator = ({ videoUrl, title }: { videoUrl: string; title: string }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.muted = true;
        
        video.onloadedmetadata = () => {
          // Set current time to 10% of video duration or 5 seconds, whichever is smaller
          video.currentTime = Math.min(video.duration * 0.1, 5);
        };
        
        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setThumbnailUrl(dataUrl);
            }
          } catch (err) {
            console.error('Error generating video thumbnail:', err);
            setError(true);
          }
        };
        
        video.onerror = () => {
          setError(true);
        };
        
        video.src = videoUrl;
        video.load();
      } catch (err) {
        console.error('Error setting up video thumbnail generation:', err);
        setError(true);
      }
    };

    if (videoUrl && !thumbnailUrl && !error) {
      generateThumbnail();
    }
  }, [videoUrl, thumbnailUrl, error]);

  if (error || !thumbnailUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
        <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-3">
          <Play className="w-8 h-8 text-white/70" />
        </div>
        <span className="text-white/70 text-sm font-medium">Video</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img
        src={thumbnailUrl}
        alt={title}
        className="object-cover w-full h-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center justify-center w-12 h-12 bg-black/50 rounded-full">
          <Play className="w-6 h-6 text-white ml-1" />
        </div>
      </div>
    </div>
  );
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
  const isVideo = contentType === 'video';
  const hasPdfSource = pdfUrl;

  // Generate YouTube thumbnail if it's a YouTube content type
  const youtubeThumbnail = isYoutube && pdfUrl ? getYouTubeThumbnail(pdfUrl) : null;
  
  // Generate video thumbnail if it's a video content type
  const videoThumbnail = isVideo && pdfUrl ? getVideoThumbnail(pdfUrl) : null;
  
  // Determine which thumbnail to use
  const displayThumbnail = thumbnailUrl || youtubeThumbnail || videoThumbnail;

  // Check if it's a direct video file
  const isDirectVideoFile = isVideo && pdfUrl && pdfUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i);

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
        ) : isDirectVideoFile ? (
          <VideoThumbnailGenerator videoUrl={pdfUrl!} title={title} />
        ) : isVideo ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-3">
              <Play className="w-8 h-8 text-white/70" />
            </div>
            <span className="text-white/70 text-sm font-medium">Video</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <span className="text-muted-foreground text-sm">No thumbnail</span>
          </div>
        )}
      </div>
    </div>
  );
}
