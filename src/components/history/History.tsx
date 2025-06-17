
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryHeader } from './HistoryHeader';
import { HistorySearch } from './HistorySearch';
import { HistoryFilter } from './HistoryFilter';
import { HistoryTable } from './HistoryTable';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';
import { Room } from '@/lib/types';
import { useContent } from '@/hooks/useContent';
import { useRooms } from '@/hooks/useRooms';
import { Loader2 } from 'lucide-react';
import { ContentItem } from '@/hooks/useContent';

const ITEMS_PER_PAGE = 10;

interface HistoryProps {
  rooms?: Room[];
  onAddRoom?: () => void;
  onEditRoom?: (id: string, newName: string) => void;
  onDeleteRoom?: (id: string) => void;
}

export function History({
  rooms = [],
  onAddRoom,
  onEditRoom,
  onDeleteRoom
}: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { content, loading, onDeleteContent } = useContent();
  const { rooms: allRooms } = useRooms();

  // Filter content based on search query and type filter
  const filteredContent = useMemo(() => {
    return content.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [content, searchQuery, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContent.length / ITEMS_PER_PAGE);

  const handleClearHistory = async () => {
    try {
      // Delete all content items
      await Promise.all(content.map(item => onDeleteContent(item.id)));
      toast.success("History cleared successfully");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalPages === 0;

  const handleAddToRoom = async (contentId: string, roomId: string) => {
    try {
      // This would need to be implemented with the content update function
      console.log(`Adding content ${contentId} to room ${roomId}`);
      toast.success("Content added to room");
    } catch (error) {
      toast.error("Failed to add content to room");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteContent(id);
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleShare = (item: ContentItem) => {
    // Implement share functionality
    console.log('Sharing item:', item);
    toast.success("Share link copied to clipboard");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <HistoryHeader onClearHistory={handleClearHistory} />
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <HistorySearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <HistoryFilter typeFilter={typeFilter} onFilterChange={setTypeFilter} />
        </div>
        
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              View and manage your recent interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <HistoryTable 
              data={filteredContent}
              searchTerm={searchQuery}
              filterType={typeFilter}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              rooms={allRooms}
              onAddToRoom={handleAddToRoom}
              onDelete={handleDelete}
              onShare={handleShare}
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
