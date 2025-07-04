import React from 'react';
import { Document, Page } from 'react-pdf';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PDFToolbar } from './pdf/PDFToolbar';
import { PDFSidebar } from './pdf/PDFSidebar';
import { PDFTextActionPopover } from './pdf/PDFTextActionPopover';
import { PDFViewerProps } from './pdf/types';
import { usePDFState } from './pdf/hooks/usePDFState';
import { usePDFActions } from './pdf/hooks/usePDFActions';
import { usePDFTextSelection } from './pdf/hooks/usePDFTextSelection';
import { PDFErrorState } from './pdf/components/PDFErrorState';
import { PDFLoadingState } from './pdf/components/PDFLoadingState';
import { PDFEmptyState } from './pdf/components/PDFEmptyState';
import { PDFTimeoutHandler } from './pdf/components/PDFTimeoutHandler';

export function PDFViewer({ url, onTextAction }: PDFViewerProps) {
  const {
    numPages,
    pageNumber,
    scale,
    rotation,
    loading,
    error,
    searchTerm,
    searchResults,
    currentSearchIndex,
    isSearching,
    showSidebar,
    selectedText,
    textActionPosition,
    containerWidth,
    searchPopoverOpen,
    containerRef,
    scrollAreaRef,
    setPageNumber,
    setScale,
    setRotation,
    setSearchTerm,
    setSearchResults,
    setCurrentSearchIndex,
    setIsSearching,
    setShowSidebar,
    setSelectedText,
    setTextActionPosition,
    setSearchPopoverOpen,
    setError,
    setLoading,
    onDocumentLoadSuccess,
    onDocumentLoadError,
  } = usePDFState(url);

  const {
    goToPrevPage,
    goToNextPage,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleDownload,
    handleSearch,
    clearSearch,
    navigateToSearchResult,
  } = usePDFActions({
    pageNumber,
    numPages,
    scale,
    url,
    searchTerm,
    searchResults,
    setPageNumber,
    setScale,
    setRotation,
    setSearchResults,
    setCurrentSearchIndex,
    setIsSearching,
    setSearchTerm,
    setSearchPopoverOpen,
  });

  const { handleTextAction } = usePDFTextSelection({
    containerRef,
    setSelectedText,
    setTextActionPosition,
    onTextAction,
  });

  const handleTimeout = () => {
    setError('PDF loading timed out. Please refresh the page and try again.');
    setLoading(false);
  };

  if (!url) {
    return <PDFEmptyState />;
  }

  return (
    <div className="relative h-full bg-dashboard-card dark:bg-dashboard-card rounded-xl border border-dashboard-separator dark:border-dashboard-separator overflow-hidden">
      <PDFTimeoutHandler 
        loading={loading}
        url={url}
        onTimeout={handleTimeout}
      />
      <PDFToolbar
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        loading={loading}
        error={error}
        showSidebar={showSidebar}
        searchTerm={searchTerm}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        isSearching={isSearching}
        searchPopoverOpen={searchPopoverOpen}
        pdfUrl={url}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onDownload={handleDownload}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onSearch={handleSearch}
        onSearchTermChange={setSearchTerm}
        onClearSearch={clearSearch}
        onNavigateToSearchResult={navigateToSearchResult}
        onSearchPopoverOpenChange={setSearchPopoverOpen}
      />

      <div className="flex flex-grow overflow-hidden">
        {showSidebar && (
          <PDFSidebar
            numPages={numPages}
            pageNumber={pageNumber}
            loading={loading}
            error={error}
            onPageChange={setPageNumber}
          />
        )}

        <div className="flex-1 overflow-hidden" ref={containerRef}>
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="min-h-full bg-dashboard-bg dark:bg-dashboard-bg">
              {loading && <PDFLoadingState />}

              {error && <PDFErrorState error={error} url={url} />}

              {!loading && !error && url && (
                <div className="flex justify-center w-full py-4 px-4">
                  <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    error={null}
                  >
                    <Page
                      pageNumber={pageNumber}
                      scale={scale}
                      rotate={rotation}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-lg border border-dashboard-separator/20 dark:border-white/10"
                      width={containerWidth ? Math.min(containerWidth - 64, 800) : undefined}
                      onLoadSuccess={() => console.log('PDFViewer: Page rendered successfully')}
                      onLoadError={(error) => console.error('PDFViewer: Page render error:', error)}
                    />
                  </Document>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <PDFTextActionPopover
        selectedText={selectedText}
        textActionPosition={textActionPosition}
        onTextAction={(action) => handleTextAction(action, selectedText)}
      />
    </div>
  );
}
