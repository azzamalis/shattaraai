import React, { useEffect, useState } from 'react';
import { Loader2, Globe, AlertTriangle } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';

interface HTMLRendererProps {
  htmlContent: string;
  title?: string;
}

export function HTMLRenderer({ htmlContent, title }: HTMLRendererProps) {
  const {
    zoom,
    searchTerm,
    setTotalPages,
    setDocumentData,
    setIsLoading,
    setError,
    error,
    isLoading
  } = useUnifiedDocument();

  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    if (htmlContent) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Clean and process HTML content
        const cleanedContent = cleanHtmlContent(htmlContent);
        setProcessedContent(cleanedContent);
        setDocumentData(cleanedContent);
        setTotalPages(1); // HTML is continuous scroll
      } catch (err) {
        console.error('Error processing HTML:', err);
        setError('Failed to process HTML content');
      } finally {
        setIsLoading(false);
      }
    }
  }, [htmlContent, setIsLoading, setError, setDocumentData, setTotalPages]);

  const cleanHtmlContent = (html: string): string => {
    // Remove scripts and potentially dangerous elements
    const cleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

    return cleanedHtml;
  };

  const getHighlightedContent = () => {
    if (!searchTerm || !processedContent) return processedContent;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return processedContent.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Processing webpage content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div>
            <p className="text-sm font-medium text-foreground">Failed to load content</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!processedContent) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <Globe className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No webpage content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-background">
      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-card border border-border rounded-lg mx-4 my-6 shadow-sm"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          {title && (
            <div className="p-4 border-b border-border bg-muted/30">
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {title}
              </h1>
            </div>
          )}
          
          <div className="p-6">
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
              style={{
                color: 'hsl(var(--foreground))',
                lineHeight: '1.6',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}