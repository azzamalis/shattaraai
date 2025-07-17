import React, { useState, useEffect } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { DocumentHeader } from './DocumentHeader';
import { DocumentContent } from './DocumentContent';
import { DocumentNavigation } from './DocumentNavigation';
import { DocumentToolbar } from './DocumentToolbar';
import { useDocumentViewer } from './hooks/useDocumentViewer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function DocumentViewer({ 
  contentData, 
  onUpdateContent, 
  onTextAction 
}: DocumentViewerProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    zoomLevel,
    setZoomLevel,
    viewMode,
    setViewMode,
    isSearching,
    highlightedText,
    navigateSearch,
    clearSearch,
    handleTextSelect,
    extractText,
    isLoading,
    error
  } = useDocumentViewer(contentData);

  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false);

  // Extract text content when document loads
  useEffect(() => {
    if (contentData && !contentData.text && !isLoading) {
      extractText();
    }
  }, [contentData, extractText, isLoading]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="text-destructive text-sm font-medium">Error loading document</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Document Header */}
      <DocumentHeader
        contentData={contentData}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        currentSearchIndex={currentSearchIndex}
        onSearchNavigate={navigateSearch}
        onSearchClear={clearSearch}
        isSearching={isSearching}
        onDownload={() => {
          if (contentData.url) {
            window.open(contentData.url, '_blank');
          }
        }}
        onExpandToggle={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
        isExpanded={!isToolbarCollapsed}
      />

      <Separator />

      {/* Document Toolbar */}
      {!isToolbarCollapsed && (
        <>
          <DocumentToolbar
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            contentData={contentData}
          />
          <Separator />
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation Sidebar (if applicable) */}
        <DocumentNavigation
          contentData={contentData}
          searchResults={searchResults}
          onNavigate={(section) => {
            // Handle navigation to specific section
            console.log('Navigate to section:', section);
          }}
        />

        {/* Document Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1">
            <DocumentContent
              contentData={contentData}
              zoomLevel={zoomLevel}
              viewMode={viewMode}
              highlightedText={highlightedText}
              searchQuery={searchQuery}
              onTextSelect={handleTextSelect}
              onTextAction={onTextAction}
              isLoading={isLoading}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}