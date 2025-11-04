import React, { useState, useEffect } from 'react';
import { 
  PanelLeft, 
  Search, 
  Moon, 
  Volume2, 
  ChevronDown,
  RotateCw, 
  Download, 
  Maximize,
  X,
  ChevronUp,
} from 'lucide-react';
import { useUnifiedDocument } from './UnifiedDocumentContext';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnhancedDocumentToolbarProps {
  onDownload?: () => void;
  contentData?: {
    url?: string;
    filename?: string;
  };
}

export function EnhancedDocumentToolbar({ onDownload, contentData }: EnhancedDocumentToolbarProps) {
  const {
    currentPage,
    totalPages,
    zoom,
    isFullscreen,
    searchTerm,
    searchResults,
    currentSearchIndex,
    isSearchOpen,
    isThumbnailsOpen,
    toggleFullscreen,
    toggleSearch,
    toggleThumbnails,
    setSearchTerm,
    performSearch,
    nextSearchResult,
    previousSearchResult,
    rotateClockwise,
    nextPage,
    previousPage,
    setZoom,
    setCurrentPage,
  } = useUnifiedDocument();

  const { toggleTheme } = useTheme();

  const [pageInputValue, setPageInputValue] = useState(currentPage.toString());
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      performSearch(localSearchTerm);
    }
  };

  // Debounced search - only search after user stops typing for 500ms
  useEffect(() => {
    if (localSearchTerm.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        performSearch(localSearchTerm);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (localSearchTerm.trim().length === 0) {
      // Clear search when input is empty
      setSearchTerm('');
    }
  }, [localSearchTerm, performSearch, setSearchTerm]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (contentData?.url) {
      window.open(contentData.url, '_blank');
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  React.useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-neutral-800/50 border-b border-primary/10 p-2 py-[4.5px] flex items-center text-sm text-neutral-600 dark:text-neutral-300 gap-2 rounded-t-lg">
      {/* Left Section - View Controls */}
      <button
        className="px-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 py-1 rounded-full"
        title="Toggle Thumbnails"
        onClick={toggleThumbnails}
      >
        <PanelLeft className="w-4 h-4" stroke="#525252" />
      </button>

      <button
        className="px-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 py-1 rounded-full ml-[-8px]"
        title="Toggle Search"
        onClick={toggleSearch}
      >
        <Search className="w-4 h-4" stroke="#525252" />
      </button>

      {isSearchOpen && (
        <div className="flex items-center gap-1">
          <form onSubmit={handleSearch} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="bg-white dark:bg-neutral-800 rounded-lg px-2 py-1 border dark:border-neutral-700 text-xs w-32"
              autoFocus
            />
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground px-1">
                  {currentSearchIndex + 1} / {searchResults.length}
                </span>
                <button
                  type="button"
                  onClick={previousSearchResult}
                  className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={nextSearchResult}
                  className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            )}
          </form>
          <button
            onClick={toggleSearch}
            className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      <button
        className="px-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 py-1 rounded-full ml-[-8px]"
        title="Switch PDF to dark theme"
        onClick={toggleTheme}
      >
        <Moon className="w-4 h-4" stroke="#525252" />
      </button>

      <button
        className="px-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 py-1 rounded-full ml-[-8px]"
        title="Read aloud"
      >
        <Volume2 className="w-4 h-4" stroke="#525252" />
      </button>

      <span className="flex-grow"></span>

      {/* Center Section - Page Navigation */}
      <div className="flex items-center gap-1">
        <input
          className="bg-white dark:bg-neutral-800 rounded-lg px-0 py-1 border dark:border-neutral-700 text-center"
          type="text"
          value={pageInputValue}
          onChange={handlePageInputChange}
          onBlur={handlePageInputBlur}
          onKeyDown={handlePageInputKeyDown}
          style={{ width: '2.5em', textAlign: 'center' }}
        />
        <span> / </span>
        <div>{totalPages}</div>
      </div>

      <div className="h-6 w-[1px] bg-neutral-300 dark:bg-neutral-700 ml-1.5"></div>

      {/* Zoom Dropdown */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 px-2 py-1 text-sm bg-white dark:bg-neutral-800 rounded-lg border dark:border-neutral-700">
              {zoom === 100 ? 'Page fit' : `${zoom}%`}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={() => setZoom(50)}>50%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(75)}>75%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(100)}>Page fit (100%)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(125)}>125%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(150)}>150%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setZoom(200)}>200%</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <span className="flex-grow"></span>

      {/* Right Section - Action Controls */}
      <div className="flex items-center gap-2">
        <button
          className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 rounded-full"
          title="Rotate 90° Clockwise"
          onClick={rotateClockwise}
        >
          <RotateCw className="w-4 h-4" stroke="#525252" />
        </button>

        <button
          className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 rounded-full"
          title="Download PDF"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" stroke="#525252" />
        </button>

        <button
          className="p-1 hover:bg-neutral-300 dark:hover:bg-neutral-700 hover:text-neutral-800/50 dark:hover:text-neutral-100 rounded-full"
          title="Full Screen"
          onClick={toggleFullscreen}
        >
          <Maximize className="w-4 h-4" stroke="#525252" />
        </button>
      </div>
    </div>
  );
}
