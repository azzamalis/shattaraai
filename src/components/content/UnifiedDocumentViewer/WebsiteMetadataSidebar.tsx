import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChartNoAxesGantt, 
  ExternalLink, 
  Link,
  Globe,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebsiteMetadataSidebarProps {
  articleStructure: Array<{ id: string; text: string; level: number; position: number }>;
  extractedLinks: Array<{ id: string; url: string; text: string; domain: string; isExternal: boolean }>;
  websiteInfo: {
    title?: string;
    description?: string;
    author?: string;
    publishedDate?: string;
    domain?: string;
    readingTime?: number;
    wordCount?: number;
  };
}

export function WebsiteMetadataSidebar({ 
  articleStructure, 
  extractedLinks, 
  websiteInfo 
}: WebsiteMetadataSidebarProps) {
  return (
    <div className="w-64 border-l border-primary/10 bg-white dark:bg-neutral-800/50 flex flex-col">
      <div className="p-3 border-b border-primary/10">
        <h3 className="font-medium text-sm text-foreground">Website Info</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-6">
          {/* Website Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm text-foreground">Details</h4>
            </div>
            
            <div className="space-y-2 text-xs">
              {websiteInfo.domain && (
                <div className="flex items-start gap-2">
                  <Globe className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-muted-foreground break-all">{websiteInfo.domain}</span>
                </div>
              )}
              {websiteInfo.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{websiteInfo.readingTime} min read</span>
                </div>
              )}
              {websiteInfo.author && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{String(websiteInfo.author)}</span>
                </div>
              )}
              {websiteInfo.wordCount && (
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">{websiteInfo.wordCount.toLocaleString()} words</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Outline */}
          {articleStructure.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ChartNoAxesGantt className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm text-foreground">Outline</h4>
              </div>
              
              <div className="space-y-1">
                {articleStructure.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => {
                      const element = document.getElementById(heading.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <p className={cn(
                      "text-xs",
                      heading.level === 1 ? "font-medium text-foreground" : "text-muted-foreground",
                      heading.level > 1 && "pl-3"
                    )}>
                      {heading.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Links */}
          {extractedLinks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm text-foreground">Links</h4>
              </div>
              
              <div className="space-y-2">
                {extractedLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 p-2 border border-border rounded-md hover:bg-muted/30 transition-colors group"
                  >
                    <ExternalLink className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate group-hover:text-primary">
                        {link.text || link.domain}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {link.domain}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
