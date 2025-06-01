import React, { useState } from 'react';
import { Plus, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import { NotesBlock } from '@/lib/types';
import { cn } from '@/lib/utils';

interface BlockControlsProps {
  block: NotesBlock;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: (event: React.MouseEvent, blockId: string) => void;
  isVisible: boolean;
}

export function BlockControls({ 
  block, 
  onAddBlock, 
  onDeleteBlock, 
  onShowTypeMenu,
  isVisible 
}: BlockControlsProps) {
  const [showActions, setShowActions] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="absolute left-0 top-0 flex items-center gap-1 -ml-12 mt-1">
      <button
        onClick={onAddBlock}
        className={cn(
          "p-1 rounded transition-colors opacity-0 group-hover:opacity-100",
          "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
          "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
          "hover:text-dashboard-text dark:hover:text-dashboard-text"
        )}
        title="Add block"
      >
        <Plus className="h-[14px] w-[14px]" />
      </button>
      
      <div className="relative">
        <button
          onClick={(e) => onShowTypeMenu(e, block.id)}
          className={cn(
            "p-1 rounded transition-colors opacity-0 group-hover:opacity-100",
            "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
            "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
            "hover:text-dashboard-text dark:hover:text-dashboard-text"
          )}
          title="Block options"
        >
          <GripVertical className="h-[14px] w-[14px]" />
        </button>
        
        {showActions && (
          <div className={cn(
            "absolute left-0 top-8 z-50 min-w-32",
            "bg-dashboard-card dark:bg-dashboard-card",
            "border border-dashboard-separator dark:border-dashboard-separator",
            "rounded-lg shadow-lg py-1"
          )}>
            <button
              onClick={() => {
                onShowTypeMenu(null, block.id);
                setShowActions(false);
              }}
              className={cn(
                "w-full px-3 py-1 text-left text-sm",
                "text-dashboard-text dark:text-dashboard-text",
                "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
                "transition-colors"
              )}
            >
              Change type
            </button>
            <button
              onClick={() => {
                onDeleteBlock();
                setShowActions(false);
              }}
              className={cn(
                "w-full px-3 py-1 text-left text-sm",
                "text-red-400 hover:bg-red-500/10",
                "transition-colors flex items-center gap-2"
              )}
            >
              <Trash2 className="h-[14px] w-[14px]" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
