import { useState, useCallback, useMemo } from 'react';
import { ContentData } from '@/pages/ContentPage';

export function useDocumentViewer(contentData: ContentData) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'single' | 'continuous' | 'two-page'>('continuous');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate search results
  const searchResults = useMemo(() => {
    if (!searchQuery || !contentData.text) return 0;
    
    const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = contentData.text.match(regex);
    return matches ? matches.length : 0;
  }, [searchQuery, contentData.text]);

  // Navigate through search results
  const navigateSearch = useCallback((direction: 'next' | 'prev') => {
    if (searchResults === 0) return;
    
    if (direction === 'next') {
      setCurrentSearchIndex((prev) => 
        prev >= searchResults - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentSearchIndex((prev) => 
        prev <= 0 ? searchResults - 1 : prev - 1
      );
    }
  }, [searchResults]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentSearchIndex(0);
  }, []);

  // Handle text selection
  const handleTextSelect = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  // Extract text from document (placeholder for future implementation)
  const extractText = useCallback(async () => {
    if (contentData.text) return; // Already have text
    
    setIsLoading(true);
    setError(null);
    
    try {
      // This would be implemented based on document type
      // For now, we'll just mark as complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setIsLoading(false);
    }
  }, [contentData]);

  // Get highlighted text for current search
  const highlightedText = useMemo(() => {
    if (!searchQuery || !contentData.text) return undefined;
    
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return contentData.text.replace(regex, '<mark>$1</mark>');
  }, [searchQuery, contentData.text]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    zoomLevel,
    setZoomLevel,
    viewMode,
    setViewMode,
    isSearching,
    highlightedText,
    navigateSearch,
    clearSearch,
    handleTextSelect,
    extractText,
    isLoading,
    error,
    selectedText
  };
}