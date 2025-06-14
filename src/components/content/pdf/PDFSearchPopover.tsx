
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchResult } from './types';

interface PDFSearchPopoverProps {
  searchTerm: string;
  searchResults: SearchResult[];
  currentSearchIndex: number;
  isSearching: boolean;
  searchPopoverOpen: boolean;
  loading: boolean;
  error: string | null;
  onSearch: () => void;
  onSearchTermChange: (term: string) => void;
  onClearSearch: () => void;
  onNavigateToSearchResult: (index: number) => void;
  onSearchPopoverOpenChange: (open: boolean) => void;
}

export function PDFSearchPopover({
  searchTerm,
  searchResults,
  currentSearchIndex,
  isSearching,
  searchPopoverOpen,
  loading,
  error,
  onSearch,
  onSearchTermChange,
  onClearSearch,
  onNavigateToSearchResult,
  onSearchPopoverOpenChange
}: PDFSearchPopoverProps) {
  return (
    <Popover open={searchPopoverOpen} onOpenChange={onSearchPopoverOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={loading || error !== null}
          className={cn(
            "text-dashboard-text dark:text-dashboard-text hover:bg-dashboard-separator/20 dark:hover:bg-white/10 disabled:opacity-50 h-8 w-8 p-0 md:h-9 md:w-9",
            searchResults.length > 0 && "bg-dashboard-separator/20 dark:bg-white/10"
          )}
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-dashboard-card dark:bg-dashboard-card border-dashboard-separator dark:border-dashboard-separator" side="bottom" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-dashboard-text dark:text-dashboard-text">Search PDF</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter search term..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="bg-dashboard-bg dark:bg-dashboard-bg border-dashboard-separator dark:border-dashboard-separator text-dashboard-text dark:text-dashboard-text"
            />
            <Button
              size="sm"
              onClick={onSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="bg-primary hover:bg-primary/90"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
            {searchResults.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClearSearch}
                className="border-dashboard-separator dark:border-dashboard-separator"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  {searchResults.length} results found
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateToSearchResult(currentSearchIndex - 1)}
                    disabled={currentSearchIndex <= 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <span className="text-xs px-2 py-1">
                    {currentSearchIndex + 1} / {searchResults.length}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigateToSearchResult(currentSearchIndex + 1)}
                    disabled={currentSearchIndex >= searchResults.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-32">
                <div className="space-y-1">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => onNavigateToSearchResult(index)}
                      className={cn(
                        "p-2 rounded cursor-pointer text-sm transition-colors",
                        index === currentSearchIndex
                          ? "bg-dashboard-separator/20 dark:bg-white/10"
                          : "hover:bg-dashboard-separator/10 dark:hover:bg-white/5"
                      )}
                    >
                      <div className="font-medium text-dashboard-text dark:text-dashboard-text">
                        Page {result.pageNumber}
                      </div>
                      <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary truncate">
                        {result.context}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
