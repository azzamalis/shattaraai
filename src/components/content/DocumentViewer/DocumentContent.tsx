import React, { useState, useEffect } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Loader2, 
  AlertCircle, 
  Download,
  RefreshCw,
  Eye 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface DocumentContentProps {
  contentData: ContentData;
  zoomLevel: number;
  viewMode: 'single' | 'continuous' | 'two-page';
  highlightedText?: string;
  searchQuery?: string;
  onTextSelect?: (text: string) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  isLoading?: boolean;
}

export function DocumentContent({
  contentData,
  zoomLevel,
  viewMode,
  highlightedText,
  searchQuery,
  onTextSelect,
  onTextAction,
  isLoading
}: DocumentContentProps) {
  const [extractedText, setExtractedText] = useState<string | null>(contentData.text || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');

  // Auto-trigger text extraction for Word documents
  useEffect(() => {
    const shouldExtractText = contentData.type === 'file' && 
      contentData.filename && 
      (contentData.filename.endsWith('.docx') || contentData.filename.endsWith('.doc')) &&
      !extractedText && 
      contentData.url &&
      !isProcessing;

    if (shouldExtractText) {
      extractWordText();
    }
  }, [contentData, extractedText, isProcessing]);

  const extractWordText = async () => {
    if (!contentData.url || !contentData.id) return;
    
    setIsProcessing(true);
    setProcessingError(null);

    try {
      const response = await supabase.functions.invoke('extract-word-text', {
        body: { 
          contentId: contentData.id,
          fileUrl: contentData.url 
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to extract text');
      }

      if (response.data?.text) {
        setExtractedText(response.data.text);
        // Update the content data with extracted text
        // onUpdateContent?.({ text: response.data.text });
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Failed to extract text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 0) {
      setSelectedText(text);
      onTextSelect?.(text);
    }
  };

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  };

  const renderContent = () => {
    // Handle different content types
    switch (contentData.type) {
      case 'file':
        if (contentData.filename?.match(/\.(docx?|txt|rtf|odt)$/i)) {
          return renderTextContent();
        }
        if (contentData.filename?.match(/\.(xlsx?|csv)$/i)) {
          return renderSpreadsheetContent();
        }
        if (contentData.filename?.match(/\.(pptx?|ppt|odp)$/i)) {
          return renderPresentationContent();
        }
        if (contentData.filename?.match(/\.(jpe?g|png|gif|svg|webp)$/i)) {
          return renderImageContent();
        }
        return renderGenericFileContent();
      
      case 'text':
      case 'website':
        return renderTextContent();
      
      default:
        return renderGenericFileContent();
    }
  };

  const renderTextContent = () => {
    const displayText = extractedText || contentData.text;
    
    if (isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">Processing Document</p>
            <p className="text-xs text-muted-foreground">Extracting text content...</p>
          </div>
        </div>
      );
    }

    if (processingError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Processing Failed</p>
            <p className="text-xs text-muted-foreground">{processingError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={extractWordText}
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (!displayText) {
      return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">No Text Content</p>
            <p className="text-xs text-muted-foreground">
              {contentData.filename?.match(/\.(docx?|doc)$/i) 
                ? "Click retry to extract text from document"
                : "This document type doesn't contain readable text"
              }
            </p>
            {contentData.filename?.match(/\.(docx?|doc)$/i) && (
              <Button
                variant="outline"
                size="sm"
                onClick={extractWordText}
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Extract Text
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div 
        className={cn(
          "prose prose-sm max-w-none text-foreground p-6",
          `scale-${Math.round(zoomLevel * 100)}`
        )}
        style={{ fontSize: `${14 * (zoomLevel / 100)}px` }}
        onMouseUp={handleTextSelection}
      >
        <div 
          className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: searchQuery ? highlightSearchTerms(displayText, searchQuery) : displayText
          }}
        />
        
        {/* Text Selection Actions */}
        {selectedText && onTextAction && (
          <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTextAction('explain', selectedText)}
            >
              Explain
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTextAction('summarize', selectedText)}
            >
              Summarize
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderImageContent = () => {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="max-w-full max-h-full">
          <img
            src={contentData.url}
            alt={contentData.filename || 'Document image'}
            className={cn(
              "max-w-full max-h-full object-contain rounded-lg shadow-sm",
              `scale-${Math.round(zoomLevel * 100)}`
            )}
            style={{ transform: `scale(${zoomLevel / 100})` }}
          />
        </div>
      </div>
    );
  };

  const renderSpreadsheetContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Spreadsheet Document</p>
          <p className="text-xs text-muted-foreground">
            {contentData.filename}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => contentData.url && window.open(contentData.url, '_blank')}
            disabled={!contentData.url}
          >
            <Download className="h-3 w-3 mr-1" />
            Download to view
          </Button>
        </div>
      </div>
    );
  };

  const renderPresentationContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Presentation Document</p>
          <p className="text-xs text-muted-foreground">
            {contentData.filename}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => contentData.url && window.open(contentData.url, '_blank')}
            disabled={!contentData.url}
          >
            <Eye className="h-3 w-3 mr-1" />
            Open in new tab
          </Button>
        </div>
      </div>
    );
  };

  const renderGenericFileContent = () => {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-foreground">
            {contentData.filename || 'Document'}
          </p>
          <Badge variant="secondary" className="text-xs">
            {contentData.type?.toUpperCase()}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Click download to access this file
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => contentData.url && window.open(contentData.url, '_blank')}
            disabled={!contentData.url}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {renderContent()}
    </div>
  );
}