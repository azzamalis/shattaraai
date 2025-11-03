import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, FileText } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import mammoth from 'mammoth';

interface DOCXRendererProps {
  url: string;
}

export function DOCXRenderer({ url }: DOCXRendererProps) {
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

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');

  useEffect(() => {
    const processDocument = async () => {
      if (!url) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // Convert DOCX to HTML using mammoth
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        if (result.messages.length > 0) {
          console.warn('Document conversion warnings:', result.messages);
        }

        const html = result.value;
        setHtmlContent(html);

        // Extract text content for search functionality
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        setTextContent(text);
        setDocumentData(html);

        // Set total pages to 1 for DOCX (continuous scroll)
        setTotalPages(1);
        
      } catch (err) {
        console.error('Error processing DOCX:', err);
        setError(err instanceof Error ? err.message : 'Failed to process document');
      } finally {
        setIsLoading(false);
      }
    };

    processDocument();
  }, [url, setIsLoading, setError, setDocumentData, setTotalPages]);

  const getHighlightedContent = () => {
    if (!searchTerm || !htmlContent) return htmlContent;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return htmlContent.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Processing document...</p>
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
            <p className="text-sm font-medium text-foreground">Failed to load document</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No document content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-white dark:bg-neutral-800/50">
      <div className="max-w-4xl mx-auto py-6">
        <div 
          className="p-8 bg-white dark:bg-neutral-900/50 shadow-sm mx-4 rounded-lg border border-border"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
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
  );
}