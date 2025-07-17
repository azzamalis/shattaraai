import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoomIn, ZoomOut, Download, Search, Maximize, Minimize, Maximize2, Menu } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
export function DocumentHeader() {
  const {
    zoom,
    searchTerm,
    isSearching,
    isFullscreen,
    isSidebarOpen,
    zoomIn,
    zoomOut,
    fitToWidth,
    setSearchTerm,
    setIsSearching,
    toggleFullscreen,
    toggleSidebar
  } = useDocumentViewer();
  const handleSearch = () => {
    setIsSearching(!isSearching);
  };
  return <div className="flex items-center justify-between p-2 border-b border-border bg-background ">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
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
          
          <Button variant="ghost" size="sm" onClick={fitToWidth} className="h-8 w-8 p-0" title="Fit to width">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSearching && <Input placeholder="Search document..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-48 h-8" />}
        
        <Button variant="ghost" size="sm" onClick={handleSearch} className="h-8 w-8 p-0">
          <Search className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Download className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="h-8 w-8 p-0">
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>;
}