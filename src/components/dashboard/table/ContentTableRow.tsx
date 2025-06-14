
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { ContentItem } from '@/lib/types';
import { ContentTag } from './types';
import { getContentTypeIcon, getTagColor, getDisplayType } from './tableUtils';

interface ContentTableRowProps {
  item: ContentItem;
  showSelectionColumn?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export function ContentTableRow({
  item,
  showSelectionColumn,
  isSelected,
  onSelect,
  onEdit,
  onShare,
  onDelete
}: ContentTableRowProps) {
  const displayType = getDisplayType(item.type);
  const contentTags = item.metadata?.contentTags || [];
  const uploadDate = new Date(item.created_at).toLocaleDateString();

  return (
    <tr className="border-b border-dashboard-separator hover:bg-dashboard-card-hover transition-colors duration-200">
      {showSelectionColumn && (
        <td className="py-6 px-4">
          <div
            onClick={onSelect}
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
              isSelected
                ? "bg-primary border-primary"
                : "border-muted-foreground"
            )}
          >
            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
        </td>
      )}
      <td className="py-6 px-4 text-dashboard-text font-semibold">{item.title}</td>
      <td className="py-6 px-4 text-dashboard-text text-center">{uploadDate}</td>
      <td className="py-6 px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {contentTags.map(tag => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag as ContentTag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex items-center gap-2 text-dashboard-text justify-center">
          {getContentTypeIcon(displayType)}
          <span>{displayType}</span>
        </div>
      </td>
      <td className="py-6 px-4 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
