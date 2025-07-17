import React, { useState } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight,
  Search,
  Bookmark,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentNavigationProps {
  contentData: ContentData;
  searchResults?: number;
  onNavigate: (section: string) => void;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  page?: number;
}

export function DocumentNavigation({ 
  contentData, 
  searchResults = 0, 
  onNavigate 
}: DocumentNavigationProps) {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks' | 'search'>('toc');
  const [isExpanded, setIsExpanded] = useState(true);

  // Generate table of contents from document text
  const generateTOC = (): TableOfContentsItem[] => {
    if (!contentData.text) return [];

    const lines = contentData.text.split('\n');
    const toc: TableOfContentsItem[] = [];
    let itemId = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Detect headings based on common patterns
      let level = 0;
      let title = trimmed;

      // Check for markdown-style headers
      const mdMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (mdMatch) {
        level = mdMatch[1].length;
        title = mdMatch[2];
      }
      // Check for numbered sections
      else if (/^\d+\./.test(trimmed)) {
        level = 1;
        title = trimmed;
      }
      // Check for capitalized lines (potential headers)
      else if (title.length < 100 && title === title.toUpperCase() && title.length > 3) {
        level = 2;
      }
      // Check for lines that end with colon
      else if (title.endsWith(':') && title.length < 80) {
        level = 3;
      }

      if (level > 0) {
        toc.push({
          id: `section-${itemId++}`,
          title: title.substring(0, 60) + (title.length > 60 ? '...' : ''),
          level: Math.min(level, 4)
        });
      }
    });

    return toc.slice(0, 20); // Limit to 20 items
  };

  const tocItems = generateTOC();

  // Show navigation only if we have content
  if (!contentData.text && !contentData.url) {
    return null;
  }

  return (
    <div className={cn(
      "bg-muted/30 border-r transition-all duration-300",
      isExpanded ? "w-64" : "w-12"
    )}>
      {/* Navigation Toggle */}
      <div className="p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-start h-8"
        >
          <BookOpen className="h-4 w-4" />
          {isExpanded && <span className="ml-2 text-xs">Navigation</span>}
        </Button>
      </div>

      {isExpanded && (
        <>
          {/* Navigation Tabs */}
          <div className="flex border-b bg-muted/20">
            {[
              { id: 'toc', label: 'Contents', icon: Hash },
              { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
              { id: 'search', label: 'Search', icon: Search }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1 h-8 text-xs"
              >
                <tab.icon className="h-3 w-3" />
              </Button>
            ))}
          </div>

          {/* Navigation Content */}
          <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
            {activeTab === 'toc' && (
              <div className="p-2 space-y-1">
                {tocItems.length > 0 ? (
                  tocItems.map(item => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "w-full justify-start text-left h-auto py-2 px-3",
                        `ml-${(item.level - 1) * 3}`
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-foreground truncate">
                          {item.title}
                        </p>
                      </div>
                    </Button>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      No sections found
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="p-2">
                <div className="text-center py-8">
                  <Bookmark className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No bookmarks yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add bookmarks while reading
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="p-2">
                <div className="text-center py-8">
                  <Search className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {searchResults > 0 
                      ? `${searchResults} search results`
                      : 'Use the search bar above'
                    }
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
}