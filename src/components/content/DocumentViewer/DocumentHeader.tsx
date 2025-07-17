import React from 'react';
import { ContentData } from '@/pages/ContentPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Columns2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentHeaderProps {
  contentData: ContentData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: number;
  currentSearchIndex: number;
  onSearchNavigate: (direction: 'next' | 'prev') => void;
  onSearchClear: () => void;
  isSearching: boolean;
  onDownload: () => void;
  onExpandToggle: () => void;
  isExpanded: boolean;
}

export function DocumentHeader({
  contentData,
  searchQuery,
  onSearchChange,
  searchResults,
  currentSearchIndex,
  onSearchNavigate,
  onSearchClear,
  isSearching,
  onDownload,
  onExpandToggle,
  isExpanded
}: DocumentHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
      {/* Left: Document Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Columns2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-foreground truncate">
            {contentData.title || contentData.filename || 'Document'}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {contentData.type?.toUpperCase()} Document
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex items-center gap-2 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search document..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-7 pr-8 h-8 text-xs"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="flex items-center gap-1">
            {isSearching ? (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            ) : searchResults > 0 ? (
              <>
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  {currentSearchIndex + 1} of {searchResults}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchNavigate('prev')}
                  disabled={searchResults === 0}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchNavigate('next')}
                  disabled={searchResults === 0}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Badge variant="outline" className="text-xs px-2 py-0">
                No results
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 flex-1 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          className="h-8 px-3 text-xs"
          disabled={!contentData.url}
        >
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExpandToggle}
          className="h-8 w-8 p-0"
          title={isExpanded ? "Collapse toolbar" : "Expand toolbar"}
        >
          {isExpanded ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
}