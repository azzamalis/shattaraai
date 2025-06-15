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
  const renderViewer = () => {
    switch (contentData.type) {
      case 'pdf':
        const pdfUrl = contentData.url;
        console.log('ContentViewer - Rendering PDF with data:', {
          type: contentData.type,
          url: pdfUrl,
          storage_path: contentData.storage_path,
          filename: contentData.filename,
          title: contentData.title
        });
        
        if (!pdfUrl) {
          console.warn('ContentViewer - No PDF URL available for content:', contentData);
          return (
            <div className="flex items-center justify-center h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
              <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">PDF Loading Error</p>
                <p className="text-sm text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
                  Unable to load PDF file
                </p>
                <p className="text-xs text-dashboard-text-secondary/40 dark:text-dashboard-text-secondary/40 mt-2">
                  Storage path: {contentData.storage_path || 'None'}
                </p>
                <p className="text-xs text-dashboard-text-secondary/40 dark:text-dashboard-text-secondary/40">
                  URL: {pdfUrl || 'None'}
                </p>
              </div>
            </div>
          );
        }
        
        console.log('ContentViewer - Rendering PDFViewer with URL:', pdfUrl);
        return (
          <PDFViewer
            url={pdfUrl}
            filePath={contentData.filePath}
            onTextAction={onTextAction}
          />
        );
      
      case 'video':
        return (
          <div className="w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {contentData.url || contentData.filePath ? (
              <video
                src={contentData.url || contentData.filePath}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  <Video className="h-8 w-8 mb-2" />
                  <span className="text-sm">Video Player</span>
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No video loaded</span>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'youtube':
        return (
          <div className="w-full h-80 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
            {contentData.url ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(contentData.url)}`}
                className="w-full h-full"
                title="YouTube Player"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full">
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
        return (
          <div className="w-full h-64 bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                <FileUp className="h-8 w-8 mb-2" />
                <span className="text-sm">File Upload</span>
                {contentData.filename ? (
                  <span className="text-xs text-dashboard-text dark:text-dashboard-text">{contentData.filename}</span>
                ) : (
                  <span className="text-xs text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">No file uploaded</span>
                )}
              </div>
            </div>
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
