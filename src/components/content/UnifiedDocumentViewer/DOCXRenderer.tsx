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
    rotation,
    currentSearchIndex,
    searchResults,
    setTotalPages,
    setDocumentData,
    setIsLoading,
    setError,
    setSearchResults,
    error,
    isLoading
  } = useUnifiedDocument();

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const contentRef = React.useRef<HTMLDivElement>(null);

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
        
        // Convert DOCX to HTML using mammoth with table support
        const result = await mammoth.convertToHtml(
          { arrayBuffer } as any,
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
            ],
            includeDefaultStyleMap: true,
            convertImage: mammoth.images.imgElement((image) => {
              return image.read("base64").then((imageBuffer) => {
                return {
                  src: "data:" + image.contentType + ";base64," + imageBuffer,
                };
              });
            }),
          }
        );
        
        if (result.messages.length > 0) {
          console.warn('Document conversion warnings:', result.messages);
        }

        let html = result.value;
        
        // Post-process HTML to convert markdown syntax and improve formatting
        html = processMarkdownInHTML(html);
        
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
  }, [url]); // Remove setter functions from dependencies to prevent infinite loop

  const processMarkdownInHTML = (html: string): string => {
    // Convert markdown headers to HTML headers
    html = html.replace(/<p>(###\s+(.+?))<\/p>/g, '<h3>$2</h3>');
    html = html.replace(/<p>(##\s+(.+?))<\/p>/g, '<h2>$2</h2>');
    html = html.replace(/<p>(#\s+(.+?))<\/p>/g, '<h1>$2</h1>');
    
    // Convert markdown bold **text** to <strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Convert markdown italic *text* to <em>
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Add spacing between paragraphs and sections
    html = html.replace(/<\/p>/g, '</p>\n');
    html = html.replace(/<\/h1>/g, '</h1>\n');
    html = html.replace(/<\/h2>/g, '</h2>\n');
    html = html.replace(/<\/h3>/g, '</h3>\n');
    
    // Handle empty paragraphs (□ symbols) and convert to line breaks
    html = html.replace(/<p>□<\/p>/g, '<div class="my-4"></div>');
    html = html.replace(/<p>\s*<\/p>/g, '<div class="my-2"></div>');
    
    return html;
  };

  const getHighlightedContent = () => {
    if (!searchTerm || !htmlContent) return htmlContent;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return htmlContent.replace(regex, '<mark class="search-highlight bg-yellow-200 dark:bg-yellow-800" data-search-index="$1">$1</mark>');
  };

  // Scroll to current search result
  useEffect(() => {
    if (searchResults.length > 0 && currentSearchIndex >= 0 && contentRef.current) {
      const highlights = contentRef.current.querySelectorAll('.search-highlight');
      const currentHighlight = highlights[currentSearchIndex];
      
      if (currentHighlight) {
        // Remove active class from all highlights
        highlights.forEach(h => h.classList.remove('bg-orange-300', 'dark:bg-orange-600'));
        
        // Add active class to current highlight
        currentHighlight.classList.add('bg-orange-300', 'dark:bg-orange-600');
        
        // Scroll to the highlight
        currentHighlight.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  }, [currentSearchIndex, searchResults]);

  // Update search results when search term changes
  useEffect(() => {
    if (!searchTerm || !textContent) {
      setSearchResults([], 0);
      return;
    }

    const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = [];
    let match;
    
    while ((match = regex.exec(textContent)) !== null) {
      matches.push({
        id: `docx-${match.index}`,
        page: 1, // DOCX is single page
        text: textContent.substring(
          Math.max(0, match.index - 30),
          Math.min(textContent.length, match.index + searchTerm.length + 30)
        ),
        position: { x: 0, y: match.index }
      });
    }

    // Update context with search results
    setSearchResults(matches, matches.length > 0 ? 0 : -1);
  }, [searchTerm, textContent, setSearchResults]);

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
      <div 
        className="max-w-4xl mx-auto py-6"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-in-out',
          minHeight: '100%'
        }}
      >
        <div 
          className="p-8 bg-white dark:bg-neutral-900/50 shadow-sm mx-4 rounded-lg border border-border"
          style={{ 
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-in-out'
          }}
        >
          <div 
            ref={contentRef}
            className="prose prose-base max-w-none dark:prose-invert 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4 prose-headings:mt-8
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-0
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:mb-4 prose-p:leading-relaxed
              prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
              prose-strong:font-semibold prose-strong:text-foreground
              prose-em:italic
              prose-ul:list-disc prose-ul:my-4 prose-ul:pl-6
              prose-ol:list-decimal prose-ol:my-4 prose-ol:pl-6
              prose-li:my-2
              prose-table:border-collapse prose-table:w-full prose-table:my-6 prose-table:border prose-table:border-border
              prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:border prose-td:border-border prose-td:p-3 prose-td:align-top
              prose-tr:border-b prose-tr:border-border
              prose-thead:border-b-2 prose-thead:border-border"
            dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
            style={{
              color: 'hsl(var(--foreground))',
              lineHeight: '1.7',
            }}
          />
        </div>
      </div>
    </div>
  );
}