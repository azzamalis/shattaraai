
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Search,
  Sidebar
} from 'lucide-react';
import { PDFSearchPopover } from './PDFSearchPopover';
import { SearchResult } from './types';

interface PDFToolbarProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  loading: boolean;
  error: string | null;
  showSidebar: boolean;
  searchTerm: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  isSearching: boolean;
  searchPopoverOpen: boolean;
  pdfUrl?: string;
  onPrevPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onDownload: () => void;
  onToggleSidebar: () => void;
  onSearch: () => void;
  onSearchTermChange: (term: string) => void;
  onClearSearch: () => void;
  onNavigateToSearchResult: (index: number) => void;
  onSearchPopoverOpenChange: (open: boolean) => void;
}

export function PDFToolbar({
  pageNumber,
  numPages,
  scale,
  loading,
  error,
  showSidebar,
  searchTerm,
  searchResults,
  currentSearchIndex,
  isSearching,
  searchPopoverOpen,
  pdfUrl,
  onPrevPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onRotate,
  onDownload,
  onToggleSidebar,
  onSearch,
  onSearchTermChange,
  onClearSearch,
  onNavigateToSearchResult,
  onSearchPopoverOpenChange
}: PDFToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 md:p-3 border-b border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
      {/* Left side controls */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <Sidebar className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-4 md:h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevPage}
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
          onClick={onNextPage}
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
          onClick={onZoomOut}
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
          onClick={onZoomIn}
          disabled={scale >= 3.0 || loading || error !== null}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-4 md:h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onRotate}
          disabled={loading || error !== null}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        
        <PDFSearchPopover
          searchTerm={searchTerm}
          searchResults={searchResults}
          currentSearchIndex={currentSearchIndex}
          isSearching={isSearching}
          searchPopoverOpen={searchPopoverOpen}
          loading={loading}
          error={error}
          onSearch={onSearch}
          onSearchTermChange={onSearchTermChange}
          onClearSearch={onClearSearch}
          onNavigateToSearchResult={onNavigateToSearchResult}
          onSearchPopoverOpenChange={onSearchPopoverOpenChange}
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          disabled={!pdfUrl || loading || error !== null}
          className="text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
