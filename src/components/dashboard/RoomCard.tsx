
import React, { useState } from 'react';
import { Pencil, Trash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  id?: string;
  name?: string;
  formattedDate?: string;
  onEdit?: (id: string, newName: string) => void;
  onDelete?: (id: string) => void;
  isAddButton?: boolean;
  onAdd?: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  name,
  formattedDate,
  onEdit,
  onDelete,
  isAddButton,
  onAdd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = () => {
    if (id && editedName && onEdit) {
      onEdit(id, editedName);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && id) {
      onDelete(id);
    }
  };

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
          className="w-5 h-5 text-zinc-400 group-hover:text-zinc-300 group-hover:rotate-90 transition-all duration-300
            text-[#232323] dark:text-zinc-400 dark:group-hover:text-zinc-300" 
        />
        <span 
          className="text-zinc-400 group-hover:text-zinc-300 text-base transition-colors duration-300
            text-[#232323] dark:text-zinc-400 dark:group-hover:text-zinc-300"
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
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-[#232323] dark:text-zinc-100 text-base font-medium 
                border-b border-zinc-700 focus:border-zinc-500
                px-0 py-0.5
                focus:outline-none focus:ring-0
                transition-colors duration-200"
              autoFocus
            />
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="p-1 rounded-full hover:bg-white/10 text-[#232323] dark:text-white/60 hover:text-[#232323] dark:hover:text-white/90 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 rounded-full hover:bg-white/10 text-[#232323] dark:text-white/60 hover:text-[#232323] dark:hover:text-white/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <h3 className="text-[#232323] dark:text-zinc-100 text-base font-medium truncate transition-colors duration-200">{name}</h3>
        )}
        {formattedDate && (
          <p className="text-zinc-400 text-sm">{formattedDate}</p>
        )}
      </div>

      {!isEditing && (
        <div className="flex gap-2 ml-4">
          <button 
            onClick={handleEditClick}
            className="p-1 rounded-full hover:bg-white/10 text-[#232323] dark:text-white/60 hover:text-[#232323] dark:hover:text-white/90 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-1 rounded-full hover:bg-white/10 text-[#232323] dark:text-white/60 hover:text-[#232323] dark:hover:text-white/90 transition-colors"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
