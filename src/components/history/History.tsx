
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryHeader } from './HistoryHeader';
import { HistorySearch } from './HistorySearch';
import { HistoryFilter } from './HistoryFilter';
import { HistoryTable, HistoryItem } from './HistoryTable';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { historyItems } from './historyData';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter history items based on search query and type filter
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.room.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleItemClick = (id: string) => {
    console.log(`Navigating to item: ${id}`);
  };

  const handleClearHistory = () => {
    toast.info("History cleared successfully");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <HistoryHeader onClearHistory={handleClearHistory} />
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <HistorySearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
          
          <HistoryFilter 
            typeFilter={typeFilter} 
            onFilterChange={setTypeFilter} 
          />
        </div>
        
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              View and manage your recent interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <HistoryTable 
              items={paginatedItems} 
              onItemClick={handleItemClick} 
            />
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isFirstPage) handlePageChange(currentPage - 1);
                    }}
                    className={`${isFirstPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-foreground hover:bg-accent`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                      className="text-foreground hover:bg-accent"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isLastPage) handlePageChange(currentPage + 1);
                    }}
                    className={`${isLastPage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-foreground hover:bg-accent`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
