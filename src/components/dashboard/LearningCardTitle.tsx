
import React, { useState } from 'react';
import { Check, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface LearningCardTitleProps {
  title: string;
  onSave?: (newTitle: string) => void;
}

export function LearningCardTitle({ title, onSave }: LearningCardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      onSave(editedTitle);
    }
    toast.success("Title updated successfully");
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className="relative group/title">
      {isEditing ? (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <input
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
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
          <button onClick={handleSaveTitle} className="absolute right-0 text-muted-foreground hover:text-foreground transition-colors">
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <h3 className="text-sm font-medium text-foreground pr-8 line-clamp-2 tracking-wide">
            {editedTitle}
          </h3>
          <button onClick={handleEditClick} className="absolute right-0 opacity-0 group-hover/title:opacity-100 transition-opacity">
            <Pencil className="w-4 h-4 text-primary/40 hover:text-primary transition-colors" />
          </button>
        </div>
      )}
    </div>
  );
}
