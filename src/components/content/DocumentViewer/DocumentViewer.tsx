import React, { useState, useRef, useEffect } from 'react';
import { ContentData } from '@/pages/ContentPage';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Maximize, 
  Minimize2,
  ChevronLeft, 
  ChevronRight, 
  SidebarOpen, 
  SidebarClose,
  X,
  RotateCw,
  FileText,
  AlignJustify,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useWindowSize } from '@/hooks/use-window-size';

import DocumentHeader from './DocumentHeader';
import DocumentSidebar from './DocumentSidebar';
import DocumentContent from './DocumentContent';
import DocumentStatusBar from './DocumentStatusBar';
import { useDocumentViewerContext, DocumentViewerProvider } from './DocumentViewerContext';

interface DocumentViewerProps {
  contentData: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
  fullWidth?: boolean;
}

// Main component wrapper that provides context
export function DocumentViewer({ 
  contentData, 
  onUpdateContent,
  fullWidth = false
}: DocumentViewerProps) {
  return (
    <DocumentViewerProvider contentData={contentData} onUpdateContent={onUpdateContent}>
      <DocumentViewerContent fullWidth={fullWidth} />
    </DocumentViewerProvider>
  );
}

// Internal content component that uses the context
function DocumentViewerContent({ fullWidth }: { fullWidth?: boolean }) {
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  
  const {
    currentPage,
    totalPages,
    zoom,
    isSidebarOpen,
    isFullscreen,
    toggleSidebar,
    toggleFullscreen,
    document
  } = useDocumentViewerContext();

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  return (
    <div 
      className={cn(
        "flex flex-col h-full w-full overflow-hidden bg-background rounded-lg border border-border",
        isFullscreen && "fixed inset-0 z-50",
        fullWidth && "flex-1"
      )}
    >
      <DocumentHeader />
      
      <div className="flex flex-1 overflow-hidden min-h-0">
        {isSidebarOpen && !isMobile && (
          <DocumentSidebar />
        )}
        
        <DocumentContent />
      </div>
      
      <DocumentStatusBar />
    </div>
  );
}