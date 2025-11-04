import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { 
  ChartNoAxesGantt, 
  Info, 
  ExternalLink, 
  Clock, 
  User, 
  Calendar,
  Globe,
  Link,
  ChevronRight
} from 'lucide-react';

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

  const [showMetadata, setShowMetadata] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Extract article structure from content
  const articleStructure = useMemo(() => {
    if (contentData?.metadata?.headings && Array.isArray(contentData.metadata.headings)) {
      return contentData.metadata.headings.map((heading: any, index: number) => ({
        id: heading.id || `heading-${index}`,
        text: heading.text,
        level: heading.level,
        position: index
      }));
    }
    return [];
  }, [contentData?.metadata]);

  // Extract key metadata
  const websiteInfo = useMemo(() => {
    const metadata = contentData?.metadata || {};
    return {
      title: metadata.title || title,
      description: metadata.description,
      author: metadata.author,
      publishedDate: metadata.published || metadata.publishedAt || metadata.date,
      domain: metadata.domain || (contentData?.url ? new URL(contentData.url as string).hostname : null),
      readingTime: htmlContent ? Math.ceil(htmlContent.split(' ').length / 200) : null,
      wordCount: htmlContent ? htmlContent.split(' ').length : null
    };
  }, [contentData, title, htmlContent]);

  // Extract links
  const extractedLinks = useMemo(() => {
    if (contentData?.metadata?.links && Array.isArray(contentData.metadata.links)) {
      return contentData.metadata.links.slice(0, 8).map((link: any, index: number) => ({
        id: `link-${index}`,
        url: link.href,
        text: link.text,
        domain: (() => {
          try {
            return new URL(String(link.href)).hostname;
          } catch {
            return String(link.href);
          }
        })(),
        isExternal: !link.internal
      }));
    }
    return [];
  }, [contentData?.metadata]);

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

  return {
    htmlContent: displayContent,
    articleStructure,
    extractedLinks,
    websiteInfo,
    contentRef,
    zoom,
    rotation,
  };
}

// Separate display component
interface WebsiteContentDisplayProps {
  htmlContent: string;
  articleStructure: any[];
  extractedLinks: any[];
  websiteInfo: any;
  contentRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  rotation: number;
  title?: string;
}

export function WebsiteContentDisplay({
  htmlContent,
  websiteInfo,
  contentRef,
  zoom,
  rotation,
  title,
}: WebsiteContentDisplayProps) {
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
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </ScrollArea>
  );
}

// Re-export for compatibility
export { WebsiteRenderer as default };
