import React from 'react';
import { Play, Mic, FileText, Globe, MessageSquare, AudioLines, Upload, Type } from 'lucide-react';
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
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /youtube\.com\/v\/([^&\n?#]+)/];
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
  const isVideo = contentType === 'video';
  const isRecording = contentType === 'recording' || contentType === 'live_recording';
  const isAudioFile = contentType === 'audio_file';
  const isWebsite = contentType === 'website';
  const isText = contentType === 'text';
  const isUpload = contentType === 'upload';
  const isChat = contentType === 'chat';
  const hasPdfSource = pdfUrl;

  // Generate YouTube thumbnail if it's a YouTube content type
  const youtubeThumbnail = isYoutube && pdfUrl ? getYouTubeThumbnail(pdfUrl) : null;

  // Determine which thumbnail to use
  const displayThumbnail = thumbnailUrl || youtubeThumbnail;

  // Function to render icon thumbnails for content types without images
  const renderIconThumbnail = () => {
    if (isRecording) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <Mic className="w-12 h-12 text-muted-foreground" />
        </div>;
    }
    if (isAudioFile) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <AudioLines className="w-16 h-16 text-muted-foreground" />
        </div>;
    }
    if (isWebsite) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <Globe className="w-16 h-16 text-muted-foreground" />
        </div>;
    }
    if (isText) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <Type className="w-12 h-12 text-muted-foreground" />
        </div>;
    }
    if (isUpload) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <Upload className="w-12 h-12 text-muted-foreground" />
        </div>;
    }
    if (isVideo) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <Play className="w-16 h-16 text-muted-foreground" />
        </div>;
    }
    if (isChat) {
      return <div className="w-full h-full flex items-center justify-center bg-card">
          <MessageSquare className="w-12 h-12 text-muted-foreground" />
        </div>;
    }

    // Default fallback
    return <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <span className="text-muted-foreground text-sm">No thumbnail</span>
      </div>;
  };
  return <div className={cn("relative w-full aspect-video", "rounded-lg overflow-hidden", "border border-border/10")}>
      {children}
      
      <div className={cn("w-full h-full", "relative", "flex items-center justify-center", "bg-gradient-to-b from-transparent to-black/5 dark:to-black/20")}>
        {isPdf && hasPdfSource ? <PDFThumbnailGenerator url={pdfUrl} title={title} className="w-full h-full" /> : displayThumbnail ? <img src={displayThumbnail} alt={title} className="object-cover w-full h-full absolute inset-0" onError={e => {
        // If maxresdefault fails for YouTube, try hqdefault
        if (isYoutube && youtubeThumbnail && e.currentTarget.src.includes('maxresdefault')) {
          const videoId = youtubeThumbnail.split('/')[4];
          e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }} /> : renderIconThumbnail()}
      </div>
    </div>;
}