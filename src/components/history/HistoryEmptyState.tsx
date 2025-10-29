import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
interface HistoryEmptyStateProps {
  hasSearch?: boolean;
  searchQuery?: string;
  onClearFilters?: () => void;
  viewMode?: 'grid' | 'table';
}
export function HistoryEmptyState({
  hasSearch = false,
  searchQuery = '',
  onClearFilters,
  viewMode = 'table'
}: HistoryEmptyStateProps) {
  const navigate = useNavigate();
  if (hasSearch) {
    return <div className="flex flex-col items-center justify-center py-16 px-4">
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No results found
        </h3>
        <p className="text-muted-foreground text-center mb-4 max-w-md">
          We couldn't find any history items matching "{searchQuery}". Try adjusting your search or filters.
        </p>
        
      </div>;
  }
  return <div className="flex flex-col items-center justify-center py-16 px-4">
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No history yet
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">Upload files, create notes, or add content to get started!</p>
      <Button onClick={() => navigate('/dashboard')} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Content
      </Button>
    </div>;
}