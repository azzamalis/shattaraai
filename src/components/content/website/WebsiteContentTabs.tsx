import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Newspaper, 
  ChartNoAxesGantt, 
  Info, 
  ExternalLink, 
  Maximize2, 
  Clock, 
  User, 
  Calendar,
  Globe,
  Link,
  Tag
} from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

interface WebsiteContentTabsProps {
  contentData: any;
  onTextExpand?: () => void;
  isProcessing?: boolean;
}

export function WebsiteContentTabs({ contentData, onTextExpand, isProcessing }: WebsiteContentTabsProps) {
  const [activeTab, setActiveTab] = useState('article');

  // Extract article structure from content
  const articleStructure = useMemo(() => {
    // Use metadata.headings if available, otherwise fall back to text parsing
    if (contentData.metadata?.headings && Array.isArray(contentData.metadata.headings)) {
      return contentData.metadata.headings.map((heading, index) => ({
        id: heading.id || `heading-${index}`,
        text: heading.text,
        level: heading.level,
        position: index
      }));
    }
    
    // Fallback to text parsing
    if (!contentData.text_content) return [];
    
    const content = contentData.text_content;
    const lines = content.split('\n').filter(line => line.trim());
    const structure = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect headings (lines that are shorter and likely titles)
      if (line.length > 10 && line.length < 100 && 
          !line.endsWith('.') && !line.endsWith(',') && 
          line.split(' ').length < 12) {
        structure.push({
          id: `heading-${i}`,
          text: line,
          level: line.length < 50 ? 1 : 2,
          position: i
        });
      }
    }
    
    return structure.slice(0, 10); // Limit to first 10 headings
  }, [contentData.text_content, contentData.metadata]);

  // Extract key metadata
  const websiteInfo = useMemo(() => {
    const metadata = contentData.metadata || {};
    return {
      title: metadata.title || contentData.title,
      description: metadata.description,
      author: metadata.author,
      publishedDate: metadata.published || metadata.publishedAt || metadata.date,
      domain: metadata.domain || (contentData.url ? new URL(contentData.url as string).hostname : null),
      readingTime: contentData.text_content ? Math.ceil(contentData.text_content.split(' ').length / 200) : null,
      wordCount: contentData.text_content ? contentData.text_content.split(' ').length : null
    };
  }, [contentData]);

  // Extract links from metadata or content
  const extractedLinks = useMemo(() => {
    // Use metadata.links if available
    if (contentData.metadata?.links && Array.isArray(contentData.metadata.links)) {
      return contentData.metadata.links.map((link, index) => ({
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
    
    // Fallback to text parsing
    if (!contentData.text_content) return [];
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = contentData.text_content.match(urlRegex) || [];
    const uniqueLinks = [...new Set(matches)];
    
    return uniqueLinks.slice(0, 8).map((url, index) => {
      try {
        return {
          id: `link-${index}`,
          url,
          text: url,
          domain: new URL(String(url)).hostname,
          isExternal: !String(url).includes(String(websiteInfo.domain || ''))
        };
      } catch {
        return {
          id: `link-${index}`,
          url,
          text: url,
          domain: String(url),
          isExternal: true
        };
      }
    });
  }, [contentData.text_content, contentData.metadata, websiteInfo.domain]);

  const renderProcessingState = (message: string) => (
    <div className="flex items-center justify-center h-full py-16">
      <TextShimmer className="text-base font-semibold" duration={1.5}>
        {message}
      </TextShimmer>
    </div>
  );

  const renderArticleView = () => {
    if (isProcessing) {
      return renderProcessingState('Extracting article content...');
    }

    if (!contentData.text_content) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Newspaper className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Article content will be available after processing
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Article header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground line-clamp-2">
              {websiteInfo.title}
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onTextExpand}
              className="h-8 w-8 p-0 shrink-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          
          {websiteInfo.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {websiteInfo.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {websiteInfo.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{websiteInfo.readingTime} min read</span>
              </div>
            )}
            {websiteInfo.wordCount && (
              <span>{websiteInfo.wordCount.toLocaleString()} words</span>
            )}
          </div>
        </div>

        {/* Article content - Render as HTML */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div 
            className="reader-content text-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ 
              __html: contentData.text_content 
            }}
            style={{
              // Reader mode styling
              lineHeight: '1.7',
            }}
          />
          
          <div className="pt-6 border-t border-border mt-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onTextExpand}
              className="text-primary hover:text-primary"
            >
              View full article <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderStructureView = () => {
    if (isProcessing) {
      return renderProcessingState('Analyzing content structure...');
    }

    if (articleStructure.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <ChartNoAxesGantt className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            No clear structure detected in content
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <ChartNoAxesGantt className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Content Outline</h3>
        </div>
        
        <div className="space-y-2">
          {articleStructure.map((heading, index) => (
            <div 
              key={heading.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="text-xs text-muted-foreground font-mono mt-1 w-6">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className={cn(
                  "text-sm text-foreground group-hover:text-primary transition-colors",
                  heading.level === 1 ? "font-medium" : "font-normal"
                )}>
                  {heading.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWebsiteInfo = () => {
    if (isProcessing) {
      return renderProcessingState('Gathering website information...');
    }

    return (
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Website Title */}
            <h1 className="text-xl font-bold text-foreground line-clamp-2">
              {websiteInfo.title || 'Website Content'}
            </h1>
            
            {/* Favicon + Domain */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <img 
                  src={`https://www.google.com/s2/favicons?domain=${websiteInfo.domain}&sz=16`}
                  alt="Favicon"
                  className="h-4 w-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{websiteInfo.domain}</span>
              </div>
            </div>

            {/* Author/Publisher */}
            {websiteInfo.author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">by</span>
                <span className="text-sm font-medium text-foreground">{String(websiteInfo.author)}</span>
              </div>
            )}

            {/* Published Date */}
            {websiteInfo.publishedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Published {new Date(String(websiteInfo.publishedDate)).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Preview Image */}
        {contentData.metadata?.ogImage && (
          <div className="rounded-lg overflow-hidden border border-border">
            <img 
              src={String(contentData.metadata.ogImage)}
              alt="Preview"
              className="w-full h-32 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement?.remove();
              }}
            />
          </div>
        )}

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          {websiteInfo.wordCount && (
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-foreground">
                {websiteInfo.wordCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
          )}
          
          {websiteInfo.readingTime && (
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-foreground">
                {websiteInfo.readingTime}
              </div>
              <div className="text-xs text-muted-foreground">Min Read</div>
            </div>
          )}

          {contentData.metadata?.contentLength && (
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-foreground">
                {Math.round(Number(contentData.metadata.contentLength) / 1024)}KB
              </div>
              <div className="text-xs text-muted-foreground">Content Size</div>
            </div>
          )}

          {contentData.metadata?.extractedAt && (
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-foreground">
                {new Date(String(contentData.metadata.extractedAt)).toLocaleDateString()}
              </div>
              <div className="text-xs text-muted-foreground">Extracted</div>
            </div>
          )}
        </div>

        {/* Metadata Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">Metadata</h3>
          </div>

          <div className="space-y-3">
            {/* Canonical URL */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Canonical URL
              </span>
              <a 
                href={contentData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {String(contentData.url)}
              </a>
            </div>

            {/* Domain */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Domain
              </span>
              <span className="text-sm text-foreground">{websiteInfo.domain}</span>
            </div>

            {/* Keywords/Tags */}
            {contentData.metadata?.keywords && Array.isArray(contentData.metadata.keywords) && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1">
                  {contentData.metadata.keywords.slice(0, 8).map((keyword: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                    >
                      {String(keyword)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {contentData.metadata?.description && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Description
                </span>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {String(contentData.metadata.description)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRelatedLinks = () => {
    if (isProcessing) {
      return renderProcessingState('Extracting related links...');
    }

    if (extractedLinks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Link className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            No related links found in content
          </p>
        </div>
      );
    }

    const internalLinks = extractedLinks.filter(link => !link.isExternal);
    const externalLinks = extractedLinks.filter(link => link.isExternal);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Link className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-foreground">Related Links</h3>
          <span className="text-xs text-muted-foreground">({extractedLinks.length})</span>
        </div>

        {internalLinks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">Internal Links</h4>
              <span className="text-xs text-muted-foreground">({internalLinks.length})</span>
            </div>
            <div className="space-y-2">
              {internalLinks.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {String(link.text || link.domain)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {String(link.url)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => window.open(String(link.url), '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {externalLinks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium text-foreground">External Links</h4>
              <span className="text-xs text-muted-foreground">({externalLinks.length})</span>
            </div>
            <div className="space-y-2">
              {externalLinks.map((link) => (
                <div 
                  key={link.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {String(link.text || link.domain)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {String(link.url)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={() => window.open(String(link.url), '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-background">
      <TabsList className={cn(
        "w-fit justify-start gap-1 p-1 h-12 shrink-0 mx-4 my-2",
        "bg-card dark:bg-card",
        "transition-colors duration-200",
        "rounded-xl"
      )}>
        <TabsTrigger 
          value="article" 
          className={cn(
            "flex-1 h-full rounded-md flex items-center justify-center gap-2",
            "text-sm font-medium",
            "text-muted-foreground",
            "hover:text-foreground",
            "data-[state=active]:text-primary",
            "data-[state=active]:bg-primary/10",
            "data-[state=active]:hover:bg-primary/20",
            "transition-colors duration-200",
            "px-4"
          )}
        >
          <Newspaper className="h-[14px] w-[14px]" />
          <span>Article</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="structure" 
          className={cn(
            "flex-1 h-full rounded-md flex items-center justify-center gap-2",
            "text-sm font-medium",
            "text-muted-foreground",
            "hover:text-foreground",
            "data-[state=active]:text-primary",
            "data-[state=active]:bg-primary/10",
            "data-[state=active]:hover:bg-primary/20",
            "transition-colors duration-200",
            "px-4"
          )}
        >
          <ChartNoAxesGantt className="h-[14px] w-[14px]" />
          <span>Structure</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="info" 
          className={cn(
            "flex-1 h-full rounded-md flex items-center justify-center gap-2",
            "text-sm font-medium",
            "text-muted-foreground",
            "hover:text-foreground",
            "data-[state=active]:text-primary",
            "data-[state=active]:bg-primary/10",
            "data-[state=active]:hover:bg-primary/20",
            "transition-colors duration-200",
            "px-4"
          )}
        >
          <Info className="h-[14px] w-[14px]" />
          <span>Info</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="links" 
          className={cn(
            "flex-1 h-full rounded-md flex items-center justify-center gap-2",
            "text-sm font-medium",
            "text-muted-foreground",
            "hover:text-foreground",
            "data-[state=active]:text-primary",
            "data-[state=active]:bg-primary/10",
            "data-[state=active]:hover:bg-primary/20",
            "transition-colors duration-200",
            "px-4"
          )}
        >
          <Link className="h-[14px] w-[14px]" />
          <span>Links</span>
        </TabsTrigger>
      </TabsList>

      <div className="flex-1 relative overflow-hidden">
        <TabsContent value="article" className="absolute inset-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {renderArticleView()}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="structure" className="absolute inset-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {renderStructureView()}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="info" className="absolute inset-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {renderWebsiteInfo()}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="links" className="absolute inset-0 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {renderRelatedLinks()}
            </div>
          </ScrollArea>
        </TabsContent>
      </div>
    </Tabs>
  );
}