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
          "rounded-lg border border-dashed border-zinc-700",
          "hover:border-zinc-600 hover:bg-zinc-900",
          "dark:border-zinc-700 dark:hover:border-zinc-600 dark:hover:bg-zinc-900",
          "border-dashboard-separator hover:border-dashboard-separator hover:bg-dashboard-card-hover",
          "group transition-all duration-300"
        )}
      >
        <Plus 
          className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 transition-all duration-300" 
        />
        <span 
          className="text-zinc-400 group-hover:text-zinc-300 text-base transition-colors duration-300"
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
        "rounded-lg border",
        "group transition-all duration-300",
        "bg-dashboard-card border-dashboard-separator hover:bg-[#F3F3F3]",
        "dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:border-zinc-700"
      )}
    >
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="text-zinc-400 dark:text-zinc-100 text-base font-medium truncate transition-colors duration-200">{name}</h3>
      </div>

      <div className="flex gap-2 ml-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (onDelete && id) {
              onDelete(id);
            }
          }}
          className="p-1 rounded-full text-zinc-400 dark:text-white/60 hover:text-red-500 dark:hover:text-red-500 transition-colors"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
