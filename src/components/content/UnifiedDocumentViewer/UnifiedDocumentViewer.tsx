import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { UnifiedDocumentProvider, useUnifiedDocument, DocumentType } from './UnifiedDocumentContext';
import { EnhancedDocumentToolbar } from './EnhancedDocumentToolbar';
import { PDFRenderer } from './PDFRenderer';
import { DOCXRenderer } from './DOCXRenderer';
import { HTMLRenderer } from './HTMLRenderer';
import { TextRenderer } from './TextRenderer';
import { ThumbnailView } from './ThumbnailView';
import { WebsiteRenderer } from './WebsiteRenderer';
import { WebsiteMetadataSidebar } from './WebsiteMetadataSidebar';
import { useWebsiteData } from './useWebsiteData';

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
    isMetadataOpen,
    setDocumentType,
    setError,
    setPdfUrl,
  } = useUnifiedDocument();

  // For HTML content, extract metadata for sidebar using the hook
  const websiteData = documentType === 'html' 
    ? useWebsiteData(
        contentData.text_content || '',
        contentData,
        contentData.title || contentData.filename
      )
    : null;

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
        return <PDFRenderer url={contentData.url} />;

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
        return <DOCXRenderer url={contentData.url} />;

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
          <WebsiteRenderer 
            htmlContent={contentData.text_content} 
            title={contentData.title || contentData.filename}
            contentData={contentData}
          />
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
          <TextRenderer 
            content={contentData.text_content}
            title={contentData.title || contentData.filename}
            isMarkdown={contentData.type === 'text' && contentData.filename?.endsWith('.md')}
          />
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
      <div className="flex-1 min-h-0 relative grid transition-all duration-300 bg-white dark:bg-neutral-800/50"
        style={{
          gridTemplateColumns: `${isThumbnailsOpen ? 'auto' : '0'} ${isMetadataOpen && documentType === 'html' ? 'auto' : '0'} 1fr`
        }}
      >
        {/* Thumbnail Sidebar - Left (for PDFs) */}
        {isThumbnailsOpen && (
          <div className="overflow-y-auto overflow-x-hidden border-r border-primary/10">
            <ThumbnailView />
          </div>
        )}
        
        {/* Metadata Sidebar - Center (for HTML) */}
        {isMetadataOpen && documentType === 'html' && websiteData && (
          <WebsiteMetadataSidebar
            articleStructure={websiteData.articleStructure}
            extractedLinks={websiteData.extractedLinks}
            websiteInfo={websiteData.websiteInfo}
          />
        )}
        
        {/* Main Content - Right */}
        <div className="overflow-auto">
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