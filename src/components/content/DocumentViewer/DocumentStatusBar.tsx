import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';

export function DocumentStatusBar() {
  const {
    currentPage,
    totalPages,
    zoom,
    documentHtml,
    searchResults,
    nextPage,
    previousPage,
    setCurrentPage
  } = useDocumentViewer();

  const handlePageChange = (value: string) => {
    const pageNum = parseInt(value);
    if (!isNaN(pageNum)) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previousPage} 
            disabled={currentPage <= 1} 
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Select value={currentPage.toString()} onValueChange={handlePageChange}>
              <SelectTrigger className="w-16 h-8 text-sm border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-gray-600">/ {totalPages}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextPage} 
            disabled={currentPage >= totalPages} 
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <span className="text-gray-600">
            {searchResults.length} search results
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">        
        <span className="text-gray-600 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Visual Document Viewer
        </span>
        
        <span className="text-gray-600">
          Zoom: {zoom}%
        </span>
      </div>
    </div>
  );
}