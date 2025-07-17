import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DocumentViewerState {
  zoom: number;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  isSearching: boolean;
  isSidebarOpen: boolean;
  isFullscreen: boolean;
  tableOfContents: { id: string; title: string; page: number }[];
}

interface DocumentViewerContextType extends DocumentViewerState {
  setZoom: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setSearchTerm: (term: string) => void;
  setIsSearching: (searching: boolean) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWidth: () => void;
  nextPage: () => void;
  previousPage: () => void;
}

const DocumentViewerContext = createContext<DocumentViewerContextType | undefined>(undefined);

export function DocumentViewerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DocumentViewerState>({
    zoom: 100,
    currentPage: 1,
    totalPages: 1,
    searchTerm: '',
    isSearching: false,
    isSidebarOpen: true,
    isFullscreen: false,
    tableOfContents: [
      { id: '1', title: 'Introduction', page: 1 },
      { id: '2', title: 'Overview', page: 2 },
      { id: '3', title: 'Conclusion', page: 3 },
    ],
  });

  const setZoom = (zoom: number) => setState(prev => ({ ...prev, zoom: Math.max(25, Math.min(200, zoom)) }));
  const setCurrentPage = (page: number) => setState(prev => ({ ...prev, currentPage: Math.max(1, Math.min(prev.totalPages, page)) }));
  const setTotalPages = (pages: number) => setState(prev => ({ ...prev, totalPages: pages }));
  const setSearchTerm = (term: string) => setState(prev => ({ ...prev, searchTerm: term }));
  const setIsSearching = (searching: boolean) => setState(prev => ({ ...prev, isSearching: searching }));
  const toggleSidebar = () => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  const toggleFullscreen = () => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  
  const zoomIn = () => setZoom(state.zoom + 25);
  const zoomOut = () => setZoom(state.zoom - 25);
  const fitToWidth = () => setZoom(100);
  
  const nextPage = () => setCurrentPage(state.currentPage + 1);
  const previousPage = () => setCurrentPage(state.currentPage - 1);

  const value: DocumentViewerContextType = {
    ...state,
    setZoom,
    setCurrentPage,
    setTotalPages,
    setSearchTerm,
    setIsSearching,
    toggleSidebar,
    toggleFullscreen,
    zoomIn,
    zoomOut,
    fitToWidth,
    nextPage,
    previousPage,
  };

  return (
    <DocumentViewerContext.Provider value={value}>
      {children}
    </DocumentViewerContext.Provider>
  );
}

export function useDocumentViewer() {
  const context = useContext(DocumentViewerContext);
  if (context === undefined) {
    throw new Error('useDocumentViewer must be used within a DocumentViewerProvider');
  }
  return context;
}