import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { sanitizeHtml } from '@/lib/sanitize';
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
    // Sanitize HTML content first to prevent XSS attacks
    const sanitized = sanitizeHtml(text);
    if (!searchTerm) return sanitized;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return sanitized.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  const displayContent = getHighlightedContent(htmlContent);

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {websiteInfo.domain && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{websiteInfo.domain}</span>
                  </div>
                )}
                {websiteInfo.readingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{websiteInfo.readingTime} min read</span>
                  </div>
                )}
                {websiteInfo.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{String(websiteInfo.author)}</span>
                  </div>
                )}
              </div>
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

            {/* Toggle Metadata Button */}
            <div className="mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowMetadata(!showMetadata)}
                className="w-full"
              >
                <Info className="h-4 w-4 mr-2" />
                {showMetadata ? 'Hide' : 'Show'} Website Info
                <ChevronRight className={cn(
                  "h-4 w-4 ml-2 transition-transform",
                  showMetadata && "rotate-90"
                )} />
              </Button>

              {/* Metadata Section */}
              {showMetadata && (
                <div className="mt-6 space-y-6">
                  {/* Structure */}
                  {articleStructure.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ChartNoAxesGantt className="h-4 w-4 text-primary" />
                        <h3 className="font-medium text-foreground">Content Outline</h3>
                      </div>
                      <div className="space-y-2">
                        {articleStructure.map((heading: any, index: number) => (
                          <div 
                            key={heading.id}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="text-xs text-muted-foreground font-mono mt-1 w-6">
                              {index + 1}
                            </div>
                            <p className={cn(
                              "text-sm text-foreground",
                              heading.level === 1 ? "font-medium" : "font-normal"
                            )}>
                              {heading.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {extractedLinks.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4 text-primary" />
                        <h3 className="font-medium text-foreground">Related Links</h3>
                      </div>
                      <div className="space-y-2">
                        {extractedLinks.map((link: any) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors group"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {link.text || link.domain}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {link.domain}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
