
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '@/contexts/ContentContext';
import { ContentTypeIcon } from './ContentTypeIcon';
import { RecentItemEditor } from './RecentItemEditor';
import { RecentItemDropdown } from './RecentItemDropdown';

interface RecentItemProps {
  content: {
    id: string;
    title: string;
    type: string;
  };
  onShareClick?: (contentId: string, contentTitle: string) => void;
  onDeleteClick?: (contentId: string, contentTitle: string) => void;
}

export const RecentItem: React.FC<RecentItemProps> = ({
  content,
  onShareClick,
  onDeleteClick
}) => {
  const { updateContent } = useContent();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleRenameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditedTitle(content.title);
    setOpenDropdown(false);
  };

  const handleSaveRename = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editedTitle.trim()) {
      await updateContent(content.id, { title: editedTitle.trim() });
    }
    
    setIsEditing(false);
    setEditedTitle('');
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setEditedTitle('');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShareClick) {
      onShareClick(content.id, content.title);
    }
    setOpenDropdown(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(content.id, content.title);
    }
    setOpenDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      handleSaveRename(mockMouseEvent);
    } else if (e.key === 'Escape') {
      const mockMouseEvent = {
        preventDefault: () => {},
        stopPropagation: () => {}
      } as React.MouseEvent;
      handleCancelRename(mockMouseEvent);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 group">
      {isEditing ? (
        <RecentItemEditor
          value={editedTitle}
          onChange={setEditedTitle}
          onSave={handleSaveRename}
          onCancel={handleCancelRename}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <Link
            to={`/content/${content.id}?type=${content.type}`}
            className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent transition-colors duration-200 flex-1 min-w-0"
          >
            <ContentTypeIcon type={content.type} />
            <span className="text-sm text-foreground truncate">
              {content.title}
            </span>
          </Link>
          
          <RecentItemDropdown
            contentId={content.id}
            contentTitle={content.title}
            isOpen={openDropdown}
            onOpenChange={setOpenDropdown}
            onRename={handleRenameClick}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};
