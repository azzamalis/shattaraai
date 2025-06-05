
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Search,
  Sidebar,
  Loader2,
  AlertTriangle,
  MessageSquare,
  Globe,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Configure PDF.js worker to use the local file
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface PDFViewerProps {
  url?: string;
  filePath?: string;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function PDFViewer({ url, filePath, onTextAction }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [textActionPosition, setTextActionPosition] = useState<{ x: number; y: number } | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [searchPopoverOpen, setSearchPopoverOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pdfUrl = url || filePath;

  useEffect(() => {
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      setLoading(true);
      setError(null);
      fetch(pdfUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          setPdfBlob(blob);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching PDF blob:', error);
          setError('Failed to load PDF content.');
          setLoading(false);
        });
    } else {
      setPdfBlob(null);
      setLoading(!!pdfUrl);
    }

    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

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
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    setError('Failed to load PDF. Please check the file and try again.');
    setLoading(false);
    console.error('PDF load error:', error);
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
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'document.pdf';
      link.click();
    }
  }, [pdfUrl]);

  // Enhanced search functionality
  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || !pdfBlob) return;
    
    setIsSearching(true);
    try {
      // Simulate search functionality - in a real implementation, you'd use PDF.js search API
      // This is a placeholder that shows the concept
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
  }, [searchTerm, pdfBlob, numPages]);

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

  // Enhanced text selection handling
  const handleTextSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const text = selection.toString().trim();
      if (text.length > 2) {
        setSelectedText(text);
        // Position the popover relative to the container
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

  // Enhanced event listeners for text selection
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

  if (!pdfUrl) {
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

  const fileSource = pdfBlob || pdfUrl;

  return (
    <div className="relative h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
      {/* Enhanced Responsive Toolbar */}
      <div className="flex items-center justify-between p-2 md:p-3 border-b border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
        {/* Left side controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <Sidebar className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-4 md:h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-xs md:text-sm text-dashboard-text dark:text-dashboard-text px-1 md:px-2 min-w-[60px] md:min-w-[80px] text-center">
            {loading ? '...' : `${pageNumber} / ${numPages}`}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-xs md:text-sm text-dashboard-text dark:text-dashboard-text px-1 md:px-2 min-w-[40px] md:min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-4 md:h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            disabled={loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {/* Enhanced Search Popover */}
          <Popover open={searchPopoverOpen} onOpenChange={setSearchPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading || error !== null}
                className={cn(
                  "text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9",
                  searchResults.length > 0 && "bg-dashboard-separator/20 dark:bg-white/10"
                )}
              >
                <Search className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-dashboard-card dark:bg-dashboard-card border-dashboard-separator dark:border-dashboard-separator" side="bottom" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-dashboard-text dark:text-dashboard-text">Search PDF</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter search term..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text"
                  />
                  <Button
                    size="sm"
                    onClick={handleSearch}
                    disabled={!searchTerm.trim() || isSearching}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                  {searchResults.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearSearch}
                      className="border-dashboard-separator dark:border-dashboard-separator"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                        {searchResults.length} results found
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigateToSearchResult(currentSearchIndex - 1)}
                          disabled={currentSearchIndex <= 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <span className="text-xs px-2 py-1">
                          {currentSearchIndex + 1} / {searchResults.length}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigateToSearchResult(currentSearchIndex + 1)}
                          disabled={currentSearchIndex >= searchResults.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            onClick={() => navigateToSearchResult(index)}
                            className={cn(
                              "p-2 rounded cursor-pointer text-sm transition-colors",
                              index === currentSearchIndex
                                ? "bg-dashboard-separator/20 dark:bg-white/10"
                                : "hover:bg-dashboard-separator/10 dark:hover:bg-white/5"
                            )}
                          >
                            <div className="font-medium text-dashboard-text dark:text-dashboard-text">
                              Page {result.pageNumber}
                            </div>
                            <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary truncate">
                              {result.context}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-32 md:w-48 border-r border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
            {loading ? (
               <div className="flex items-center justify-center h-full">
                 <Loader2 className="h-6 w-6 animate-spin text-dashboard-text-secondary" />
               </div>
            ) : error ? (
               <div className="flex items-center justify-center h-full text-dashboard-text-secondary/60 text-sm p-2 text-center">
                 Error loading thumbnails.
               </div>
            ) : (
              <ScrollArea className="h-full p-1 md:p-2">
                <div className="space-y-1 md:space-y-2">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                    <div
                      key={page}
                      onClick={() => setPageNumber(page)}
                      className={cn(
                        "p-1 md:p-2 rounded cursor-pointer text-xs md:text-sm transition-colors",
                        page === pageNumber
                          ? "bg-dashboard-separator/20 dark:bg-white/10 text-dashboard-text dark:text-dashboard-text"
                          : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-separator/10 dark:hover:bg-white/5"
                      )}
                    >
                      <span className="hidden md:inline">Page </span>{page}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Enhanced Main content with proper scrolling */}
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
                  </div>
                </div>
              )}

              {!loading && !error && fileSource && (
                <div className="flex justify-center w-full py-4 px-4">
                  <Document
                    file={fileSource}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    error={null}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-lg border border-dashboard-separator/20 dark:border-white/10"
                      width={containerWidth ? Math.min(containerWidth - 64, 800) : undefined}
                    />
                  </Document>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Enhanced Text Action Popover */}
      {selectedText && textActionPosition && (
        <div
          className="fixed z-50 bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator rounded-lg shadow-lg p-2"
          style={{
            left: Math.max(10, Math.min(textActionPosition.x, window.innerWidth - 250)),
            top: Math.max(10, textActionPosition.y),
          }}
        >
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('explain')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Explain
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('search')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('summarize')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              Summarize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
