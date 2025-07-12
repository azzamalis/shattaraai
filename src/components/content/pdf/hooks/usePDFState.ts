
import { useState, useCallback, useRef, useEffect } from 'react';
import { SearchResult, TextActionPosition } from '../types';

export function usePDFState(url?: string) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [textActionPosition, setTextActionPosition] = useState<TextActionPosition | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [searchPopoverOpen, setSearchPopoverOpen] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url) {
      console.log('PDFViewer: URL changed to:', url);
      
      // Reset state and start loading
      setLoading(true);
      setError(null);
      setPageNumber(1);
      setNumPages(0);
      
      // Test PDF URL accessibility with better error handling
      const testPDFAccess = async () => {
        try {
          console.log('PDFViewer: Testing PDF URL accessibility...');
          
          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(url, { 
            method: 'HEAD',
            mode: 'cors',
            signal: controller.signal,
            headers: {
              'Accept': 'application/pdf,*/*'
            }
          });
          
          clearTimeout(timeoutId);
          console.log('PDFViewer: PDF URL test response:', response.status, response.statusText);
          
          if (!response.ok) {
            throw new Error(`PDF not accessible: ${response.status} ${response.statusText}`);
          }
          
          console.log('PDFViewer: PDF URL is accessible, content-type:', response.headers.get('content-type'));
          
        } catch (error) {
          console.error('PDFViewer: PDF URL accessibility test failed:', error);
          
          // Don't fail immediately on HEAD request failure, let react-pdf try
          if (error instanceof Error && error.name === 'AbortError') {
            console.warn('PDFViewer: URL test timed out, proceeding with PDF load attempt');
          } else {
            console.warn('PDFViewer: URL test failed, but proceeding with PDF load attempt:', error);
          }
        }
      };
      
      testPDFAccess();
    }
  }, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('PDFViewer: Document loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDFViewer: Document load error:', error);
    console.error('PDFViewer: Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      toString: error.toString()
    });
    
    // Provide more specific error messages with better diagnostics
    let errorMessage = 'Failed to load PDF';
    const errorStr = error.toString().toLowerCase();
    
    if (error.message.includes('404') || error.message.includes('Not Found') || errorStr.includes('404')) {
      errorMessage = 'PDF file not found. The file may have been moved or deleted.';
    } else if (error.message.includes('CORS') || errorStr.includes('cors')) {
      errorMessage = 'PDF access blocked by security policy. The file cannot be loaded from this location.';
    } else if (error.message.includes('worker') || errorStr.includes('worker')) {
      errorMessage = 'PDF processing failed. Please refresh the page and try again.';
    } else if (error.message.includes('timeout') || errorStr.includes('timeout')) {
      errorMessage = 'PDF loading timed out. The file may be too large or the connection is slow.';
    } else if (error.message.includes('network') || errorStr.includes('network')) {
      errorMessage = 'Network error while loading PDF. Please check your connection and try again.';
    } else if (error.message.includes('Invalid PDF') || errorStr.includes('invalid')) {
      errorMessage = 'The file is not a valid PDF document or is corrupted.';
    } else if (errorStr.includes('unexpected') || errorStr.includes('syntax')) {
      errorMessage = 'PDF format error. The file may be corrupted or in an unsupported format.';
    } else {
      errorMessage = `Failed to load PDF: ${error.message}`;
    }
    
    // Log additional diagnostic info
    console.error('PDFViewer: Final error message:', errorMessage);
    
    setError(errorMessage);
    setLoading(false);
  }, []);

  const onDocumentLoadProgress = useCallback((progressData: { loaded: number; total: number }) => {
    console.log('PDFViewer: Loading progress:', `${progressData.loaded}/${progressData.total}`);
  }, []);

  return {
    // State
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
    
    // Setters
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
    
    // Callbacks
    onDocumentLoadSuccess,
    onDocumentLoadError,
    onDocumentLoadProgress,
  };
}
