import React, { useState } from 'react';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize, 
  Minimize2,
  SidebarOpen, 
  SidebarClose,
  AlignJustify,
  Printer,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useDocumentViewerContext } from './DocumentViewerContext';
import { useWindowSize } from '@/hooks/use-window-size';

export default function DocumentHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const isTablet = width ? width < 1024 : false;
  
  const {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    isSidebarOpen,
    toggleSidebar,
    isFullscreen,
    toggleFullscreen,
    searchTerm,
    setSearchTerm,
    searchResults,
    currentSearchResult,
    searchNext,
    searchPrev,
    document
  } = useDocumentViewerContext();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus search input when opened
      setTimeout(() => {
        const searchInput = window.document.querySelector('#document-search-input') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleDownload = () => {
    if (document.url) {
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.title || 'document';
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col border-b border-border">
      <div className="flex items-center justify-between p-2 bg-background">
        {/* Left section */}
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8"
                >
                  {isSidebarOpen ? <SidebarClose className="h-4 w-4" /> : <SidebarOpen className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isMobile && (
            <>
              <Separator orientation="vertical" className="h-6" />
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={zoomOut}
                      className="h-8 w-8"
                      disabled={zoom <= 25}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom out</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 px-2 text-xs">
                    {zoom}%
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Zoom</span>
                      <span className="text-sm">{zoom}%</span>
                    </div>
                    <Slider
                      value={[zoom]}
                      min={25}
                      max={200}
                      step={25}
                      onValueChange={(value) => setZoom(value[0])}
                      className="mt-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={fitToWidth}>
                        Fit Width
                      </Button>
                      <Button size="sm" variant="outline" onClick={fitToPage}>
                        Fit Page
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={zoomIn}
                      className="h-8 w-8"
                      disabled={zoom >= 200}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Zoom in</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>

        {/* Middle section (page title) */}
        {!isTablet && (
          <div className="flex-1 text-center">
            <h2 className="text-sm font-medium truncate max-w-md mx-auto">
              {document.title}
            </h2>
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSearch}
                  className={cn("h-8 w-8", isSearchOpen && "bg-accent")}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search document</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isMobile && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDownload}
                      className="h-8 w-8"
                      disabled={!document.url}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrint}
                      className="h-8 w-8"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Print</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="p-2 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                id="document-search-input"
                placeholder="Search in document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-24"
              />
              {searchResults.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {currentSearchResult + 1} of {searchResults.length}
                </div>
              )}
            </div>
            {searchResults.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={searchPrev}
                  className="h-8 w-8"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={searchNext}
                  className="h-8 w-8"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}