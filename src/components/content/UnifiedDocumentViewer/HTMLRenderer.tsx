import React, { useEffect, useState } from 'react';
import { Loader2, Globe, AlertTriangle, BookOpen, Type, Maximize2, Minimize2 } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HTMLRendererProps {
  htmlContent: string;
  title?: string;
}

export function HTMLRenderer({ htmlContent, title }: HTMLRendererProps) {
  const {
    zoom,
    searchTerm,
    currentSearchIndex,
    rotation,
    setSearchResults,
    setTotalPages,
    setCurrentPage,
    setDocumentData,
    setIsLoading,
    setError,
    error,
    isLoading
  } = useUnifiedDocument();

  const [processedContent, setProcessedContent] = useState<string>('');
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (htmlContent) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Clean and process HTML content
        const cleanedContent = cleanHtmlContent(htmlContent);
        setProcessedContent(cleanedContent);
        setDocumentData(cleanedContent);
        setTotalPages(1);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error processing HTML:', err);
        setError('Failed to process HTML content');
      } finally {
        setIsLoading(false);
      }
    }
  }, [htmlContent, setIsLoading, setError, setDocumentData, setTotalPages, setCurrentPage]);

  const cleanHtmlContent = (html: string): string => {
    // Remove scripts and potentially dangerous elements
    const cleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

    return cleanedHtml;
  };

  // Handle search
  useEffect(() => {
    if (!searchTerm || !processedContent) {
      setSearchResults([], -1);
      return;
    }

    const regex = new RegExp(searchTerm, 'gi');
    const matches = [...processedContent.matchAll(regex)];
    
    if (matches.length > 0) {
      const results = matches.map((match, index) => ({
        id: `result-${index}`,
        page: 1,
        text: processedContent.substring(
          Math.max(0, match.index! - 20),
          Math.min(processedContent.length, match.index! + searchTerm.length + 20)
        ),
        position: { x: 0, y: match.index || 0 }
      }));
      setSearchResults(results, 0);
    } else {
      setSearchResults([], -1);
    }
  }, [searchTerm, processedContent]);

  // Scroll to search result
  useEffect(() => {
    if (!contentRef.current || !searchTerm || currentSearchIndex < 0) return;

    const timeoutId = setTimeout(() => {
      if (!contentRef.current) return;
      
      const marks = contentRef.current.querySelectorAll('mark');
      
      if (marks.length > 0 && marks[currentSearchIndex]) {
        marks.forEach((mark, index) => {
          if (index === currentSearchIndex) {
            mark.className = 'bg-orange-400 dark:bg-orange-600';
          } else {
            mark.className = 'bg-yellow-200 dark:bg-yellow-800';
          }
        });

        marks[currentSearchIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentSearchIndex, searchTerm]);

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
    <div className="h-full overflow-auto">
      <div 
        className="p-8"
        style={{
          minHeight: `${100 * (100 / zoom)}%`,
        }}
      >
        <div
          ref={contentRef}
          className="prose prose-sm max-w-4xl mx-auto dark:prose-invert"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
        />
      </div>
    </div>
  );
}