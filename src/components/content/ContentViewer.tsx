
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
            <div className="flex items-center justify-center h-full bg-card rounded-xl border border-border">
              <div className="flex flex-col items-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">PDF Loading Error</p>
                <p className="text-sm text-muted-foreground/60">
                  Unable to load PDF file
                </p>
                <div className="text-xs text-muted-foreground/40 mt-2 space-y-1">
                  <p>Storage path: {contentData.storage_path || 'None'}</p>
                  <p>URL: {pdfUrl || 'None'}</p>
                  <p>ID: {contentData.id}</p>
                </div>
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
          <div className="w-full h-80 bg-card rounded-xl border border-border overflow-hidden">
            {contentData.url || contentData.filePath ? (
              <video
                src={contentData.url || contentData.filePath}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Video className="h-8 w-8 mb-2" />
                  <span className="text-sm">Video Player</span>
                  <span className="text-xs text-muted-foreground/60">No video loaded</span>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'youtube':
        return (
          <div className="w-full h-80 bg-card rounded-xl border border-border overflow-hidden">
            {contentData.url ? (
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(contentData.url)}`}
                className="w-full h-full"
                title="YouTube Player"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Youtube className="h-8 w-8 mb-2" />
                  <span className="text-sm">YouTube Player</span>
                  <span className="text-xs text-muted-foreground/60">No YouTube URL provided</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'upload':
        return (
          <div className="w-full h-64 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center text-muted-foreground">
                <FileUp className="h-8 w-8 mb-2" />
                <span className="text-sm">File Upload</span>
                {contentData.filename ? (
                  <span className="text-xs text-foreground">{contentData.filename}</span>
                ) : (
                  <span className="text-xs text-muted-foreground/60">No file uploaded</span>
                )}
              </div>
            </div>
          </div>
        );

      case 'text':
      case 'website':
        return (
          <div className="w-full h-64 bg-card rounded-xl border border-border p-4 overflow-auto">
            {contentData.text || contentData.url ? (
              <div className="text-foreground text-sm">
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
                <div className="flex flex-col items-center text-muted-foreground">
                  <ClipboardPaste className="h-8 w-8 mb-2" />
                  <span className="text-sm">Text Content</span>
                  <span className="text-xs text-muted-foreground/60">No content provided</span>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="w-full h-64 bg-card rounded-xl border border-border">
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center text-muted-foreground">
                <Globe className="h-8 w-8 mb-2" />
                <span className="text-sm">Content Viewer</span>
                <span className="text-xs text-muted-foreground/60">Loading...</span>
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
