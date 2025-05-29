import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, FileText, Video, Youtube, Mic } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function RoomContentTable({ items, onEdit, onDelete, onShare }: RoomContentTableProps) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-dashboard-separator">
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Title Name</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Uploaded Date</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">AI Content Tags</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Type</th>
            <th className="text-center py-4 px-4 font-medium text-dashboard-text text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr 
              key={item.id} 
              className="border-b border-dashboard-separator hover:bg-dashboard-card-hover transition-colors duration-200"
            >
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
    </div>
  );
} 