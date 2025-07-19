import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Book, List } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { cn } from '@/lib/utils';

export function DocumentSidebar() {
  const {
    isSidebarOpen,
    tableOfContents,
    currentPage,
    setCurrentPage,
  } = useDocumentViewer();

  if (!isSidebarOpen) return null;

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-sm text-gray-800">Table of Contents</h3>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {tableOfContents.length > 0 ? (
            tableOfContents.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(item.page)}
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-3 hover:bg-blue-50",
                  currentPage === item.page && "bg-blue-100 text-blue-800 border-l-2 border-blue-600"
                )}
              >
                <div className="flex items-start gap-3 w-full">
                  <FileText className="h-4 w-4 shrink-0 mt-0.5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-gray-800">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Page {item.page}
                    </div>
                  </div>
                </div>
              </Button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              <Book className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No table of contents available</p>
              <p className="text-xs mt-1">Contents will appear here when document is processed</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}