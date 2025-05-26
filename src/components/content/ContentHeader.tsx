
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
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

  const getStatusIndicator = () => {
    if (contentData.type === 'recording' && isRecording) {
      return <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-dashboard-bg border-b border-dashboard-separator">
      <div className="flex items-center min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleTitleKeyDown}
            onBlur={handleTitleSave}
            className="text-dashboard-text text-base font-medium bg-transparent border-none border-b border-dashboard-text/20 focus:border-dashboard-text/40 outline-none focus:outline-none focus:ring-0 min-w-0"
            autoFocus
          />
        ) : (
          <h1 className="text-dashboard-text text-base font-medium truncate cursor-pointer hover:text-dashboard-text/80 transition-colors" onClick={handleTitleEdit}>
            {contentData.title}
            {getStatusIndicator()}
          </h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 text-dashboard-text-secondary hover:text-dashboard-text hover:bg-dashboard-card-hover h-8 w-8"
          onClick={handleTitleEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
