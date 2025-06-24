
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { 
  FileText, 
  Video, 
  Youtube, 
  Mic, 
  Globe, 
  MessageSquare, 
  Music, 
  Upload, 
  Type,
  MoreHorizontal,
  Share,
  Trash2,
  Edit
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Helper function to get content type icon
const getContentTypeIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-primary/60" />;
    case 'pdf':
    case 'file':
      return <FileText className="h-4 w-4 text-primary/60" />;
    case 'recording':
    case 'live_recording':
      return <Mic className="h-4 w-4 text-primary/60" />;
    case 'youtube':
      return <Youtube className="h-4 w-4 text-primary/60" />;
    case 'website':
      return <Globe className="h-4 w-4 text-primary/60" />;
    case 'text':
      return <Type className="h-4 w-4 text-primary/60" />;
    case 'audio_file':
      return <Music className="h-4 w-4 text-primary/60" />;
    case 'upload':
      return <Upload className="h-4 w-4 text-primary/60" />;
    case 'chat':
      return <MessageSquare className="h-4 w-4 text-primary/60" />;
    default:
      return <FileText className="h-4 w-4 text-primary/60" />;
  }
};

export const RecentSection: React.FC = () => {
  const { recentContent } = useContent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!recentContent || recentContent.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        No recent content
      </div>
    );
  }

  const handleEdit = (contentId: string) => {
    // Handle edit functionality - you can implement this based on your needs
    console.log('Edit content:', contentId);
    setOpenDropdown(null);
  };

  const handleShare = (contentId: string) => {
    // Handle share functionality - you can implement this based on your needs
    console.log('Share content:', contentId);
    setOpenDropdown(null);
  };

  const handleDelete = (contentId: string) => {
    // Handle delete functionality - you can implement this based on your needs
    console.log('Delete content:', contentId);
    setOpenDropdown(null);
  };

  return (
    <div className="space-y-1">
      {recentContent.slice(0, 5).map((content) => (
        <div key={content.id} className="flex items-center justify-between gap-2 group">
          <Link
            to={`/content/${content.id}?type=${content.type}`}
            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors duration-200 flex-1 min-w-0"
          >
            {getContentTypeIcon(content.type)}
            <span className="text-sm text-foreground truncate">
              {content.title}
            </span>
          </Link>
          
          <DropdownMenu 
            open={openDropdown === content.id} 
            onOpenChange={(open) => setOpenDropdown(open ? content.id : null)}
          >
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-1">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(content.id);
                }}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(content.id);
                }}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              
              <Separator className="my-1" />
              
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(content.id);
                }}
                className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
};
