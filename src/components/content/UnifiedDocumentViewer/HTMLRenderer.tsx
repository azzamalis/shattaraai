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
    setTotalPages,
    setDocumentData,
    setIsLoading,
    setError,
    error,
    isLoading
  } = useUnifiedDocument();

  const [processedContent, setProcessedContent] = useState<string>('');
  const [isReaderMode, setIsReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

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
    <div className="h-full w-full overflow-auto bg-white dark:bg-neutral-800/50">
      {/* Enhanced toolbar */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border-b border-border p-2">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReaderMode(!isReaderMode)}
              className={cn(
                "h-8 px-3",
                isReaderMode && "bg-primary/10 text-primary"
              )}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Reader Mode
            </Button>
            
            <div className="h-4 w-px bg-border" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              disabled={fontSize <= 12}
              className="h-8 w-8 p-0"
            >
              <Type className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-[2rem] text-center">
              {fontSize}px
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              disabled={fontSize >= 24}
              className="h-8 w-8 p-0"
            >
              <Type className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{zoom}%</span>
          </div>
        </div>
      </div>

      <div className={cn(
        "mx-auto transition-all duration-300 py-6",
        isReaderMode ? "max-w-2xl" : "max-w-4xl"
      )}>
        <div 
          className={cn(
            "bg-white dark:bg-neutral-900/50 border border-border rounded-lg mx-4 shadow-sm transition-all duration-300",
            isReaderMode && "shadow-lg"
          )}
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          {title && (
            <div className={cn(
              "p-4 border-b border-border bg-muted/30 transition-all duration-300",
              isReaderMode && "p-6"
            )}>
              <h1 className={cn(
                "font-semibold text-foreground flex items-center gap-2 transition-all duration-300",
                isReaderMode ? "text-xl" : "text-lg"
              )}>
                <Globe className="h-5 w-5" />
                {title}
              </h1>
            </div>
          )}
          
          <div className={cn(
            "transition-all duration-300",
            isReaderMode ? "p-8" : "p-6"
          )}>
            <div 
              className={cn(
                "prose max-w-none dark:prose-invert transition-all duration-300",
                isReaderMode ? "prose-lg" : "prose-sm"
              )}
              dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
              style={{
                color: 'hsl(var(--foreground))',
                lineHeight: isReaderMode ? '1.7' : '1.6',
                fontSize: `${fontSize}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}