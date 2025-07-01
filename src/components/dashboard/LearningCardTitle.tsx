import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
interface LearningCardTitleProps {
  title: string;
  contentId: string;
  onSave: (newTitle: string) => Promise<void>;
  disabled?: boolean;
}
export function LearningCardTitle({
  title,
  contentId,
  onSave,
  disabled = false
}: LearningCardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setIsEditing(true);
    setEditValue(title);
  };
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue.trim() === '' || editValue === title) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving title:', error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditValue(title);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave(e as any);
    } else if (e.key === 'Escape') {
      handleCancel(e as any);
    }
  };
  if (isEditing && !disabled) {
    return <div onClick={e => e.stopPropagation()} className="flex items-center gap-2">
        <Input value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={handleKeyDown} className="h-7 text-sm flex-1 min-w-0" autoFocus disabled={isSaving} />
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleSave} disabled={isSaving}>
          <Check className="h-3 w-3 text-green-600" />
        </Button>
        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleCancel} disabled={isSaving}>
          <X className="h-3 w-3 text-red-600" />
        </Button>
      </div>;
  }
  return <div className="group flex items-center gap-2 min-w-0">
      <h3 className="text-foreground line-clamp-2 flex-1 min-w-0 text-sm font-medium">
        {title}
      </h3>
      {!disabled && <Button size="sm" variant="ghost" className={cn("h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0", "hover:bg-accent")} onClick={handleEdit}>
          <Edit2 className="h-3 w-3" />
        </Button>}
    </div>;
}