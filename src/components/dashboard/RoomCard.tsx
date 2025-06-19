import React, { useState } from 'react';
import { Pencil, Trash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { waitForRoomAndNavigate } from '@/lib/roomNavigation';

interface RoomCardProps {
  id?: string;
  name?: string;
  onDelete?: (id: string) => void;
  isAddButton?: boolean;
  onAdd?: () => Promise<string | null>;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  onDelete,
  isAddButton,
  onAdd,
}) => {
  const navigate = useNavigate();
  const { rooms } = useRooms();
  const [isCreating, setIsCreating] = useState(false);
  const [creationStatus, setCreationStatus] = useState('');

  if (isAddButton) {
    const handleAddRoom = async () => {
      if (!onAdd) return;
      
      setIsCreating(true);
      setCreationStatus('Creating room...');
      
      try {
        const roomId = await onAdd();
        if (roomId) {
          const success = await waitForRoomAndNavigate(
            roomId,
            rooms,
            navigate,
            {
              onProgress: setCreationStatus
            }
          );

          if (!success) {
            toast.error('Room creation timed out. Please try again.');
            setCreationStatus('');
          }
        }
      } catch (error) {
        console.error('Error creating room:', error);
        toast.error('Failed to create room');
        setCreationStatus('');
      } finally {
        setIsCreating(false);
      }
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleAddRoom}
              disabled={isCreating}
              className={cn(
                "w-full flex flex-col items-center justify-center gap-2",
                "p-4 min-h-[80px]",
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
                {isCreating ? creationStatus || 'Creating...' : 'Add room'}
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

  const handleCardClick = () => {
    if (id) {
      navigate(`/rooms/${id}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && id) {
      onDelete(id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
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
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="text-foreground text-base font-medium truncate transition-colors duration-200">{name}</h3>
      </div>

      <div className="flex gap-2 ml-4">
        <button 
          onClick={handleDeleteClick}
          className="p-1 rounded-full text-muted-foreground hover:text-red-500 transition-colors"
          aria-label={`Delete room ${name}`}
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
