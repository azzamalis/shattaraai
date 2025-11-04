import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { useWebsiteData } from './useWebsiteData';

interface WebsiteRendererProps {
  htmlContent: string;
  title?: string;
  contentData?: any;
}

export function WebsiteRenderer({ htmlContent, title, contentData }: WebsiteRendererProps) {
  const {
    zoom,
    searchTerm,
    currentSearchIndex,
    rotation,
    setSearchResults,
    setTotalPages,
    setCurrentPage,
    setIsLoading,
    setError,
  } = useUnifiedDocument();

  const contentRef = React.useRef<HTMLDivElement>(null);

  // Use custom hook to extract website data
  const { articleStructure, extractedLinks, websiteInfo } = useWebsiteData(
    htmlContent,
    contentData,
    title
  );

  // Initialize
  React.useEffect(() => {
    setIsLoading(true);
    setTotalPages(1);
    setCurrentPage(1);
    setIsLoading(false);
  }, [setIsLoading, setTotalPages, setCurrentPage]);

  // Handle search
  React.useEffect(() => {
    if (!searchTerm || !htmlContent) {
      setSearchResults([], -1);
      return;
    }

    const regex = new RegExp(searchTerm, 'gi');
    const matches = [...htmlContent.matchAll(regex)];
    
    if (matches.length > 0) {
      const results = matches.map((match, index) => ({
        id: `result-${index}`,
        page: 1,
        text: htmlContent.substring(
          Math.max(0, match.index! - 20),
          Math.min(htmlContent.length, match.index! + searchTerm.length + 20)
        ),
        position: { x: 0, y: match.index || 0 }
      }));
      setSearchResults(results, 0);
    } else {
      setSearchResults([], -1);
    }
  }, [searchTerm, htmlContent]);

  // Scroll to search result
  React.useEffect(() => {
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

  const getHighlightedContent = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const displayContent = getHighlightedContent(htmlContent);

  return (
    <ScrollArea className="h-full">
      <div className="max-w-4xl mx-auto p-8">
        {/* Article Header */}
        <div className="mb-8 pb-6 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {websiteInfo.title || title}
          </h1>
          
          {websiteInfo.description && (
            <p className="text-lg text-muted-foreground mb-4">
              {websiteInfo.description}
            </p>
          )}
        </div>

        {/* Article Content */}
        <div
          ref={contentRef}
          className="prose prose-sm max-w-none dark:prose-invert"
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />
      </div>
    </ScrollArea>
  );
}
