
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HistoryHeader } from './HistoryHeader';
import { HistorySearch } from './HistorySearch';
import { HistoryFilter } from './HistoryFilter';
import { HistoryTable, HistoryItem } from './HistoryTable';
import { HistoryGrid } from './HistoryGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Room } from '@/lib/types';
import { useContent } from '@/hooks/useContent';
import { useRooms } from '@/hooks/useRooms';
import { Loader2, LayoutGrid, List } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'grid' | 'table'>(() => {
    const saved = localStorage.getItem('historyViewMode');
    return (saved as 'grid' | 'table') || 'grid';
  });
  const navigate = useNavigate();

  // Persist view mode preference
  useEffect(() => {
    localStorage.setItem('historyViewMode', viewMode);
  }, [viewMode]);

  const itemsPerPage = viewMode === 'grid' ? 20 : 10;

  const { content, loading, deleteContent, updateContent } = useContent();
  const { rooms: allRooms } = useRooms();

  // Convert content items to history items
  const historyItems: HistoryItem[] = useMemo(() => {
    return content.map(item => {
      const room = allRooms.find(r => r.id === item.room_id);
      return {
        id: item.id,
        title: item.title,
        room: room?.name || 'No Room',
        date: new Date(item.created_at),
        type: item.type,
        url: item.url
      };
    });
  }, [content, allRooms]);

  // Filter history items based on search query and type filter
  const filteredItems = useMemo(() => {
    return historyItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.room.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [historyItems, searchQuery, typeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleItemClick = (id: string) => {
    const item = content.find(c => c.id === id);
    if (item) {
      navigate(`/content/${item.id}?type=${item.type}`);
    }
  };

  const handleClearHistory = async () => {
    try {
      // Delete all content items
      await Promise.all(content.map(item => deleteContent(item.id)));
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
      await updateContent(contentId, { room_id: roomId });
      const room = allRooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContent(id);
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
    }
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <HistoryFilter typeFilter={typeFilter} onFilterChange={setTypeFilter} />
          </div>
        </div>
        
        {viewMode === 'grid' ? (
          <HistoryGrid
            items={paginatedItems}
            rooms={allRooms}
            onItemClick={handleItemClick}
            onAddToRoom={handleAddToRoom}
            onDelete={handleDelete}
            searchQuery={searchQuery}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-foreground text-lg">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                View and manage your recent interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <HistoryTable 
                items={paginatedItems} 
                onItemClick={handleItemClick} 
                rooms={allRooms} 
                onAddToRoom={handleAddToRoom} 
                onDelete={handleDelete}
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
              />
            </CardContent>
          </Card>
        )}

        {/* Pagination - Only show in table view */}
        {viewMode === 'table' && totalPages > 0 && (
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
