import React, { useState } from 'react';
import { ArrowRight, Check, FileText, Video, Youtube, Mic, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      return <Video className="h-4 w-4" />;
    case 'PDF Files':
      return <FileText className="h-4 w-4" />;
    case 'Recording':
      return <Mic className="h-4 w-4" />;
    case 'Youtube URL':
      return <Youtube className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function ExamPrepStepOne({ 
  contentItems, 
  onToggleSelectAll, 
  onToggleItemSelection, 
  onNext 
}: ExamPrepStepOneProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(contentItems.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = contentItems.slice(startIndex, endIndex);
  
  const selectedCount = contentItems.filter(item => item.isSelected).length;

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
        Choose contents to have for your exam below
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        An exam will be generated based on these contents
      </p>
      
      <div className="mb-4">
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 font-medium text-foreground text-base w-10">
                  <div
                    onClick={onToggleSelectAll}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
                      selectedCount === contentItems.length 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedCount === contentItems.length && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-medium text-foreground text-base">Title</th>
                <th className="text-center py-4 px-4 font-medium text-foreground text-base">Upload Date</th>
                <th className="text-center py-4 px-4 font-medium text-foreground text-base">Type</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-border hover:bg-accent/50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div
                      onClick={() => onToggleItemSelection(item.id)}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
                        item.isSelected 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground"
                      )}
                    >
                      {item.isSelected && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-foreground font-medium">{item.title}</td>
                  <td className="py-4 px-4 text-foreground text-center">{item.uploadedDate}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 justify-center text-foreground">
                      {getContentTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, contentItems.length)} of {contentItems.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={cn(
                "h-8 w-8 p-0",
                currentPage === page 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent hover:text-primary"
              )}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Selected {selectedCount} of {contentItems.length} items
        </div>

        <Button 
          onClick={onNext}
          disabled={selectedCount === 0}
          className={cn(
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors px-4",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
