import React from 'react';
import { 
  LayoutGrid, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Download, 
  Maximize, 
  Minimize,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { ZoomDropdown } from './ZoomDropdown';

interface EnhancedDocumentToolbarProps {
  onDownload?: () => void;
  contentData?: {
    url?: string;
    filename?: string;
  };
}

export function EnhancedDocumentToolbar({ onDownload, contentData }: EnhancedDocumentToolbarProps) {
  const {
    currentPage,
    totalPages,
    viewMode,
    isFullscreen,
    searchTerm,
    searchResults,
    currentSearchIndex,
    isSearchOpen,
    toggleViewMode,
    toggleFullscreen,
    toggleSearch,
    setSearchTerm,
    performSearch,
    nextSearchResult,
    previousSearchResult,
    rotateClockwise,
    nextPage,
    previousPage,
  } = useUnifiedDocument();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (contentData?.url) {
      window.open(contentData.url, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between w-full h-12 px-3 bg-background border-b border-border">
      {/* Left Section */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleViewMode}
          className={`h-8 px-2 hover:bg-muted/50 ${
            viewMode === 'thumbnail' ? 'bg-muted text-primary' : ''
          }`}
          title="Toggle thumbnail view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSearch}
          className={`h-8 px-2 hover:bg-muted/50 ${
            isSearchOpen ? 'bg-muted text-primary' : ''
          }`}
          title="Search document"
        >
          <Search className="h-4 w-4" />
        </Button>

        {isSearchOpen && (
          <div className="flex items-center gap-1 ml-2">
            <form onSubmit={handleSearch} className="flex items-center gap-1">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-7 w-32 text-xs"
                autoFocus
              />
              {searchResults.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground px-1">
                    {currentSearchIndex + 1} of {searchResults.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={previousSearchResult}
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextSearchResult}
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </form>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              className="h-6 w-6 p-0 hover:bg-muted/50"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={previousPage}
            disabled={currentPage <= 1}
            className="h-8 px-2 hover:bg-muted/50 disabled:opacity-50"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1 px-2">
            <span className="text-xs font-mono text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="h-8 px-2 hover:bg-muted/50 disabled:opacity-50"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Zoom Dropdown */}
        <ZoomDropdown />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={rotateClockwise}
          className="h-8 px-2 hover:bg-muted/50"
          title="Rotate clockwise"
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownload}
          className="h-8 px-2 hover:bg-muted/50"
          title="Download document"
        >
          <Download className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullscreen}
          className="h-8 px-2 hover:bg-muted/50"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? (
            <Minimize className="h-4 w-4" />
          ) : (
            <Maximize className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}