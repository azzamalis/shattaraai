import React from 'react';
import { Grid, FileText } from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';

export function ThumbnailView() {
  const {
    currentPage,
    totalPages,
    documentType,
    goToPage,
  } = useUnifiedDocument();

  if (documentType === 'pdf') {
    // For PDF, show page thumbnails
    return (
      <div className="h-full w-full overflow-auto bg-background p-4">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            
            return (
              <div
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`
                  cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-lg
                  ${isCurrentPage 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                <div className="aspect-[3/4] bg-card rounded-md flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for PDF page thumbnail */}
                  <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  {/* Page number overlay */}
                  <div className="absolute bottom-1 left-1 right-1 bg-background/90 rounded text-xs text-center py-1">
                    {pageNumber}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (documentType === 'docx' || documentType === 'html' || documentType === 'text') {
    // For other document types, show section overview
    return (
      <div className="h-full w-full overflow-auto bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium text-foreground">Document Overview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This document is displayed as a continuous scroll
            </p>
          </div>
          
          <div className="space-y-4">
            <div 
              className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => goToPage(1)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Document Content</h4>
                  <p className="text-sm text-muted-foreground">
                    {documentType === 'docx' && 'Word Document'}
                    {documentType === 'html' && 'Web Page Content'}
                    {documentType === 'text' && 'Text Content'}
                  </p>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <div className="text-center">
        <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">
          Thumbnail view not available for this document type
        </p>
      </div>
    </div>
  );
}