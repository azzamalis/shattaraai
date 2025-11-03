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
      <div className="overflow-x-hidden">
        <div className="flex flex-col gap-4 items-center py-4">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isCurrentPage = pageNumber === currentPage;
            
            return (
              <div
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                style={{ minHeight: '150px', minWidth: '10px' }}
              >
                <canvas
                  className={`transition-all w-48 hover:shadow-lg cursor-pointer ${
                    isCurrentPage 
                      ? 'outline outline-2 outline-primary' 
                      : 'hover:outline hover:outline-neutral-300 dark:hover:outline-neutral-600'
                  }`}
                  role="button"
                  tabIndex={0}
                  width={400}
                  height={529}
                  style={{ transform: 'rotate(0deg)' }}
                />
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