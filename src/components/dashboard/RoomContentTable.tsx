import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, FileText, Video, Youtube, Mic, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Define the content tag types
export type ContentTag = 'Summary' | 'Notes' | 'Exams' | 'Flashcards';

// Define the content type
export type ContentType = 'Video' | 'PDF Files' | 'Recording' | 'Youtube URL';

interface ContentItem {
  id: string;
  title: string;
  uploadedDate: string;
  contentTags: ContentTag[];
  type: ContentType;
}

interface RoomContentTableProps {
  items: ContentItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  showSelectionColumn?: boolean;
  onSelect?: (id: string) => void;
  selectedItems?: string[];
}

// Helper function to get the icon for each content type
const getContentTypeIcon = (type: ContentType) => {
  switch (type) {
    case 'Video':
      return <Video className="h-4 w-4" />;
    case 'PDF Files':
      return <FileText className="h-4 w-4" />;
    case 'Recording':
      return <Mic className="h-4 w-4" />;
    case 'Youtube URL':
      return <Youtube className="h-4 w-4" />;
  }
};

// Helper function to get the color for each tag
const getTagColor = (tag: ContentTag) => {
  switch (tag) {
    case 'Summary':
      return 'bg-blue-500 text-white';
    case 'Notes':
      return 'bg-purple-500 text-white';
    case 'Exams':
      return 'bg-orange-500 text-white';
    case 'Flashcards':
      return 'bg-green-500 text-white';
  }
};

export function RoomContentTable({ 
  items, 
  onEdit, 
  onDelete, 
  onShare,
  showSelectionColumn,
  onSelect,
  selectedItems = []
}: RoomContentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col pt-8">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-dashboard-separator">
            {showSelectionColumn && (
              <th className="text-left py-4 px-4 font-medium text-dashboard-text text-base w-10">
                Select
              </th>
            )}
            <th className="text-left py-4 px-4 font-medium text-dashboard-text text-base">Title Name</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Uploaded Date</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">AI Content Tags</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Type</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr 
              key={item.id} 
              className="border-b border-dashboard-separator hover:bg-dashboard-card-hover transition-colors duration-200"
            >
              {showSelectionColumn && (
                <td className="py-6 px-4">
                  <div
                    onClick={() => onSelect?.(item.id)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors duration-200",
                      selectedItems.includes(item.id)
                        ? "bg-primary border-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedItems.includes(item.id) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </td>
              )}
              <td className="py-6 px-4 text-dashboard-text font-semibold">{item.title}</td>
              <td className="py-6 px-4 text-dashboard-text text-center">{item.uploadedDate}</td>
              <td className="py-6 px-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  {item.contentTags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-6 px-4">
                <div className="flex items-center gap-2 text-dashboard-text justify-center">
                  {getContentTypeIcon(item.type)}
                  <span>{item.type}</span>
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
                    <DropdownMenuItem onClick={() => onEdit?.(item.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onShare?.(item.id)}>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(item.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 mb-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, items.length)} of {items.length} items
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 p-0 ${
                currentPage === page 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-accent hover:text-primary"
              }`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 hover:bg-accent hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 