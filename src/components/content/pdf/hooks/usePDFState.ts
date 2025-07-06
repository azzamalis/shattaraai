
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
      
      // Test PDF URL accessibility first
      const testPDFAccess = async () => {
        try {
          console.log('PDFViewer: Testing PDF URL accessibility...');
          const response = await fetch(url, { 
            method: 'HEAD',
            mode: 'cors'
          });
          console.log('PDFViewer: PDF URL test response:', response.status, response.statusText);
          
          if (!response.ok) {
            throw new Error(`PDF not accessible: ${response.status} ${response.statusText}`);
          }
          
          // If URL is accessible, proceed with loading
          setLoading(true);
          setError(null);
          setPageNumber(1);
          setNumPages(0);
        } catch (error) {
          console.error('PDFViewer: PDF URL accessibility test failed:', error);
          setError(`PDF file is not accessible: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setLoading(false);
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
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to load PDF';
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      errorMessage = 'PDF file not found. Please check if the file exists.';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'PDF access blocked by security policy. Try using a different PDF source.';
    } else if (error.message.includes('worker')) {
      errorMessage = 'PDF processing failed. Please refresh the page and try again.';
    } else {
      errorMessage = `Failed to load PDF: ${error.message}`;
    }
    
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
