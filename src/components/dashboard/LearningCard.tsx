
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ContentItem } from '@/hooks/useContent';
import { cn } from '@/lib/utils';
import { Check, Pencil, Loader2 } from 'lucide-react';
import { LearningCardMenu } from './LearningCardMenu';
import { LearningCardThumbnail } from './LearningCardThumbnail';
import { ContentTypeIcon } from './drawer/recent/ContentTypeIcon';
import { formatRelativeTime } from '@/lib/formatTime';
import { useContentContext } from '@/contexts/ContentContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Check as CheckIcon } from 'lucide-react';
import { useRealtimeContentStatus } from '@/hooks/useRealtimeContentStatus';

interface LearningCardProps {
  content: ContentItem;
  onDelete: () => void;
  onShare: () => void;
  onAddToRoom?: (roomId: string) => void;
  availableRooms?: Array<{ id: string; name: string }>;
  currentRoom?: { id: string; name: string };
  // Selection mode props
  isExamSelectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (contentId: string) => void;
}

export function LearningCard({
  content,
  onDelete,
  onShare,
  onAddToRoom,
  availableRooms = [],
  currentRoom,
  isExamSelectionMode = false,
  isSelected = false,
  onToggleSelection
}: LearningCardProps) {
  const navigate = useNavigate();
  const { onUpdateContent } = useContentContext();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editValue, setEditValue] = useState(content.title);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track real-time processing status
  const processingStatus = useRealtimeContentStatus(content.id, true);
  const isProcessing = processingStatus.status === 'processing' || processingStatus.status === 'pending';

  const handleCardClick = () => {
    if (isExamSelectionMode && onToggleSelection) {
      onToggleSelection(content.id);
    } else {
      // Route to chat page for chat content types, otherwise to content page
      if (content.type === 'chat') {
        navigate(`/chat/${content.id}`);
      } else {
        navigate(`/content/${content.id}?type=${content.type}`);
      }
    }
  };

  const handleAddToRoom = async (roomId: string) => {
    try {
      await onUpdateContent(content.id, { room_id: roomId });
      
      const room = availableRooms.find(r => r.id === roomId);
      if (room) {
        toast.success(`Added to "${room.name}"`);
      }
      
      if (onAddToRoom) {
        onAddToRoom(roomId);
      }
    } catch (error) {
      console.error('Error adding content to room:', error);
      toast.error('Failed to add content to room');
    }
  };

  const handleTitleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExamSelectionMode) {
      setIsEditingTitle(true);
      setEditValue(content.title);
    }
  };

  const handleTitleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue.trim() === '' || editValue === content.title) {
      setIsEditingTitle(false);
      return;
    }
    setIsSaving(true);
    try {
      await onUpdateContent(content.id, { title: editValue.trim() });
      setIsEditingTitle(false);
      toast.success('Title updated');
    } catch (error) {
      console.error('Error updating content title:', error);
      toast.error('Failed to update title');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTitleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingTitle(false);
    setEditValue(content.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSave(e as any);
    } else if (e.key === 'Escape') {
      handleTitleCancel(e as any);
    }
  };

  return (
    <a 
      onClick={handleCardClick} 
      className={cn(
        "flex flex-col justify-between",
        "shadow-[0_4px_10px_rgba(0,0,0,0.02)]",
        "bg-card",
        isProcessing && "opacity-70",
        "cursor-pointer transition-all duration-200 rounded-3xl border border-border",
        "group relative",
        "hover:shadow-md dark:hover:border-border/40",
        // Selection mode styles
        isExamSelectionMode && "hover:border-primary/50",
        isSelected && "border-primary bg-primary/5 shadow-lg"
      )}
    >
      {/* Selection overlay */}
      {isExamSelectionMode && isSelected && (
        <div className="absolute inset-0 bg-primary/10 rounded-3xl flex items-center justify-center z-10">
          <div className="bg-primary text-primary-foreground rounded-full p-2">
            <Check className="h-6 w-6" />
          </div>
        </div>
      )}

      {/* Content preview section */}
      <LearningCardThumbnail 
        thumbnailUrl={content.metadata?.thumbnailUrl} 
        title={content.title}
        contentType={content.type}
        pdfUrl={content.url}
      >
        {!isExamSelectionMode && (
          <LearningCardMenu
            onDelete={onDelete}
            onShare={onShare}
            onAddToRoom={handleAddToRoom}
            availableRooms={availableRooms}
          />
        )}
        {/* Processing status badge */}
        {isProcessing && (
          <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1.5 backdrop-blur-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            {processingStatus.currentStep || 'Processing...'}
          </div>
        )}
      </LearningCardThumbnail>

      {/* Content Info Section */}
      <div className="w-full my-2.5 flex gap-2 px-3 py-1 relative items-center">
        {/* Content Type Icon */}
        <ContentTypeIcon 
          type={content.type} 
          className="w-4 h-4 text-muted-foreground flex-shrink-0 mr-1" 
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            {/* Title row with inline edit */}
            {isEditingTitle && !isExamSelectionMode ? (
              <div onClick={e => e.stopPropagation()} className="flex items-center gap-2 w-full">
                <Input 
                  value={editValue} 
                  onChange={e => setEditValue(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  className="h-7 text-sm flex-1 min-w-0" 
                  autoFocus 
                  disabled={isSaving}
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0" 
                  onClick={handleTitleSave} 
                  disabled={isSaving}
                >
                  <CheckIcon className="h-3 w-3 text-green-600" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 w-7 p-0" 
                  onClick={handleTitleCancel} 
                  disabled={isSaving}
                >
                  <X className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <h5 className="text-sm font-medium truncate tracking-wide flex-1 text-primary/80 group-hover:text-primary">
                  {content.title}
                </h5>
                {!isExamSelectionMode && (
                  <Pencil 
                    onClick={handleTitleEdit}
                    className="w-4 h-4 text-primary/40 opacity-100 xl:opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0 transition-opacity duration-200 hover:text-primary"
                  />
                )}
              </div>
            )}
            
            {/* Timestamp */}
            <div className="text-xs text-muted-foreground/70">
              {formatRelativeTime(content.created_at)}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
