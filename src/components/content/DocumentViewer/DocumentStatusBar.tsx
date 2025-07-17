import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useDocumentViewerContext } from './DocumentViewerContext';

export default function DocumentStatusBar() {
  const {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    zoom
  } = useDocumentViewerContext();
  
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= totalPages) {
      goToPage(value);
    }
  };
  
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = parseInt((e.target as HTMLInputElement).value);
      if (!isNaN(value) && value > 0 && value <= totalPages) {
        goToPage(value);
      }
    }
  };

  return (
    <div className="flex items-center justify-between border-t border-border p-2 bg-background">
      {/* Page navigation controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center">
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
            className="h-7 w-12 px-1 text-center text-sm"
          />
          <span className="mx-1 text-sm text-muted-foreground">of</span>
          <span className="text-sm">{totalPages}</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Document info */}
      <div className="flex items-center text-xs text-muted-foreground">
        <span>Zoom: {zoom}%</span>
        <Separator orientation="vertical" className="mx-2 h-3" />
        <span>Page {currentPage} of {totalPages}</span>
      </div>
    </div>
  );
}