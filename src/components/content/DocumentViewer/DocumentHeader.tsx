import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ZoomIn, ZoomOut, Download, Search, Maximize, Minimize, Columns2, ChevronUp, ChevronDown, Monitor, FileText, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';

interface DocumentHeaderProps {
  contentData?: {
    url?: string;
    filename?: string;
  };
}

export function DocumentHeader({ contentData }: DocumentHeaderProps) {
  const {
    zoom,
    searchTerm,
    isSearching,
    isFullscreen,
    searchResults,
    currentSearchIndex,
    currentPage,
    totalPages,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    performSearch,
    nextSearchResult,
    previousSearchResult,
    setIsSearching,
    toggleFullscreen,
    toggleSidebar,
    nextPage,
    previousPage
  } = useDocumentViewer();

  const handleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      // Clear search when closing
      performSearch('');
    }
  };

  const handleDownload = () => {
    if (contentData?.url) {
      window.open(contentData.url, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b border-border bg-inherit">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0">
          <Columns2 className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 px-3 rounded-full">
              <Settings className="h-4 w-4 mr-2" />
              Page & Zoom
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 z-50 bg-background">
            {/* Page Controls */}
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Page Navigation</div>
            <div className="flex items-center justify-between px-2 py-1">
              <Button variant="ghost" size="sm" onClick={previousPage} disabled={currentPage <= 1} className="h-7 w-7 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="ghost" size="sm" onClick={nextPage} disabled={currentPage >= totalPages} className="h-7 w-7 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <DropdownMenuSeparator />
            
            {/* Zoom Controls */}
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Zoom Controls</div>
            <div className="flex items-center justify-between px-2 py-1">
              <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 25} className="h-7 w-7 p-0">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 300} className="h-7 w-7 p-0">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <DropdownMenuItem onClick={fitToPage}>
              <FileText className="h-4 w-4 mr-2" />
              Fit to Page
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={fitToWidth}>
              <Monitor className="h-4 w-4 mr-2" />
              Fit to Width
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">

        {isSearching && (
          <div className="flex items-center gap-1">
            <Input 
              placeholder="Search document..." 
              value={searchTerm} 
              onChange={(e) => performSearch(e.target.value)} 
              className="w-48 h-8"
              autoFocus
            />
            {searchResults.length > 0 && (
              <>
                <span className="text-xs text-muted-foreground">
                  {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <Button variant="ghost" size="sm" onClick={previousSearchResult} className="h-8 w-8 p-0">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={nextSearchResult} className="h-8 w-8 p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
        
        <Button variant="ghost" size="sm" onClick={handleSearch} className="h-8 w-8 p-0">
          <Search className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownload}
          disabled={!contentData?.url}
          className="h-8 w-8 p-0"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}