
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PDFSidebarProps {
  numPages: number;
  pageNumber: number;
  loading: boolean;
  error: string | null;
  onPageChange: (page: number) => void;
}

export function PDFSidebar({
  numPages,
  pageNumber,
  loading,
  error,
  onPageChange
}: PDFSidebarProps) {
  return (
    <div className="w-32 md:w-48 border-r border-dashboard-separator dark:border-dashboard-separator bg-dashboard-bg dark:bg-dashboard-bg">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-dashboard-text-secondary" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-dashboard-text-secondary/60 text-sm p-2 text-center">
          Error loading thumbnails.
        </div>
      ) : (
        <ScrollArea className="h-full p-1 md:p-2">
          <div className="space-y-1 md:space-y-2">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <div
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "p-1 md:p-2 rounded cursor-pointer text-xs md:text-sm transition-colors",
                  page === pageNumber
                    ? "bg-dashboard-separator/20 dark:bg-white/10 text-dashboard-text dark:text-dashboard-text"
                    : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-separator/10 dark:hover:bg-white/5"
                )}
              >
                <span className="hidden md:inline">Page </span>{page}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
