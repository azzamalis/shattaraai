import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewMode = 'document' | 'thumbnail';
export type DocumentType = 'pdf' | 'docx' | 'html' | 'text' | 'unknown';

interface SearchResult {
  id: string;
  page: number;
  text: string;
  position: { x: number; y: number };
}

interface UnifiedDocumentState {
  // View state
  zoom: number;
  currentPage: number;
  totalPages: number;
  viewMode: ViewMode;
  isFullscreen: boolean;
  isThumbnailsOpen: boolean;
  
  // Search state
  searchTerm: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  isSearchOpen: boolean;
  
  // Document state
  rotation: number; // 0, 90, 180, 270
  documentData: string | ArrayBuffer | null;
  documentType: DocumentType;
  isLoading: boolean;
  error: string | null;
  pdfUrl: string | null;
  
  // Audio state
  isAudioPlaying: boolean;
}

interface UnifiedDocumentContextType extends UnifiedDocumentState {
  // View controls
  setZoom: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  toggleViewMode: () => void;
  toggleFullscreen: () => void;
  toggleThumbnails: () => void;
  
  // Search controls
  setSearchTerm: (term: string) => void;
  toggleSearch: () => void;
  performSearch: (term: string) => void;
  nextSearchResult: () => void;
  previousSearchResult: () => void;
  
  // Document controls
  rotateClockwise: () => void;
  setDocumentData: (data: string | ArrayBuffer | null) => void;
  setDocumentType: (type: DocumentType) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPdfUrl: (url: string | null) => void;
  
  // Zoom controls
  zoomIn: () => void;
  zoomOut: () => void;
  setZoomLevel: (level: number) => void;
  fitToWidth: () => void;
  fitToPage: () => void;
  
  // Page navigation
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  
  // Audio controls
  toggleAudio: () => void;
}

const UnifiedDocumentContext = createContext<UnifiedDocumentContextType | undefined>(undefined);

export function UnifiedDocumentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UnifiedDocumentState>({
    zoom: 100,
    currentPage: 1,
    totalPages: 1,
    viewMode: 'document',
    isFullscreen: false,
    isThumbnailsOpen: false,
    searchTerm: '',
    searchResults: [],
    currentSearchIndex: 0,
    isSearchOpen: false,
    rotation: 0,
    documentData: null,
    documentType: 'unknown',
    isLoading: false,
    error: null,
    pdfUrl: null,
    isAudioPlaying: false,
  });

  // View controls
  const setZoom = (zoom: number) => setState(prev => ({ ...prev, zoom: Math.max(25, Math.min(500, zoom)) }));
  const setCurrentPage = (page: number) => setState(prev => ({ ...prev, currentPage: Math.max(1, Math.min(prev.totalPages, page)) }));
  const setTotalPages = (pages: number) => setState(prev => ({ ...prev, totalPages: Math.max(1, pages) }));
  const toggleViewMode = () => setState(prev => ({ ...prev, viewMode: prev.viewMode === 'document' ? 'thumbnail' : 'document' }));
  const toggleFullscreen = () => setState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  const toggleThumbnails = () => setState(prev => ({ ...prev, isThumbnailsOpen: !prev.isThumbnailsOpen }));

  // Search controls
  const setSearchTerm = (term: string) => setState(prev => ({ ...prev, searchTerm: term }));
  const toggleSearch = () => setState(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen, searchTerm: !prev.isSearchOpen ? '' : prev.searchTerm }));
  
  const performSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setState(prev => ({ ...prev, searchResults: [], currentSearchIndex: 0 }));
      return;
    }
    // Implementation will vary by document type
    // For now, just set the search term
    setState(prev => ({ ...prev, searchResults: [], currentSearchIndex: 0 }));
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

  // Document controls
  const rotateClockwise = () => setState(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  const setDocumentData = (data: string | ArrayBuffer | null) => setState(prev => ({ ...prev, documentData: data }));
  const setDocumentType = (type: DocumentType) => setState(prev => ({ ...prev, documentType: type }));
  const setIsLoading = (loading: boolean) => setState(prev => ({ ...prev, isLoading: loading }));
  const setError = (error: string | null) => setState(prev => ({ ...prev, error }));
  const setPdfUrl = (url: string | null) => setState(prev => ({ ...prev, pdfUrl: url }));

  // Zoom controls
  const zoomIn = () => setZoom(state.zoom + 25);
  const zoomOut = () => setZoom(state.zoom - 25);
  const setZoomLevel = (level: number) => setZoom(level);
  const fitToWidth = () => setZoom(120);
  const fitToPage = () => setZoom(100);

  // Page navigation
  const nextPage = () => setCurrentPage(state.currentPage + 1);
  const previousPage = () => setCurrentPage(state.currentPage - 1);
  const goToPage = (page: number) => setCurrentPage(page);

  // Audio controls
  const toggleAudio = () => setState(prev => ({ ...prev, isAudioPlaying: !prev.isAudioPlaying }));

  const value: UnifiedDocumentContextType = {
    ...state,
    setZoom,
    setCurrentPage,
    setTotalPages,
    toggleViewMode,
    toggleFullscreen,
    toggleThumbnails,
    setSearchTerm,
    toggleSearch,
    performSearch,
    nextSearchResult,
    previousSearchResult,
    rotateClockwise,
    setDocumentData,
    setDocumentType,
    setIsLoading,
    setError,
    setPdfUrl,
    zoomIn,
    zoomOut,
    setZoomLevel,
    fitToWidth,
    fitToPage,
    nextPage,
    previousPage,
    goToPage,
    toggleAudio,
  };

  return (
    <UnifiedDocumentContext.Provider value={value}>
      {children}
    </UnifiedDocumentContext.Provider>
  );
}

export function useUnifiedDocument() {
  const context = useContext(UnifiedDocumentContext);
  if (context === undefined) {
    throw new Error('useUnifiedDocument must be used within a UnifiedDocumentProvider');
  }
  return context;
}