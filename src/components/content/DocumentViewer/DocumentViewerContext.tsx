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
  documentHtml: string;
  searchResults: number[];
  currentSearchIndex: number;
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
  fitToPage: () => void;
  nextPage: () => void;
  previousPage: () => void;
  setDocumentHtml: (html: string) => void;
  performSearch: (term: string) => void;
  nextSearchResult: () => void;
  previousSearchResult: () => void;
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
    tableOfContents: [],
    documentHtml: '',
    searchResults: [],
    currentSearchIndex: 0,
  });

  const setZoom = (zoom: number) => setState(prev => ({ ...prev, zoom: Math.max(25, Math.min(300, zoom)) }));
  const setCurrentPage = (page: number) => setState(prev => ({ ...prev, currentPage: Math.max(1, Math.min(prev.totalPages, page)) }));
  const setTotalPages = (pages: number) => setState(prev => ({ ...prev, totalPages: pages }));
  const setSearchTerm = (term: string) => setState(prev => ({ ...prev, searchTerm: term }));
  const setIsSearching = (searching: boolean) => setState(prev => ({ ...prev, isSearching: searching }));
  const toggleSidebar = () => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }));
  const toggleFullscreen = () => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  const setDocumentHtml = (html: string) => setState(prev => ({ ...prev, documentHtml: html }));
  
  const zoomIn = () => setZoom(state.zoom + 25);
  const zoomOut = () => setZoom(state.zoom - 25);
  const fitToWidth = () => setZoom(120);
  const fitToPage = () => setZoom(100);
  
  const nextPage = () => setCurrentPage(state.currentPage + 1);
  const previousPage = () => setCurrentPage(state.currentPage - 1);

  const performSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim() || !state.documentHtml) {
      setState(prev => ({ ...prev, searchResults: [], currentSearchIndex: 0 }));
      return;
    }

    // Simple search implementation - in a real app you'd want more sophisticated search
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = state.documentHtml;
    const textContent = tempDiv.textContent || '';
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = [...textContent.matchAll(regex)];
    
    setState(prev => ({ 
      ...prev, 
      searchResults: matches.map((_, index) => index),
      currentSearchIndex: 0 
    }));
  };

  const nextSearchResult = () => {
    if (state.searchResults.length > 0) {
      setState(prev => ({ 
        ...prev, 
        currentSearchIndex: (prev.currentSearchIndex + 1) % prev.searchResults.length 
      }));
    }
  };

  const previousSearchResult = () => {
    if (state.searchResults.length > 0) {
      setState(prev => ({ 
        ...prev, 
        currentSearchIndex: prev.currentSearchIndex === 0 
          ? prev.searchResults.length - 1 
          : prev.currentSearchIndex - 1 
      }));
    }
  };

  const value: DocumentViewerContextType = {
    ...state,
    setZoom,
    setCurrentPage,
    setTotalPages,
    setSearchTerm,
    setIsSearching,
    toggleSidebar,
    toggleFullscreen,
    setDocumentHtml,
    zoomIn,
    zoomOut,
    fitToWidth,
    fitToPage,
    nextPage,
    previousPage,
    performSearch,
    nextSearchResult,
    previousSearchResult,
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