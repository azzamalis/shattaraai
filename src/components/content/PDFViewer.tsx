
import React, { useState, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
  Grid3X3,
  MessageSquare,
  Globe,
  FileText,
  X
} from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File | null;
  filename?: string;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

interface TextSelection {
  text: string;
  x: number;
  y: number;
}

export function PDFViewer({ file, filename, onTextAction }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [textSelection, setTextSelection] = useState<TextSelection | null>(null);
  const [showTextActions, setShowTextActions] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('Error loading PDF:', error);
    setIsLoading(false);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPageNumber(page => Math.max(1, page - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(page => Math.min(numPages, page + 1));
  }, [numPages]);

  const goToPage = useCallback((page: number) => {
    setPageNumber(Math.max(1, Math.min(numPages, page)));
    setShowSidebar(false);
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(scale => Math.min(3, scale + 0.2));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(scale => Math.max(0.5, scale - 0.2));
  }, []);

  const rotate = useCallback(() => {
    setRotation(rotation => (rotation + 90) % 360);
  }, []);

  const handleTextSelection = useCallback((event: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const selectedText = selection.toString().trim();
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      if (containerRect) {
        setTextSelection({
          text: selectedText,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 10
        });
        setShowTextActions(true);
      }
    }
  }, []);

  const handleTextAction = useCallback((action: 'explain' | 'search' | 'summarize') => {
    if (textSelection && onTextAction) {
      onTextAction(action, textSelection.text);
      setShowTextActions(false);
      setTextSelection(null);
    }
  }, [textSelection, onTextAction]);

  const closeTextActions = useCallback(() => {
    setShowTextActions(false);
    setTextSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-dashboard-text-secondary dark:text-dashboard-text-secondary">
          <div className="w-16 h-16 mx-auto mb-4 bg-dashboard-card dark:bg-dashboard-card rounded-lg flex items-center justify-center border border-dashboard-separator dark:border-dashboard-separator">
            <FileText className="w-8 h-8" />
          </div>
          <p>No PDF file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative" ref={containerRef}>
      {/* PDF Toolbar */}
      <Card className="mb-4 bg-dashboard-card dark:bg-dashboard-card border-dashboard-separator dark:border-dashboard-separator">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-dashboard-text dark:text-dashboard-text">
              PDF Viewer
            </CardTitle>
            <Badge variant="secondary" className="bg-dashboard-bg dark:bg-dashboard-bg text-dashboard-text dark:text-dashboard-text">
              {filename || 'Document'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* First Row - Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-dashboard-text dark:text-dashboard-text min-w-[80px] text-center">
                {pageNumber} / {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[50px] text-center text-dashboard-text dark:text-dashboard-text">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3}
                className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Second Row - Tools */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSearch(!showSearch)}
                    className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search in PDF</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Page Overview</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotate}
                    className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate 90°</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download PDF</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fullscreen</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="flex items-center space-x-2 pt-2 border-t border-dashboard-separator dark:border-dashboard-separator">
              <Search className="w-4 h-4 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
              <Input
                placeholder="Search in PDF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(false)}
                className="border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex-1 flex gap-4">
        {/* Page Sidebar */}
        {showSidebar && (
          <Card className="w-64 bg-dashboard-card dark:bg-dashboard-card border-dashboard-separator dark:border-dashboard-separator">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-dashboard-text dark:text-dashboard-text">
                  Pages
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-full p-2 text-left rounded border transition-colors ${
                      page === pageNumber
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-card-hover dark:hover:bg-dashboard-card-hover'
                    }`}
                  >
                    <div className="text-xs font-medium">Page {page}</div>
                    <div className="w-full h-16 bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator dark:border-dashboard-separator rounded mt-1 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-dashboard-text-secondary dark:text-dashboard-text-secondary" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF Document Display */}
        <div className="flex-1 overflow-auto border border-dashboard-separator dark:border-dashboard-separator rounded-lg bg-dashboard-bg dark:bg-dashboard-bg">
          <div className="flex justify-center p-4" onMouseUp={handleTextSelection}>
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Loading PDF...
                  </p>
                </div>
              </div>
            )}
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading=""
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                className="shadow-lg"
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Text Selection Actions Popover */}
      {showTextActions && textSelection && (
        <div
          className="absolute z-50 bg-dashboard-card dark:bg-dashboard-card border border-dashboard-separator dark:border-dashboard-separator rounded-lg shadow-lg p-2"
          style={{
            left: textSelection.x - 75,
            top: textSelection.y,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex items-center space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTextAction('explain')}
                  className="h-8 px-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Explain this text</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTextAction('search')}
                  className="h-8 px-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                >
                  <Globe className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search the web</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTextAction('summarize')}
                  className="h-8 px-2 text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Summarize this text</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Button
              variant="ghost"
              size="sm"
              onClick={closeTextActions}
              className="h-8 px-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-bg dark:hover:bg-dashboard-bg"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
