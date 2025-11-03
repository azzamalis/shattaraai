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
  isSearching: boolean;
  
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
  performSearch: (term: string) => Promise<void>;
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
  
  // Internal state setter for renderers
  setSearchResults: (results: SearchResult[], currentIndex?: number) => void;
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
    isSearching: false,
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
  const toggleSearch = () => setState(prev => ({ ...prev, isSearchOpen: !prev.isSearchOpen, searchTerm: !prev.isSearchOpen ? '' : prev.searchTerm, searchResults: !prev.isSearchOpen ? [] : prev.searchResults }));
  
  const performSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setState(prev => ({ ...prev, searchResults: [], currentSearchIndex: 0, isSearching: false }));
      return;
    }

    setState(prev => ({ ...prev, isSearching: true }));

    try {
      // For PDF documents, search through PDF content
      if (state.documentType === 'pdf' && state.pdfUrl) {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        
        const loadingTask = pdfjsLib.getDocument(state.pdfUrl);
        const pdf = await loadingTask.promise;
        const results: SearchResult[] = [];
        const searchRegex = new RegExp(term, 'gi');

        // Search through all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');

          let match;
          while ((match = searchRegex.exec(pageText)) !== null) {
            results.push({
              id: `${pageNum}-${match.index}`,
              page: pageNum,
              text: pageText.substring(
                Math.max(0, match.index - 30),
                Math.min(pageText.length, match.index + term.length + 30)
              ),
              position: { x: 0, y: 0 }
            });
          }
        }

        setState(prev => ({ 
          ...prev, 
          searchResults: results, 
          currentSearchIndex: results.length > 0 ? 0 : -1,
          isSearching: false
        }));

        // Navigate to first result if found
        if (results.length > 0) {
          setCurrentPage(results[0].page);
        }
      } else {
        // For non-PDF documents (DOCX, HTML, etc.), the renderer will handle search
        // Just update the search term and let the renderer populate results
        setState(prev => ({ ...prev, isSearching: false }));
      }
    } catch (error) {
      console.error('Search error:', error);
      setState(prev => ({ ...prev, searchResults: [], currentSearchIndex: 0, isSearching: false }));
    }
  };

  const nextSearchResult = () => {
    if (state.searchResults.length > 0) {
      const nextIndex = (state.currentSearchIndex + 1) % state.searchResults.length;
      setState(prev => ({ 
        ...prev, 
        currentSearchIndex: nextIndex
      }));
      // Navigate to the page of the next result
      setCurrentPage(state.searchResults[nextIndex].page);
    }
  };

  const previousSearchResult = () => {
    if (state.searchResults.length > 0) {
      const prevIndex = state.currentSearchIndex === 0 
        ? state.searchResults.length - 1 
        : state.currentSearchIndex - 1;
      setState(prev => ({ 
        ...prev, 
        currentSearchIndex: prevIndex
      }));
      // Navigate to the page of the previous result
      setCurrentPage(state.searchResults[prevIndex].page);
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
  
  // Internal state setter for renderers
  const setSearchResults = (results: SearchResult[], currentIndex: number = 0) => {
    setState(prev => ({ 
      ...prev, 
      searchResults: results, 
      currentSearchIndex: currentIndex,
      isSearching: false 
    }));
  };

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
    setSearchResults,
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