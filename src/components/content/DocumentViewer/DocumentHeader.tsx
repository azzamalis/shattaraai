import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomIn, ZoomOut, Download, Search, Maximize, Minimize, Columns2 } from 'lucide-react';
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
    zoomIn,
    zoomOut,
    setSearchTerm,
    setIsSearching,
    toggleFullscreen,
    toggleSidebar
  } = useDocumentViewer();

  const handleSearch = () => {
    setIsSearching(!isSearching);
    if (!isSearching) {
      // Clear search term when closing search
      setSearchTerm('');
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
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 25} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground min-w-[60px] text-center">
            {zoom}%
          </span>
          
          <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 200} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSearching && (
          <Input 
            placeholder="Search document..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="w-48 h-8"
            autoFocus
          />
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