
import React, { useRef, useEffect, useState } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { FileText, Video, Youtube, Globe, FileUp, ClipboardPaste, Expand, Minimize2 } from 'lucide-react';
import { NewPDFViewer } from './NewPDFViewer';
import { WaveformAudioPlayer } from './WaveformAudioPlayer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface ContentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  currentTimestamp?: number;
  onExpandText?: () => void;
  onSeekToTimestamp?: (timestamp: number) => void;
}

export function ContentViewer({ contentData, onUpdateContent, onTextAction, currentTimestamp, onExpandText, onSeekToTimestamp }: ContentViewerProps) {
  const youtubePlayerRef = useRef<HTMLIFrameElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  console.log('DEBUG: ContentViewer - Rendering with content data:', {
    id: contentData.id,
    type: contentData.type,
    title: contentData.title,
    url: contentData.url,
    filename: contentData.filename,
    hasMetadata: !!contentData.metadata,
    metadataKeys: contentData.metadata ? Object.keys(contentData.metadata) : []
  });

  // Handle timestamp changes for YouTube videos and regular videos
  useEffect(() => {
    if (currentTimestamp !== undefined) {
      if (contentData.type === 'youtube' && youtubePlayerRef.current) {
        // Use postMessage to seek to timestamp in YouTube iframe
        const iframe = youtubePlayerRef.current;
        const videoId = contentData.url ? extractYouTubeId(contentData.url) : '';
        
        if (videoId) {
          // Send seekTo command to YouTube player
          iframe.contentWindow?.postMessage(
            `{"event":"command","func":"seekTo","args":[${currentTimestamp}, true]}`,
            'https://www.youtube.com'
          );
          
          // Also send playVideo command to ensure it plays
          iframe.contentWindow?.postMessage(
            `{"event":"command","func":"playVideo","args":[]}`,
            'https://www.youtube.com'
          );
        }
      } else if (contentData.type === 'video' && videoPlayerRef.current) {
        // Seek regular video player to timestamp
        videoPlayerRef.current.currentTime = currentTimestamp;
        videoPlayerRef.current.play().catch(console.error);
      }
    }
  }, [currentTimestamp, contentData.type, contentData.url]);
  
  // Expose seek functionality to parent component
  useEffect(() => {
    if (onSeekToTimestamp) {
      const seekHandler = (timestamp: number) => {
        if (contentData.type === 'video' && videoPlayerRef.current) {
          videoPlayerRef.current.currentTime = timestamp;
          videoPlayerRef.current.play().catch(console.error);
        } else if (contentData.type === 'youtube' && youtubePlayerRef.current) {
          const videoId = contentData.url ? extractYouTubeId(contentData.url) : '';
          if (videoId) {
            youtubePlayerRef.current.contentWindow?.postMessage(
              `{"event":"command","func":"seekTo","args":[${timestamp}, true]}`,
              'https://www.youtube.com'
            );
            youtubePlayerRef.current.contentWindow?.postMessage(
              `{"event":"command","func":"playVideo","args":[]}`,
              'https://www.youtube.com'
            );
          }
        }
      };
      
      // Store the seek handler for external access
      (onSeekToTimestamp as any).seekHandler = seekHandler;
    }
  }, [contentData.type, contentData.url, onSeekToTimestamp]);

  const renderVideoPlayer = (url: string) => {
    console.log('DEBUG: ContentViewer - Rendering video player with URL:', url);
    return (
      <video
        ref={videoPlayerRef}
        src={url}
        controls
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('DEBUG: ContentViewer - Video loading error:', e);
        }}
      />
    );
  };

  const renderAudioPlayer = (url: string) => {
    console.log('DEBUG: ContentViewer - Rendering audio player with URL:', url);
    return (
      <WaveformAudioPlayer 
        metadata={{ audioUrl: url }}
        currentTimestamp={currentTimestamp}
      />
    );
  };

  const renderViewer = () => {
    console.log('DEBUG: ContentViewer - renderViewer called for type:', contentData.type);

    switch (contentData.type) {
      case 'pdf':
        return (
          <NewPDFViewer 
            contentData={contentData}
            onFileUploaded={(url) => onUpdateContent({ url })}
          />
        );
      
      case 'video':
        const videoUrl = contentData.url && !contentData.url.startsWith('blob:') ? contentData.url : null;
        console.log('DEBUG: ContentViewer - Video URL processing:', { originalUrl: contentData.url, finalUrl: videoUrl });
        return (
          <div className="relative w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {videoUrl ? (
              renderVideoPlayer(videoUrl)
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <Video className="h-8 w-8 mb-2" />
                  <span className="text-sm">Video Player</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No valid video URL available</span>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'audio_file':
      case 'recording':
      case 'live_recording':
        const audioUrl = contentData.url && !contentData.url.startsWith('blob:') ? contentData.url : null;
        console.log('DEBUG: ContentViewer - Audio URL processing:', { originalUrl: contentData.url, finalUrl: audioUrl });
        return audioUrl ? (
          renderAudioPlayer(audioUrl)
        ) : (
          <div className="w-full sticky top-0 z-10 bg-background border-b border-border flex-shrink-0 min-w-0 p-4">
            <div className="flex flex-col items-center text-foreground/60">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-sm">Audio Player</span>
              <span className="text-xs">No valid audio URL available</span>
            </div>
          </div>
        );
      
      case 'youtube':
        const videoId = contentData.url ? extractYouTubeId(contentData.url) : '';
        console.log('DEBUG: ContentViewer - YouTube processing:', { originalUrl: contentData.url, extractedVideoId: videoId });
        
        return (
          <div className="w-full bg-background rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {/* YouTube Player */}
            {videoId && (
              <div className="aspect-video">
                <iframe
                  ref={youtubePlayerRef}
                  src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`}
                  className="w-full h-full"
                  title="YouTube Player"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            )}
            
            
            {/* Fallback for no video ID */}
            {!videoId && (
              <div className="flex items-center justify-center h-32">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <Youtube className="h-8 w-8 mb-2" />
                  <span className="text-sm">YouTube Player</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No YouTube URL provided</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'upload':
      case 'file':
        // Handle various file types from storage
        const fileUrl = contentData.url && !contentData.url.startsWith('blob:') ? contentData.url : null;
        console.log('DEBUG: ContentViewer - File URL processing:', { originalUrl: contentData.url, finalUrl: fileUrl });
        return (
          <div className="w-full h-64 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
            {fileUrl ? (
              <div className="flex flex-col items-center justify-center h-full p-4">
                <FileText className="h-12 w-12 mb-4 text-primary" />
                <span className="text-sm font-medium text-dashboard-text dark:text-dashboard-text mb-2">
                  {contentData.filename || 'Document'}
                </span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Open File
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <FileUp className="h-8 w-8 mb-2" />
                  <span className="text-sm">File Upload</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No valid file URL available</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'text':
      case 'website':
        console.log('DEBUG: ContentViewer - Text/Website content:', { text: contentData.text, url: contentData.url });
        
        return (
          <div className="relative w-full h-64 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator p-4 overflow-auto">
            {/* Expand Button */}
            {(contentData.text || contentData.url) && onExpandText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExpandText}
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-dashboard-separator/20 z-10 transition-colors"
                aria-label="Expand content"
              >
                <Expand className="h-4 w-4 text-foreground" />
              </Button>
            )}
            
            {contentData.text || contentData.url ? (
              <div className="text-dashboard-text dark:text-dashboard-text text-sm pr-10">
                {contentData.text ? (
                  <pre className="whitespace-pre-wrap font-sans">{contentData.text}</pre>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Website Content</span>
                    </div>
                    <a href={contentData.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {contentData.url}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <ClipboardPaste className="h-8 w-8 mb-2" />
                  <span className="text-sm">Text Content</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No content provided</span>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        console.log('DEBUG: ContentViewer - Default case for unknown content type:', contentData.type);
        return (
          <div className="w-full h-64 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                <Globe className="h-8 w-8 mb-2" />
                <span className="text-sm">Content Viewer</span>
                <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">Loading...</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderViewer()}
    </div>
  );
}

function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}
