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
  Maximize,
  Search,
  Sidebar,
  Loader2,
  AlertTriangle,
  MessageSquare,
  Globe,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Configure PDF.js worker to use the local file
// Ensure pdf.worker.min.mjs is in your public directory
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
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [textActionPosition, setTextActionPosition] = useState<{ x: number; y: number } | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showSidebar]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
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

  const handleTextSelection = useCallback((event: MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const text = selection.toString().trim();
      if (text.length > 2) {
        setSelectedText(text);
        setTextActionPosition({ x: event.clientX, y: event.clientY });
      }
    } else {
      setSelectedText('');
      setTextActionPosition(null);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseup', handleTextSelection);
      return () => container.removeEventListener('mouseup', handleTextSelection);
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
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10"
          >
            <Sidebar className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-dashboard-text dark:text-dashboard-text px-2">
            {loading ? '...' : `${pageNumber} / ${numPages}`}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={scale <= 0.5 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-dashboard-text dark:text-dashboard-text px-2 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={scale >= 3.0 || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRotate}
            disabled={loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={loading || error !== null}
                className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-dashboard-card dark:bg-dashboard-card border-dashboard-separator dark:border-dashboard-separator">
              <div className="space-y-2">
                <h4 className="font-medium text-dashboard-text dark:text-dashboard-text">Search PDF</h4>
                <Input
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text"
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl || loading || error !== null}
            className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-48 border-r border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
            {loading ? (
               <div className="flex items-center justify-center h-full">
                 <Loader2 className="h-6 w-6 animate-spin text-dashboard-text-secondary" />
               </div>
            ) : error ? (
               <div className="flex items-center justify-center h-full text-dashboard-text-secondary/60 text-sm p-2 text-center">
                 Error loading thumbnails.
               </div>
            ) : (
              <ScrollArea className="h-full p-2">
                <div className="space-y-2">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                    <div
                      key={page}
                      onClick={() => setPageNumber(page)}
                      className={cn(
                        "p-2 rounded cursor-pointer text-sm transition-colors",
                        page === pageNumber
                          ? "bg-dashboard-separator/20 dark:bg-white/10 text-dashboard-text dark:text-dashboard-text"
                          : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-separator/10 dark:hover:bg-white/5"
                      )}
                    >
                      Page {page}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto bg-dashboard-bg dark:bg-dashboard-bg" ref={containerRef}>
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
            <div className="flex justify-center w-full py-4">
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
                  className="shadow-lg"
                  width={containerWidth ? containerWidth - 32 : undefined}
                />
              </Document>
            </div>
          )}
        </div>
      </div>

      {/* Text Action Popover */}
      {selectedText && textActionPosition && (
        <div
          className="fixed z-50 bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator rounded-lg shadow-lg p-2"
          style={{
            left: textActionPosition.x,
            top: textActionPosition.y - 60,
          }}
        >
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('explain')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Explain
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('search')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10"
            >
              <Globe className="h-4 w-4 mr-1" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleTextAction('summarize')}
              className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10"
            >
              <FileText className="h-4 w-4 mr-1" />
              Summarize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
