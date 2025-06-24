
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
  Pencil,
  Check,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { recentContent, updateContent } = useContent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [editedContentTitle, setEditedContentTitle] = useState('');

  if (!recentContent || recentContent.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        No recent content
      </div>
    );
  }

  const handleRenameClick = (e: React.MouseEvent, contentId: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingContentId(contentId);
    setEditedContentTitle(currentTitle);
    setOpenDropdown(null);
  };

  const handleSaveRename = async (e: React.MouseEvent, contentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editedContentTitle.trim()) {
      await updateContent(contentId, { title: editedContentTitle.trim() });
    }
    
    setEditingContentId(null);
    setEditedContentTitle('');
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingContentId(null);
    setEditedContentTitle('');
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, contentId: string) => {
    if (e.key === 'Enter') {
      // Create a mock mouse event for the save handler
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      handleSaveRename(mockMouseEvent, contentId);
    } else if (e.key === 'Escape') {
      // Create a mock mouse event for the cancel handler
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      handleCancelRename(mockMouseEvent);
    }
  };

  return (
    <div className="space-y-1">
      {recentContent.slice(0, 5).map((content) => (
        <div key={content.id} className="flex items-center justify-between gap-2 group">
          {editingContentId === content.id ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editedContentTitle}
                onChange={(e) => setEditedContentTitle(e.target.value)}
                className="flex-1 h-8"
                autoFocus
                onKeyDown={(e) => handleKeyDown(e, content.id)}
              />
              <Button
                size="sm"
                onClick={(e) => handleSaveRename(e, content.id)}
                className="h-8 w-8 p-0"
                variant="ghost"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelRename}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
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
                    onClick={(e) => handleRenameClick(e, content.id, content.title)}
                    className="w-full justify-start text-foreground hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-normal"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};
