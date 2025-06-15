
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Edit, Trash2, Share, ExternalLink } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ContentItem } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { ContentTableRowProps } from './types';

export function ContentTableRow({ 
  item, 
  onEdit, 
  onDelete, 
  onShare, 
  showSelectionColumn, 
  isSelected, 
  onSelect 
}: ContentTableRowProps) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    // Always navigate to ContentPage, not directly to file URLs
    navigate(`/content/${item.id}`);
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'default';
      case 'video':
        return 'secondary';
      case 'recording':
        return 'outline';
      case 'youtube':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {showSelectionColumn && (
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            aria-label={`Select ${item.title}`}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">
        <button 
          onClick={handleTitleClick}
          className="text-left hover:text-primary transition-colors cursor-pointer"
        >
          {item.title}
        </button>
      </TableCell>
      <TableCell>
        <Badge variant={getTypeBadgeVariant(item.type)}>
          {item.type.toUpperCase()}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleTitleClick}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(item)}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
