
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EditContentModal } from '@/components/dashboard/modals/edit-content-modal';
import { DeleteModal } from '@/components/dashboard/modals/delete-modal';
import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/contexts/ContentContext';
import { ContentItem } from '@/hooks/useContent';

interface HistoryTableProps {
  data: ContentItem[];
  searchTerm: string;
  filterType: string;
  currentPage: number;
  itemsPerPage: number;
}

export function HistoryTable({ data, searchTerm, filterType, currentPage, itemsPerPage }: HistoryTableProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateContent, deleteContent } = useContent();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleRowClick = (item: ContentItem) => {
    // Always navigate to ContentPage for all content types
    navigate(`/content/${item.id}`);
  };

  const handleEditClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    setSelectedContent(item);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    setSelectedContent(item);
    setDeleteModalOpen(true);
  };

  const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleEditSave = async (updates: { title: string }) => {
    if (selectedContent) {
      await updateContent(selectedContent.id, updates);
      setEditModalOpen(false);
      setSelectedContent(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedContent) {
      await deleteContent(selectedContent.id);
      setDeleteModalOpen(false);
      setSelectedContent(null);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'pdf': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'video': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'audio_file': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'youtube': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'website': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'text': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'recording': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
      'live_recording': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground font-medium">Title</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Created</TableHead>
              <TableHead className="text-muted-foreground font-medium">Modified</TableHead>
              <TableHead className="text-muted-foreground font-medium w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer hover:bg-muted/5 border-border transition-colors"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="font-medium text-foreground py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm">{item.title}</span>
                      {item.filename && item.filename !== item.title && (
                        <span className="text-xs text-muted-foreground">{item.filename}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="secondary" className={`${getTypeColor(item.type)} border-0 font-medium`}>
                    {item.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground py-4 text-sm">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="text-muted-foreground py-4 text-sm">
                  {formatDate(item.updated_at)}
                </TableCell>
                <TableCell className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-border">
                      {item.url && (item.type === 'youtube' || item.type === 'website') && (
                        <DropdownMenuItem
                          onClick={(e) => handleExternalLinkClick(e, item.url!)}
                          className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => handleEditClick(e, item)}
                        className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => handleDeleteClick(e, item)}
                        className="hover:bg-accent hover:text-accent-foreground cursor-pointer text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedContent && (
        <>
          <EditContentModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            content={selectedContent}
            onSave={handleEditSave}
          />
          <DeleteModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            type="content"
            itemToDelete={{
              id: selectedContent.id,
              title: selectedContent.title,
            }}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </>
  );
}
