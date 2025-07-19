import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
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
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-3 border-b border-border">
        <h3 className="font-medium text-sm text-foreground">Table of Contents</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {tableOfContents.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(item.page)}
              className={cn(
                "w-full justify-start text-left h-auto py-2 px-3",
                currentPage === item.page && "bg-accent text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <FileText className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Page {item.page}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}