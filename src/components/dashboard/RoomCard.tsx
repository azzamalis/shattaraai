import React, { useState } from 'react';
import { Pencil, Trash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  id?: string;
  name?: string;
  onDelete?: (id: string) => void;
  isAddButton?: boolean;
  onAdd?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  onDelete,
  isAddButton,
  onAdd,
}) => {
  if (isAddButton) {
    return (
      <button
        onClick={onAdd}
        className={cn(
          "w-full flex items-center justify-center gap-2",
          "p-4",
          "rounded-lg border border-dashed border-border",
          "hover:border-border hover:bg-accent",
          "group transition-all duration-300"
        )}
      >
        <Plus 
          className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all duration-300" 
        />
        <span 
          className="text-muted-foreground group-hover:text-foreground text-base transition-colors duration-300"
        >
          Add room
        </span>
      </button>
    );
  }

  return (
    <div 
      className={cn(
        "relative flex items-center justify-between",
        "p-4",
        "rounded-lg border border-border",
        "group transition-all duration-300",
        "bg-card hover:bg-accent",
        "hover:shadow-md dark:hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="text-foreground text-base font-medium truncate transition-colors duration-200">{name}</h3>
      </div>

      <div className="flex gap-2 ml-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (onDelete && id) {
              onDelete(id);
            }
          }}
          className="p-1 rounded-full text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
