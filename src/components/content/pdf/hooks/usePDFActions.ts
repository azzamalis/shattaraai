
import { useCallback } from 'react';
import { SearchResult } from '../types';

interface UsePDFActionsProps {
  pageNumber: number;
  numPages: number;
  scale: number;
  url?: string;
  searchTerm: string;
  searchResults: SearchResult[];
  setPageNumber: (page: number) => void;
  setScale: (scale: number) => void;
  setRotation: (rotation: React.SetStateAction<number>) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setCurrentSearchIndex: (index: number) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSearchPopoverOpen: (open: boolean) => void;
}

export function usePDFActions({
  pageNumber,
  numPages,
  scale,
  url,
  searchTerm,
  searchResults,
  setPageNumber,
  setScale,
  setRotation,
  setSearchResults,
  setCurrentSearchIndex,
  setIsSearching,
  setSearchTerm,
  setSearchPopoverOpen,
}: UsePDFActionsProps) {
  const goToPrevPage = useCallback(() => {
    setPageNumber(Math.max(1, pageNumber - 1));
  }, [pageNumber, setPageNumber]);

  const goToNextPage = useCallback(() => {
    setPageNumber(Math.min(numPages, pageNumber + 1));
  }, [pageNumber, numPages, setPageNumber]);

  const handleZoomIn = useCallback(() => {
    setScale(Math.min(3.0, scale + 0.25));
  }, [scale, setScale]);

  const handleZoomOut = useCallback(() => {
    setScale(Math.max(0.5, scale - 0.25));
  }, [scale, setScale]);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, [setRotation]);

  const handleDownload = useCallback(() => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      link.click();
    }
  }, [url]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() || !url) return;
    
    setIsSearching(true);
    try {
      // Simulate search functionality - in a real implementation, you'd use PDF.js search API
      const results = [];
      for (let i = 1; i <= numPages; i++) {
        // Simulated search results
        if (Math.random() > 0.7) { // Random chance for demonstration
          results.push({
            pageNumber: i,
            text: searchTerm,
            context: `...text containing ${searchTerm}...`
          });
        }
      }
      setSearchResults(results);
      setCurrentSearchIndex(0);
      
      // Navigate to first result if found
      if (results.length > 0) {
        setPageNumber(results[0].pageNumber);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, url, numPages, setIsSearching, setSearchResults, setCurrentSearchIndex, setPageNumber]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setCurrentSearchIndex(0);
    setSearchPopoverOpen(false);
  }, [setSearchTerm, setSearchResults, setCurrentSearchIndex, setSearchPopoverOpen]);

  const navigateToSearchResult = useCallback((index: number) => {
    if (index >= 0 && index < searchResults.length) {
      setCurrentSearchIndex(index);
      setPageNumber(searchResults[index].pageNumber);
    }
  }, [searchResults, setCurrentSearchIndex, setPageNumber]);

  return {
    goToPrevPage,
    goToNextPage,
    handleZoomIn,
    handleZoomOut,
    handleRotate,
    handleDownload,
    handleSearch,
    clearSearch,
    navigateToSearchResult,
  };
}
