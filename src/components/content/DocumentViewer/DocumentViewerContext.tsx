import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ContentData } from '@/pages/ContentPage';

interface DocumentViewerContextProps {
  // Document info
  contentData: ContentData;
  document: {
    title: string;
    url?: string;
    type?: string;
    totalPages?: number;
  };
  
  // Navigation
  currentPage: number;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Zoom controls
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  
  // Layout controls
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  
  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: number[];
  currentSearchResult: number;
  searchNext: () => void;
  searchPrev: () => void;
  
  // Document updates
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}

const DocumentViewerContext = createContext<DocumentViewerContextProps | undefined>(undefined);

export function DocumentViewerProvider({ 
  children, 
  contentData,
  onUpdateContent
}: { 
  children: ReactNode; 
  contentData: ContentData;
  onUpdateContent?: (updates: Partial<ContentData>) => void;
}) {
  // Document state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchResult, setCurrentSearchResult] = useState(0);
  
  // Document info
  const document = {
    title: contentData.title || 'Document',
    url: contentData.url,
    type: contentData.type,
    totalPages: totalPages,
  };
  
  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);
  
  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);
  
  const fitToWidth = useCallback(() => {
    setZoom(100);
  }, []);
  
  const fitToPage = useCallback(() => {
    setZoom(75);
  }, []);
  
  // Layout functions
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);
  
  // Search functions
  const searchNext = useCallback(() => {
    if (searchResults.length > 0) {
      setCurrentSearchResult(prev => (prev + 1) % searchResults.length);
    }
  }, [searchResults]);
  
  const searchPrev = useCallback(() => {
    if (searchResults.length > 0) {
      setCurrentSearchResult(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  }, [searchResults]);
  
  const value = {
    contentData,
    document,
    currentPage,
    totalPages,
    setTotalPages,
    goToPage,
    nextPage,
    prevPage,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    isSidebarOpen,
    toggleSidebar,
    isFullscreen,
    toggleFullscreen,
    searchTerm,
    setSearchTerm,
    searchResults,
    currentSearchResult,
    searchNext,
    searchPrev,
    onUpdateContent
  };
  
  return (
    <DocumentViewerContext.Provider value={value}>
      {children}
    </DocumentViewerContext.Provider>
  );
}

export function useDocumentViewerContext() {
  const context = useContext(DocumentViewerContext);
  if (context === undefined) {
    throw new Error('useDocumentViewerContext must be used within a DocumentViewerProvider');
  }
  return context;
}