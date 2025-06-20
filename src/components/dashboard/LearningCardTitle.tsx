
import React, { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useContentContext } from '@/contexts/ContentContext';

interface LearningCardTitleProps {
  title: string;
  contentId: string;
  onSave?: (newTitle: string) => void;
}

export function LearningCardTitle({ title, contentId, onSave }: LearningCardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { onUpdateContent } = useContentContext();

  const handleSaveTitle = async () => {
    if (editedTitle.trim() === '' || editedTitle.trim() === title) {
      setEditedTitle(title); // Reset if empty or unchanged
      setIsEditing(false);
      return;
    }

    try {
      // Update in database
      await onUpdateContent(contentId, { title: editedTitle.trim() });
      
      // Call optional callback
      if (onSave) {
        onSave(editedTitle.trim());
      }
      
      toast.success("Title updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error("Failed to update title");
      setEditedTitle(title); // Reset to original if failed
      setIsEditing(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTitle(title);
    setIsEditing(true);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSaveTitle();
  };

  const handleBlur = () => {
    handleSaveTitle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditedTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div className="relative group/title">
      {isEditing ? (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className={cn(
              "w-full bg-transparent",
              "text-foreground text-sm font-medium",
              "focus:outline-none focus:ring-0",
              "border-b border-border",
              "pr-8"
            )}
            autoFocus
            spellCheck="false"
          />
          <button onClick={handleSaveClick} className="absolute right-0 text-muted-foreground hover:text-foreground transition-colors">
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <h3 className="text-sm font-medium text-foreground pr-8 line-clamp-2 tracking-wide">
            {title}
          </h3>
          <button onClick={handleEditClick} className="absolute right-0 opacity-0 group-hover/title:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-primary/40 hover:text-primary transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
