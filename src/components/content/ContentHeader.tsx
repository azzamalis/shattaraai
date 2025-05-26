
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Share2, Download } from 'lucide-react';
import { ShareModal } from '@/components/dashboard/modals/ShareModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ContentData } from '@/pages/ContentPage';

interface ContentHeaderProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  isRecording?: boolean;
  recordingTime?: string;
}

export function ContentHeader({ 
  contentData, 
  onUpdateContent, 
  isRecording = false,
  recordingTime = "0:00"
}: ContentHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(contentData.title);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [saveDropdownOpen, setSaveDropdownOpen] = useState(false);

  const handleTitleEdit = () => {
    setEditedTitle(contentData.title);
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    onUpdateContent({ title: editedTitle });
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(contentData.title);
    }
  };

  const handleSaveToRoom = (roomId: string) => {
    // TODO: Implement save to room functionality
    setSaveDropdownOpen(false);
  };

  const getStatusIndicator = () => {
    if (contentData.type === 'recording' && isRecording) {
      return <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>;
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4 border-b border-white/10 bg-[#222222]">
      <div className="flex items-center justify-between w-full mb-1">
        <div className="flex items-center min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSave}
              className="text-white text-sm font-medium bg-transparent border-none border-b border-white/20 focus:border-white/40 outline-none focus:outline-none focus:ring-0 min-w-0"
              autoFocus
            />
          ) : (
            <h1 className="text-white text-sm font-medium truncate">
              {contentData.title}
              {getStatusIndicator()}
            </h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-2 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleTitleEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Popover open={saveDropdownOpen} onOpenChange={setSaveDropdownOpen}>
            <PopoverTrigger asChild>
              <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Save
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[200px] bg-[#1A1A1A] border-white/10 p-1 z-50"
              side="bottom"
              align="end"
              sideOffset={5}
            >
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                <div className="px-2 py-1.5 text-white/60 text-sm">
                  No rooms available
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            className="bg-transparent hover:bg-white/10 border border-white/20 text-white" 
            size="sm"
            onClick={() => setShareModalOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} />
    </div>
  );
}
