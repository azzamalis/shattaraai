
import React, { useState } from 'react';
import { Plus, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react';
import { NotesBlock } from '@/lib/types';

interface BlockControlsProps {
  block: NotesBlock;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: () => void;
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
        className="p-1 rounded hover:bg-[#4B4B4B] text-[#A6A6A6] hover:text-[#FFF] transition-colors opacity-0 group-hover:opacity-100"
        title="Add block"
      >
        <Plus className="h-4 w-4" />
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className="p-1 rounded hover:bg-[#4B4B4B] text-[#A6A6A6] hover:text-[#FFF] transition-colors opacity-0 group-hover:opacity-100"
          title="Block options"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        
        {showActions && (
          <div className="absolute left-0 top-8 bg-[#4B4B4B] border border-[#4B4B4B] rounded-lg shadow-lg py-1 z-50 min-w-32">
            <button
              onClick={() => {
                onShowTypeMenu();
                setShowActions(false);
              }}
              className="w-full px-3 py-1 text-left text-sm text-[#FFF] hover:bg-[#DDDDDD]/10 transition-colors"
            >
              Change type
            </button>
            <button
              onClick={() => {
                onDeleteBlock();
                setShowActions(false);
              }}
              className="w-full px-3 py-1 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
