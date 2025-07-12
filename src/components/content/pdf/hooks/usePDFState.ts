
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
      console.log('DEBUG: usePDFState - URL changed, resetting state:', url);
      
      // Reset state and start loading
      setLoading(true);
      setError(null);
      setPageNumber(1);
      setNumPages(0);
      
      console.log('DEBUG: usePDFState - State reset completed for URL:', url);
      
      // Test PDF URL accessibility with better error handling
      const testPDFAccess = async () => {
        try {
          console.log('DEBUG: usePDFState - Testing PDF URL accessibility...');
          
          // Add timeout to prevent hanging
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            console.log('DEBUG: usePDFState - URL test timeout reached');
            controller.abort();
          }, 10000); // 10 second timeout
          
          const response = await fetch(url, { 
            method: 'HEAD',
            mode: 'cors',
            signal: controller.signal,
            headers: {
              'Accept': 'application/pdf,*/*'
            }
          });
          
          clearTimeout(timeoutId);
          console.log('DEBUG: usePDFState - PDF URL test response:', {
            status: response.status,
            statusText: response.statusText,
            contentType: response.headers.get('content-type'),
            contentLength: response.headers.get('content-length')
          });
          
          if (!response.ok) {
            throw new Error(`PDF not accessible: ${response.status} ${response.statusText}`);
          }
          
          console.log('DEBUG: usePDFState - PDF URL is accessible and ready for loading');
          
        } catch (error) {
          console.error('DEBUG: usePDFState - PDF URL accessibility test failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            errorName: error instanceof Error ? error.name : 'Unknown',
            url: url
          });
          
          // Don't fail immediately on HEAD request failure, let react-pdf try
          if (error instanceof Error && error.name === 'AbortError') {
            console.warn('DEBUG: usePDFState - URL test timed out, proceeding with PDF load attempt');
          } else {
            console.warn('DEBUG: usePDFState - URL test failed, but proceeding with PDF load attempt');
          }
        }
      };
      
      testPDFAccess();
    }
  }, [url]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        console.log('DEBUG: usePDFState - Container resized to width:', newWidth);
        setContainerWidth(newWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    console.log('DEBUG: usePDFState - Document loaded successfully:', {
      numPages,
      url,
      timestamp: new Date().toISOString()
    });
    setNumPages(numPages);
    setError(null);
    setLoading(false);
  }, [url]);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('DEBUG: usePDFState - Document load error occurred:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      toString: error.toString(),
      url: url,
      timestamp: new Date().toISOString()
    });
    
    // Provide more specific error messages with better diagnostics
    let errorMessage = 'Failed to load PDF';
    const errorStr = error.toString().toLowerCase();
    
    if (error.message.includes('404') || error.message.includes('Not Found') || errorStr.includes('404')) {
      errorMessage = 'PDF file not found. The file may have been moved or deleted.';
      console.error('DEBUG: usePDFState - 404 error detected for URL:', url);
    } else if (error.message.includes('CORS') || errorStr.includes('cors')) {
      errorMessage = 'PDF access blocked by security policy. The file cannot be loaded from this location.';
      console.error('DEBUG: usePDFState - CORS error detected for URL:', url);
    } else if (error.message.includes('worker') || errorStr.includes('worker')) {
      errorMessage = 'PDF processing failed. Please refresh the page and try again.';
      console.error('DEBUG: usePDFState - Worker error detected');
    } else if (error.message.includes('timeout') || errorStr.includes('timeout')) {
      errorMessage = 'PDF loading timed out. The file may be too large or the connection is slow.';
      console.error('DEBUG: usePDFState - Timeout error detected');
    } else if (error.message.includes('network') || errorStr.includes('network')) {
      errorMessage = 'Network error while loading PDF. Please check your connection and try again.';
      console.error('DEBUG: usePDFState - Network error detected');
    } else if (error.message.includes('Invalid PDF') || errorStr.includes('invalid')) {
      errorMessage = 'The file is not a valid PDF document or is corrupted.';
      console.error('DEBUG: usePDFState - Invalid PDF error detected');
    } else if (errorStr.includes('unexpected') || errorStr.includes('syntax')) {
      errorMessage = 'PDF format error. The file may be corrupted or in an unsupported format.';
      console.error('DEBUG: usePDFState - PDF format error detected');
    } else {
      errorMessage = `Failed to load PDF: ${error.message}`;
      console.error('DEBUG: usePDFState - Generic PDF error:', error.message);
    }
    
    console.error('DEBUG: usePDFState - Final error message set:', errorMessage);
    
    setError(errorMessage);
    setLoading(false);
  }, [url]);

  const onDocumentLoadProgress = useCallback((progressData: { loaded: number; total: number }) => {
    const percentage = progressData.total > 0 ? Math.round((progressData.loaded / progressData.total) * 100) : 0;
    console.log('DEBUG: usePDFState - Document loading progress:', {
      loaded: progressData.loaded,
      total: progressData.total,
      percentage: `${percentage}%`,
      url: url
    });
  }, [url]);

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
