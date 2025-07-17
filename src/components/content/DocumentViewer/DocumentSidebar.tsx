import React, { useState } from 'react';
import { BookOpen, List, Info, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDocumentViewerContext } from './DocumentViewerContext';

export default function DocumentSidebar() {
  const [activeTab, setActiveTab] = useState('outline');
  const [filter, setFilter] = useState('');
  
  const { document, goToPage, currentPage } = useDocumentViewerContext();
  
  // Mock table of contents data - in a real implementation this would come from the document
  const tableOfContents = [
    { id: '1', title: 'Introduction', page: 1, level: 1 },
    { id: '2', title: 'Getting Started', page: 3, level: 1 },
    { id: '2.1', title: 'Installation', page: 3, level: 2 },
    { id: '2.2', title: 'Configuration', page: 5, level: 2 },
    { id: '3', title: 'Core Concepts', page: 8, level: 1 },
    { id: '3.1', title: 'Components', page: 8, level: 2 },
    { id: '3.2', title: 'State Management', page: 12, level: 2 },
    { id: '3.3', title: 'Routing', page: 15, level: 2 },
    { id: '4', title: 'Advanced Topics', page: 18, level: 1 },
    { id: '5', title: 'API Reference', page: 25, level: 1 },
    { id: '6', title: 'Troubleshooting', page: 30, level: 1 },
  ];
  
  // Mock bookmarks data
  const bookmarks = [
    { id: '1', title: 'Important Configuration', page: 6, addedAt: new Date() },
    { id: '2', title: 'API Key Setup', page: 27, addedAt: new Date() },
  ];
  
  // Mock document details
  const documentDetails = {
    title: document.title,
    author: 'Document Author',
    created: 'May 15, 2023',
    modified: 'July 17, 2025',
    size: '2.4 MB',
    pages: document.totalPages || 32,
  };
  
  // Filter function for search
  const filterItems = (items: any[]) => {
    if (!filter) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
  };
  
  const filteredTableOfContents = filterItems(tableOfContents);
  const filteredBookmarks = filterItems(bookmarks);
  
  // Handler for navigation
  const handleNavigate = (page: number) => {
    goToPage(page);
  };

  return (
    <div className="w-64 border-r border-border bg-card h-full flex flex-col">
      <Tabs defaultValue="outline" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 p-1 m-2">
          <TabsTrigger value="outline" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            Outline
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="text-xs">
            <List className="h-3 w-3 mr-1" />
            Bookmarks
          </TabsTrigger>
          <TabsTrigger value="details" className="text-xs">
            <Info className="h-3 w-3 mr-1" />
            Details
          </TabsTrigger>
        </TabsList>
        
        <div className="px-3 pt-1 pb-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="outline" className="mt-0 p-2">
            {filteredTableOfContents.length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {filteredTableOfContents
                  .filter(item => item.level === 1)
                  .map(chapter => {
                    const subItems = filteredTableOfContents.filter(
                      item => item.id.startsWith(chapter.id + '.') && item.level === 2
                    );
                    
                    return (
                      <AccordionItem key={chapter.id} value={chapter.id} className="border-b border-border">
                        <AccordionTrigger className="py-2 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2 text-left">
                            <span className="text-sm font-medium truncate">{chapter.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">{chapter.page}</span>
                          </div>
                        </AccordionTrigger>
                        
                        <AccordionContent>
                          <div className="space-y-1 pl-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleNavigate(chapter.page)}
                              className={`w-full justify-between h-7 text-xs px-2 ${
                                currentPage === chapter.page ? 'bg-accent text-accent-foreground' : ''
                              }`}
                            >
                              <span className="truncate text-left">{chapter.title}</span>
                              <span className="text-xs text-muted-foreground ml-2">{chapter.page}</span>
                            </Button>
                            
                            {subItems.map(subItem => (
                              <Button
                                key={subItem.id}
                                variant="ghost"
                                size="sm"
                                onClick={() => handleNavigate(subItem.page)}
                                className={`w-full justify-between h-7 text-xs px-2 ${
                                  currentPage === subItem.page ? 'bg-accent text-accent-foreground' : ''
                                }`}
                              >
                                <span className="truncate text-left">{subItem.title}</span>
                                <span className="text-xs text-muted-foreground ml-2">{subItem.page}</span>
                              </Button>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
              </Accordion>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No outline items found.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarks" className="mt-0 p-2">
            {filteredBookmarks.length > 0 ? (
              <div className="space-y-2">
                {filteredBookmarks.map(bookmark => (
                  <Button
                    key={bookmark.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleNavigate(bookmark.page)}
                    className={`w-full justify-between h-auto py-2 px-3 ${
                      currentPage === bookmark.page ? 'bg-accent text-accent-foreground' : ''
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{bookmark.title}</span>
                      <span className="text-xs text-muted-foreground">
                        Page {bookmark.page} • {bookmark.addedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                No bookmarks found.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="mt-0 p-3">
            <div className="space-y-3">
              {Object.entries(documentDetails).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}