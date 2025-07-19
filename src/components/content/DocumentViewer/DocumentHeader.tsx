import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomIn, ZoomOut, Download, Search, Maximize, Minimize, Columns2, ChevronUp, ChevronDown, FileText, Monitor } from 'lucide-react';
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
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    performSearch,
    nextSearchResult,
    previousSearchResult,
    setIsSearching,
    toggleFullscreen,
    toggleSidebar
  } = useDocumentViewer();

  const handleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      performSearch('');
    }
  };

  const handleDownload = () => {
    if (contentData?.url) {
      window.open(contentData.url, '_blank');
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
      {/* Left side controls */}
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar} 
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <Columns2 className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={zoomOut} 
          disabled={zoom <= 25} 
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center min-w-[60px] justify-center">
          <span className="text-sm text-gray-700 font-medium">
            {zoom}%
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={zoomIn} 
          disabled={zoom >= 300} 
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fitToPage} 
          className="h-8 px-3 text-sm hover:bg-gray-200"
        >
          <FileText className="h-3 w-3 mr-1" />
          Fit Page
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fitToWidth} 
          className="h-8 px-3 text-sm hover:bg-gray-200"
        >
          <Monitor className="h-3 w-3 mr-1" />
          Fit Width
        </Button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-1">
        {isSearching && (
          <div className="flex items-center gap-1 mr-2">
            <Input 
              placeholder="Search document..." 
              value={searchTerm} 
              onChange={(e) => performSearch(e.target.value)} 
              className="w-48 h-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            {searchResults.length > 0 && (
              <>
                <span className="text-xs text-gray-600 mx-2 whitespace-nowrap">
                  {currentSearchIndex + 1} of {searchResults.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={previousSearchResult} 
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextSearchResult} 
                  className="h-8 w-8 p-0 hover:bg-gray-200"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSearch} 
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownload}
          disabled={!contentData?.url}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <Download className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFullscreen} 
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}