import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Loader2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { PDFToolbar } from './pdf/PDFToolbar';
import { PDFSidebar } from './pdf/PDFSidebar';
import { PDFTextActionPopover } from './pdf/PDFTextActionPopover';
import { PDFViewerProps, SearchResult, TextActionPosition } from './pdf/types';

// Configure PDF.js worker with better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Fallback worker configuration
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;
}

export function PDFViewer({ url, onTextAction }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [textActionPosition, setTextActionPosition] = useState<TextActionPosition | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [searchPopoverOpen, setSearchPopoverOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url) {
      console.log('PDFViewer: URL changed to:', url);
      setLoading(true);
      setError(null);
      setPageNumber(1);
      setNumPages(0);
    }
  }, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDFViewer: Document loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDFViewer: Document load error:', error);
    setError(`Failed to load PDF: ${error.message}`);
    setLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(prev => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  }, [numPages]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(3.0, prev + 0.25));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      link.click();
    }
  }, [url]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || !url) return;
    
    setIsSearching(true);
    try {
      // Simulate search functionality - in a real implementation, you'd use PDF.js search API
      const results = [];
      for (let i = 1; i <= numPages; i++) {
        // Simulated search results
        if (Math.random() > 0.7) { // Random chance for demonstration
          results.push({
            pageNumber: i,
            text: searchTerm,
            context: `...text containing ${searchTerm}...`
          });
        }
      }
      setSearchResults(results);
      setCurrentSearchIndex(0);
      
      // Navigate to first result if found
      if (results.length > 0) {
        setPageNumber(results[0].pageNumber);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, url, numPages]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setSearchPopoverOpen(false);
  }, []);

  const navigateToSearchResult = useCallback((index: number) => {
    if (index >= 0 && index < searchResults.length) {
      setCurrentSearchIndex(index);
      setPageNumber(searchResults[index].pageNumber);
    }
  }, [searchResults]);

  const handleTextSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const text = selection.toString().trim();
      if (text.length > 2) {
        setSelectedText(text);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTextActionPosition({ 
            x: event.clientX - rect.left, 
            y: event.clientY - rect.top - 60 
          });
        }
      }
    } else {
      setSelectedText('');
      setTextActionPosition(null);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleMouseUp = (e: MouseEvent) => handleTextSelection(e);
      const handleClickOutside = (e: MouseEvent) => {
        if (!container.contains(e.target as Node)) {
          setSelectedText('');
          setTextActionPosition(null);
        }
      };

      container.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('click', handleClickOutside);
      
      return () => {
        container.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [handleTextSelection]);

  const handleTextAction = useCallback((action: 'explain' | 'search' | 'summarize') => {
    if (selectedText && onTextAction) {
      onTextAction(action, selectedText);
    }
    setSelectedText('');
    setTextActionPosition(null);
  }, [selectedText, onTextAction]);

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator">
        <div className="flex flex-col items-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
          <FileText className="h-12 w-12 mb-4" />
          <p className="text-lg font-medium">No PDF loaded</p>
          <p className="text-sm text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
            Please upload a PDF file to view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
      <PDFToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        loading={loading}
        error={error}
        showSidebar={showSidebar}
        searchTerm={searchTerm}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        isSearching={isSearching}
        searchPopoverOpen={searchPopoverOpen}
        pdfUrl={url}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onDownload={handleDownload}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onSearch={handleSearch}
        onSearchTermChange={setSearchTerm}
        onClearSearch={clearSearch}
        onNavigateToSearchResult={navigateToSearchResult}
        onSearchPopoverOpenChange={setSearchPopoverOpen}
      />

      <div className="flex flex-grow overflow-hidden">
        {showSidebar && (
          <PDFSidebar
            numPages={numPages}
            pageNumber={pageNumber}
            loading={loading}
            error={error}
            onPageChange={setPageNumber}
          />
        )}

        <div className="flex-1 overflow-hidden" ref={containerRef}>
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="min-h-full bg-dashboard-bg dark:bg-dashboard-bg">
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading PDF...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                    <p className="text-lg font-medium">Error loading PDF</p>
                    <p className="text-sm text-center max-w-md">{error}</p>
                    <p className="text-xs text-center max-w-md text-dashboard-text-secondary/60 dark:text-dashboard-text-secondary/60">
                      URL: {url}
                    </p>
                  </div>
                </div>
              )}

              {!loading && !error && url && (
                <div className="flex justify-center w-full py-4 px-4">
                  <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    error={null}
                    options={{
                      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                      cMapPacked: true,
                      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
                      verbosity: 0,
                      disableAutoFetch: false,
                      disableStream: false,
                    }}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-lg border border-dashboard-separator/20 dark:border-white/10"
                      width={containerWidth ? Math.min(containerWidth - 64, 800) : undefined}
                      onLoadSuccess={() => console.log('PDFViewer: Page rendered successfully')}
                      onLoadError={(error) => console.error('PDFViewer: Page render error:', error)}
                    />
                  </Document>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <PDFTextActionPopover
        selectedText={selectedText}
        textActionPosition={textActionPosition}
        onTextAction={handleTextAction}
      />
    </div>
  );
}
