import React, { useState } from 'react';
import { ArrowRight, Check, FileText, Video, Youtube, Mic, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ContentItem } from './types';

interface ExamPrepStepOneProps {
  contentItems: ContentItem[];
  onToggleSelectAll: () => void;
  onToggleItemSelection: (id: string) => void;
  onNext: () => void;
}

// Helper function to get the icon for each content type
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'Video':
      return <Video className="h-4 w-4 text-primary" />;
    case 'PDF Files':
      return <FileText className="h-4 w-4 text-primary" />;
    case 'Recording':
      return <Mic className="h-4 w-4 text-primary" />;
    case 'Youtube URL':
      return <Youtube className="h-4 w-4 text-primary" />;
    default:
      return <FileText className="h-4 w-4 text-primary" />;
  }
};

export function ExamPrepStepOne({ 
  contentItems, 
  onToggleSelectAll, 
  onToggleItemSelection, 
  onNext 
}: ExamPrepStepOneProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Display 4 items per page
  const selectedCount = contentItems.filter(item => item.isSelected).length;
  const isAllSelected = selectedCount === contentItems.length;

  // Filter items based on search query
  const filteredItems = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">
          Choose contents to generate an exam from below
        </h2>
      </div>

      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content by title or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <div 
          onClick={onToggleSelectAll}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200",
            isAllSelected 
              ? "border-primary bg-primary" 
              : "border-muted-foreground hover:border-primary/50"
          )}>
            {isAllSelected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="text-sm text-muted-foreground">
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {currentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onToggleItemSelection(item.id)}
            className={cn(
              "group relative p-4 rounded-lg border transition-all duration-200",
              "hover:border-primary/50 hover:shadow-sm",
              item.isSelected 
                ? "border-primary bg-primary/5" 
                : "border-border hover:bg-accent/50"
            )}
          >
            {/* Selection Indicator */}
            <div className={cn(
              "absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center",
              "transition-colors duration-200",
              item.isSelected 
                ? "border-primary bg-primary" 
                : "border-muted-foreground group-hover:border-primary/50"
            )}>
              {item.isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>

            {/* Content Type Badge */}
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2">
                {getContentTypeIcon(item.type)}
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.type}
              </span>
            </div>

            {/* Content Details */}
            <div>
              <h3 className="text-base font-semibold text-foreground line-clamp-2">
                {item.title}
              </h3>
            </div>

            {/* Hover Overlay */}
            <div className={cn(
              "absolute inset-0 rounded-lg bg-primary/5 opacity-0 transition-opacity duration-200",
              "group-hover:opacity-100"
            )} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No content found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className={cn(
                "h-8 w-8",
                currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-6">
        <div className="text-sm text-muted-foreground">
          Selected {selectedCount} of {contentItems.length} items
        </div>
        <Button 
          onClick={onNext}
          disabled={selectedCount === 0}
          className={cn(
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors px-6",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
