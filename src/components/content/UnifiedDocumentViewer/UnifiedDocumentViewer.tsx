import React, { useEffect, Suspense, lazy } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { UnifiedDocumentProvider, useUnifiedDocument, DocumentType } from './UnifiedDocumentContext';
import { EnhancedDocumentToolbar } from './EnhancedDocumentToolbar';
import { ThumbnailView } from './ThumbnailView';

// Lazy load heavy document renderers
const PDFRenderer = lazy(() => import('./PDFRenderer').then(m => ({ default: m.PDFRenderer })));
const DOCXRenderer = lazy(() => import('./DOCXRenderer').then(m => ({ default: m.DOCXRenderer })));
const HTMLRenderer = lazy(() => import('./HTMLRenderer').then(m => ({ default: m.HTMLRenderer })));
const TextRenderer = lazy(() => import('./TextRenderer').then(m => ({ default: m.TextRenderer })));
const WebsiteRenderer = lazy(() => import('./WebsiteRenderer').then(m => ({ default: m.WebsiteRenderer })));

interface ContentData {
  id?: string;
  type?: string;
  title?: string;
  url?: string;
  filename?: string;
  text_content?: string;
  processing_status?: string;
}

interface UnifiedDocumentViewerProps {
  contentData: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}

function UnifiedDocumentViewerContent({ contentData, onUpdateContent }: UnifiedDocumentViewerProps) {
  const {
    viewMode,
    documentType,
    isFullscreen,
    isThumbnailsOpen,
    setDocumentType,
    setError,
    setPdfUrl,
  } = useUnifiedDocument();

  // Detect content type based on contentData
  const detectContentType = (data: ContentData): DocumentType => {
    if (data.url?.toLowerCase().endsWith('.pdf') || data.type === 'pdf') return 'pdf';
    if (data.url?.match(/\.(docx?|doc)$/i) || (data.type === 'file' && data.filename?.match(/\.(docx?|doc)$/i))) return 'docx';
    if (data.type === 'website' && data.text_content) return 'html';
    if ((data.type === 'text' || data.text_content) && !data.url) return 'text';
    return 'unknown';
  };

  useEffect(() => {
    const detectedType = detectContentType(contentData);
    setDocumentType(detectedType);
    
    // Set PDF URL if it's a PDF
    if (detectedType === 'pdf' && contentData.url) {
      setPdfUrl(contentData.url);
    } else {
      setPdfUrl(null);
    }
    
    if (detectedType === 'unknown') {
      setError('Unsupported document type');
    }
  }, [contentData, setDocumentType, setError, setPdfUrl]);

  const handleDownload = () => {
    if (contentData.url) {
      window.open(contentData.url, '_blank');
    }
  };

  const renderDocumentContent = () => {
    if (viewMode === 'thumbnail') {
      return <ThumbnailView />;
    }

    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
          <p className="text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    );

    switch (documentType) {
      case 'pdf':
        if (!contentData.url) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No PDF URL available</p>
              </div>
            </div>
          );
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PDFRenderer url={contentData.url} />
          </Suspense>
        );

      case 'docx':
        if (!contentData.url) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No document URL available</p>
              </div>
            </div>
          );
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <DOCXRenderer url={contentData.url} />
          </Suspense>
        );

      case 'html':
        if (!contentData.text_content) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No webpage content available</p>
              </div>
            </div>
          );
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HTMLRenderer 
              htmlContent={contentData.text_content} 
              title={contentData.title || contentData.filename}
            />
          </Suspense>
        );

      case 'text':
        if (!contentData.text_content) {
          return (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No text content available</p>
              </div>
            </div>
          );
        }
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TextRenderer 
              content={contentData.text_content}
              title={contentData.title || contentData.filename}
              isMarkdown={contentData.type === 'text' && contentData.filename?.endsWith('.md')}
            />
          </Suspense>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Unsupported document type: {contentData.type}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`h-full w-full flex flex-col bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl border border-primary/10 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <EnhancedDocumentToolbar 
        onDownload={handleDownload}
        contentData={contentData}
      />
      <div className="flex-1 min-h-0 relative flex transition-all duration-300 bg-white dark:bg-neutral-800/50">
        {/* Thumbnail Sidebar */}
        {isThumbnailsOpen && (
          <div className="w-48 flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-primary/10">
            <ThumbnailView />
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {renderDocumentContent()}
        </div>
      </div>
    </div>
  );
}

export function UnifiedDocumentViewer({ contentData, onUpdateContent }: UnifiedDocumentViewerProps) {
  return (
    <UnifiedDocumentProvider>
      <UnifiedDocumentViewerContent 
        contentData={contentData} 
        onUpdateContent={onUpdateContent}
      />
    </UnifiedDocumentProvider>
  );
}