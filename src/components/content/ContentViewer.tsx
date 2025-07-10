import React from 'react';
import { ContentData } from '@/pages/ContentPage';
import { FileText, Video, Youtube, Globe, FileUp, ClipboardPaste } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface ContentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  currentTimestamp?: number;
}

export function ContentViewer({ contentData, onUpdateContent, onTextAction, currentTimestamp }: ContentViewerProps) {
  const renderVideoPlayer = (url: string) => (
    <video
      src={url}
      controls
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error('Video loading error:', e);
        // Could implement fallback or error handling here
      }}
    />
  );

  const renderAudioPlayer = (url: string) => (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <audio
        src={url}
        controls
        className="w-full max-w-md"
        onError={(e) => {
          console.error('Audio loading error:', e);
        }}
      />
      <p className="text-sm text-muted-foreground mt-4">
        {contentData.filename || 'Audio File'}
      </p>
    </div>
  );

  const renderViewer = () => {
    switch (contentData.type) {
      case 'pdf':
        // Use storage URL instead of blob URL - prefer storage_path or url
        const pdfUrl = contentData.url && !contentData.url.startsWith('blob:') 
          ? contentData.url 
          : contentData.filePath && !contentData.filePath.startsWith('blob:')
          ? contentData.filePath
          : null;
        
        console.log('PDF URL for viewer:', pdfUrl, 'Content data:', contentData);
        
        if (!pdfUrl) {
          return (
            <div className="w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm">PDF Viewer</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No valid PDF URL available</span>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <PDFViewer
            url={pdfUrl}
            onTextAction={onTextAction}
          />
        );
      
      case 'video':
        const videoUrl = contentData.url && !contentData.url.startsWith('blob:') ? contentData.url : null;
        return (
          <div className="w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
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
        return (
          <div className="w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {audioUrl ? (
              renderAudioPlayer(audioUrl)
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm">Audio Player</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No valid audio URL available</span>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'youtube':
        const videoId = contentData.url ? extractYouTubeId(contentData.url) : '';
        const embedUrl = currentTimestamp 
          ? `https://www.youtube.com/embed/${videoId}?start=${currentTimestamp}&autoplay=1`
          : `https://www.youtube.com/embed/${videoId}`;
        
        return (
          <div className="w-full bg-background rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {/* YouTube Player */}
            {videoId && (
              <div className="aspect-video">
                <iframe
                  key={`${videoId}-${currentTimestamp}`}
                  src={embedUrl}
                  className="w-full h-full"
                  title="YouTube Player"
                  allowFullScreen
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
        return (
          <div className="w-full h-64 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator p-4 overflow-auto">
            {contentData.text || contentData.url ? (
              <div className="text-dashboard-text dark:text-dashboard-text text-sm">
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
