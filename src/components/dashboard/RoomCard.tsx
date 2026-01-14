
import React, { useState, useCallback, memo } from 'react';
import { Trash, Plus, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface RoomCardProps {
  id?: string;
  name?: string;
  contentCount?: number;
  onDelete?: (id: string) => void;
  isAddButton?: boolean;
  onAdd?: () => Promise<string | null>;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({
  id,
  name,
  contentCount = 0,
  onDelete,
  isAddButton,
  onAdd,
}) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleAddRoom = useCallback(async () => {
    if (!onAdd) return;
    
    setIsCreating(true);
    try {
      const roomId = await onAdd();
      if (roomId) {
        setTimeout(() => {
          navigate(`/rooms/${roomId}`);
        }, 800);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    } finally {
      setIsCreating(false);
    }
  }, [onAdd, navigate]);

  const handleCardClick = useCallback(() => {
    if (id) {
      navigate(`/rooms/${id}`);
    }
  }, [id, navigate]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && id) {
      onDelete(id);
    }
  }, [onDelete, id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleCardClick();
    }
  }, [handleCardClick]);

  if (isAddButton) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleAddRoom}
              disabled={isCreating}
              className={cn(
                "w-full flex items-center justify-center gap-2",
                "p-4",
                "rounded-lg border border-dashed border-border",
                "hover:border-border hover:bg-accent",
                "group transition-all duration-300",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <Plus 
                className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300" 
              />
              <span 
                className="text-muted-foreground group-hover:text-foreground text-base transition-colors duration-300"
              >
                {isCreating ? 'Creating...' : 'Add room'}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create a room to manage your content</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex items-center justify-between",
        "p-4",
        "rounded-lg border border-border",
        "group transition-all duration-300",
        "bg-card hover:bg-accent",
        "hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]",
        "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Box className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-foreground text-base font-medium truncate min-w-0 transition-colors duration-200">{name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            ({contentCount} content)
          </span>
        </div>
      </div>

      <div className="flex gap-2 ml-4">
        <button 
          onClick={handleDeleteClick}
          className="p-1 rounded-full text-muted-foreground hover:text-red-500 transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label={`Delete room ${name}`}
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Memoize with custom comparison
export const RoomCard = memo(RoomCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.contentCount === nextProps.contentCount &&
    prevProps.isAddButton === nextProps.isAddButton &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onAdd === nextProps.onAdd
  );
});
