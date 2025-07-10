import React from 'react';
import { ContentData } from '@/pages/ContentPage';
import { FileText, Video, Youtube, Globe, FileUp, ClipboardPaste } from 'lucide-react';
import { PDFViewer } from './PDFViewer';

interface ContentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function ContentViewer({ contentData, onUpdateContent, onTextAction }: ContentViewerProps) {
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
        const chapters = contentData.metadata?.chapters as Array<{title: string; startTime: number; endTime?: number}> || [];
        const hasTranscript = contentData.text && contentData.text.length > 100;
        const hasChapters = chapters.length > 0;
        
        return (
          <div className="w-full space-y-4">
            {/* YouTube Player */}
            <div className="bg-background rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
              {videoId ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    title="YouTube Player"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    <Youtube className="h-8 w-8 mb-2" />
                    <span className="text-sm">YouTube Player</span>
                    <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No YouTube URL provided</span>
                  </div>
                </div>
              )}
            </div>


            {/* Chapters & Transcript Tabs */}
            {(hasChapters || hasTranscript) && (
              <div className="bg-dashboard-card rounded-xl border border-dashboard-separator">
                <div className="border-b border-dashboard-separator">
                  <div className="flex">
                    {hasChapters && (
                      <button
                        className="px-4 py-3 text-sm font-medium text-dashboard-text hover:text-primary border-b-2 border-primary"
                        onClick={() => {
                          // Tab switching logic would go here
                          const chaptersTab = document.getElementById('chapters-tab');
                          const transcriptTab = document.getElementById('transcript-tab');
                          const chaptersBtn = document.querySelector('[data-tab="chapters"]');
                          const transcriptBtn = document.querySelector('[data-tab="transcript"]');
                          
                          if (chaptersTab && transcriptTab && chaptersBtn && transcriptBtn) {
                            chaptersTab.style.display = 'block';
                            transcriptTab.style.display = 'none';
                            chaptersBtn.classList.add('border-primary', 'text-primary');
                            chaptersBtn.classList.remove('border-transparent', 'text-dashboard-text-secondary');
                            transcriptBtn.classList.remove('border-primary', 'text-primary');
                            transcriptBtn.classList.add('border-transparent', 'text-dashboard-text-secondary');
                          }
                        }}
                        data-tab="chapters"
                      >
                        Chapters
                      </button>
                    )}
                    {hasTranscript && (
                      <button
                        className={`px-4 py-3 text-sm font-medium hover:text-primary border-b-2 ${
                          !hasChapters ? 'border-primary text-primary' : 'border-transparent text-dashboard-text-secondary'
                        }`}
                        onClick={() => {
                          // Tab switching logic would go here
                          const chaptersTab = document.getElementById('chapters-tab');
                          const transcriptTab = document.getElementById('transcript-tab');
                          const chaptersBtn = document.querySelector('[data-tab="chapters"]');
                          const transcriptBtn = document.querySelector('[data-tab="transcript"]');
                          
                          if (chaptersTab && transcriptTab && chaptersBtn && transcriptBtn) {
                            transcriptTab.style.display = 'block';
                            chaptersTab.style.display = 'none';
                            transcriptBtn.classList.add('border-primary', 'text-primary');
                            transcriptBtn.classList.remove('border-transparent', 'text-dashboard-text-secondary');
                            chaptersBtn.classList.remove('border-primary', 'text-primary');
                            chaptersBtn.classList.add('border-transparent', 'text-dashboard-text-secondary');
                          }
                        }}
                        data-tab="transcript"
                      >
                        Transcript
                      </button>
                    )}
                  </div>
                </div>

                {/* Chapters Content */}
                {hasChapters && (
                  <div id="chapters-tab" className="p-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {chapters.map((chapter, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 hover:bg-background rounded-lg transition-colors">
                          <span className="text-xs font-mono text-dashboard-text-secondary bg-background px-2 py-1 rounded border">
                            {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                          </span>
                          <span className="text-sm text-dashboard-text">{chapter.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transcript Content */}
                {hasTranscript && (
                  <div id="transcript-tab" className={`p-4 ${hasChapters ? 'hidden' : ''}`}>
                    <div className="max-h-96 overflow-y-auto">
                      <p className="text-sm text-dashboard-text whitespace-pre-wrap leading-relaxed">{contentData.text}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description (fallback if no transcript) */}
            {!hasTranscript && contentData.text && (
              <div className="p-4 bg-dashboard-card rounded-lg border border-dashboard-separator">
                <h3 className="font-medium mb-2 text-dashboard-text">Description</h3>
                <p className="text-sm text-dashboard-text whitespace-pre-wrap">{contentData.text}</p>
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
