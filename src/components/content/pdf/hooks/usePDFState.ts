
import { useState, useCallback, useRef, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { SearchResult, TextActionPosition } from '../types';

// Configure PDF.js worker with fallback
try {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
} catch (error) {
  console.warn('Local PDF worker not found, using CDN fallback');
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';
}

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
      setLoading(true);
      setError(null);
      setPageNumber(1);
      setNumPages(0);
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
  };
}
