import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useUnifiedDocument } from './UnifiedDocumentContext';
interface TextRendererProps {
  content: string;
  title?: string;
  isMarkdown?: boolean;
}
export function TextRenderer({
  content,
  title,
  isMarkdown = false
}: TextRendererProps) {
  const {
    zoom,
    rotation,
    searchTerm,
    currentSearchIndex,
    setTotalPages,
    setDocumentData,
    setSearchResults
  } = useUnifiedDocument();
  const [displayContent, setDisplayContent] = useState<string>('');
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content) {
      setDisplayContent(content);
      setDocumentData(content);
      setTotalPages(1); // Text content is continuous scroll
    }
  }, [content, setDocumentData, setTotalPages]);

  // Handle search and create search results
  useEffect(() => {
    if (!displayContent) return;

    if (searchTerm.trim()) {
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = displayContent.match(regex);
      
      if (matches && matches.length > 0) {
        const results = matches.map((match, index) => ({
          id: `text-${index}`,
          page: 1,
          text: match,
          position: { x: 0, y: 0 }
        }));
        setSearchResults(results, 0);
      } else {
        setSearchResults([], -1);
      }
    } else {
      setSearchResults([], -1);
    }
  }, [searchTerm, displayContent]); // Removed setSearchResults from dependencies to prevent infinite loop

  // Scroll to current search result
  useEffect(() => {
    if (!contentRef.current || !searchTerm || currentSearchIndex < 0) return;

    // Use setTimeout to ensure DOM is updated after render
    const timeoutId = setTimeout(() => {
      if (!contentRef.current) return;
      
      const marks = contentRef.current.querySelectorAll('mark');
      
      if (marks.length > 0 && marks[currentSearchIndex]) {
        // Highlight current result differently
        marks.forEach((mark, index) => {
          if (index === currentSearchIndex) {
            mark.className = 'bg-orange-400 dark:bg-orange-600';
          } else {
            mark.className = 'bg-yellow-200 dark:bg-yellow-800';
          }
        });

        // Scroll to the highlighted mark
        marks[currentSearchIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100); // Small delay to ensure DOM is rendered

    return () => clearTimeout(timeoutId);
  }, [currentSearchIndex, searchTerm]);

  const getHighlightedContent = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };
  if (!displayContent) {
    return <div className="flex items-center justify-center h-full bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No text content available</p>
        </div>
      </div>;
  }
  return <div className="h-full w-full overflow-auto bg-white dark:bg-neutral-800/50" ref={contentRef}>
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-white dark:bg-neutral-900/50 mx-4 p-8 rounded-lg border border-border shadow-sm" style={{
        transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
        transformOrigin: 'top center',
        transition: 'transform 0.2s ease-in-out'
      }}>
          <div>
            {isMarkdown ? <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none dark:prose-invert" components={{
            // Custom components to handle highlighting
            p: ({
              children
            }) => <p className="text-foreground leading-relaxed mb-4" dangerouslySetInnerHTML={{
              __html: getHighlightedContent(String(children))
            }} />,
            h1: ({
              children
            }) => <h1 className="text-2xl font-bold text-foreground mb-4">
                      {children}
                    </h1>,
            h2: ({
              children
            }) => <h2 className="text-xl font-semibold text-foreground mb-3">
                      {children}
                    </h2>,
            h3: ({
              children
            }) => <h3 className="text-lg font-semibold text-foreground mb-2">
                      {children}
                    </h3>,
            code: ({
              children,
              className
            }) => {
              const isInline = !className;
              return isInline ? <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code> : <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto">
                        {children}
                      </code>;
            },
            blockquote: ({
              children
            }) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      {children}
                    </blockquote>
          }}>
                {displayContent}
              </ReactMarkdown> : <div className="space-y-4">
                {displayContent.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, index) => <div key={index} className="text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{
              __html: getHighlightedContent(paragraph.trim())
            }} />)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}