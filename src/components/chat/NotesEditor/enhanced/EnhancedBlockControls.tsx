import React, { useState } from 'react';
import { Plus, GripVertical, ChevronUp, ChevronDown, Palette, Trash2, MoreHorizontal } from 'lucide-react';
import { NotionBlock } from '@/lib/notionTypes';
import { cn } from '@/lib/utils';

interface EnhancedBlockControlsProps {
  block: NotionBlock;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: (event: React.MouseEvent) => void;
  onMoveBlock?: (direction: 'up' | 'down') => void;
  onColorChange?: (color: NotionBlock['properties']['color']) => void;
  onBackgroundChange?: (backgroundColor: NotionBlock['properties']['backgroundColor']) => void;
  isVisible: boolean;
}

const colors = [
  { id: 'default', name: 'Default', class: '' },
  { id: 'gray', name: 'Gray', class: 'text-gray-600' },
  { id: 'brown', name: 'Brown', class: 'text-amber-700' },
  { id: 'orange', name: 'Orange', class: 'text-orange-600' },
  { id: 'yellow', name: 'Yellow', class: 'text-yellow-600' },
  { id: 'green', name: 'Green', class: 'text-green-600' },
  { id: 'blue', name: 'Blue', class: 'text-blue-600' },
  { id: 'purple', name: 'Purple', class: 'text-purple-600' },
  { id: 'pink', name: 'Pink', class: 'text-pink-600' },
  { id: 'red', name: 'Red', class: 'text-red-600' },
] as const;

const backgrounds = [
  { id: 'default', name: 'Default', class: '' },
  { id: 'gray', name: 'Gray', class: 'bg-gray-100' },
  { id: 'brown', name: 'Brown', class: 'bg-amber-50' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-50' },
  { id: 'yellow', name: 'Yellow', class: 'bg-yellow-50' },
  { id: 'green', name: 'Green', class: 'bg-green-50' },
  { id: 'blue', name: 'Blue', class: 'bg-blue-50' },
  { id: 'purple', name: 'Purple', class: 'bg-purple-50' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-50' },
  { id: 'red', name: 'Red', class: 'bg-red-50' },
] as const;

export function EnhancedBlockControls({ 
  block, 
  onAddBlock, 
  onDeleteBlock, 
  onShowTypeMenu,
  onMoveBlock,
  onColorChange,
  onBackgroundChange,
  isVisible 
}: EnhancedBlockControlsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="absolute left-0 top-0 flex items-center gap-1 -ml-16 mt-1">
      {/* Add Block Button */}
      <button
        onClick={onAddBlock}
        className={cn(
          "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
          "text-muted-foreground hover:text-foreground",
          "hover:bg-accent",
          "hover:scale-110"
        )}
        title="Add block"
      >
        <Plus className="h-[14px] w-[14px]" />
      </button>
      
      {/* Drag Handle / Menu Button */}
      <div className="relative">
        <button
          draggable="true"
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', '');
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDrag={(e) => {
            if (e.clientX !== 0 && e.clientY !== 0) {
              const button = e.currentTarget;
              button.style.position = 'fixed';
              button.style.left = `${e.clientX - 12}px`;
              button.style.top = `${e.clientY - 12}px`;
              button.style.zIndex = '9999';
              button.style.pointerEvents = 'none';
            }
          }}
          onDragEnd={(e) => {
            const button = e.currentTarget;
            button.style.position = 'fixed';
            button.style.left = `${e.clientX - 12}px`;
            button.style.top = `${e.clientY - 12}px`;
            button.style.zIndex = '9999';
            button.style.pointerEvents = 'auto';
          }}
          onClick={(e) => onShowTypeMenu(e)}
          className={cn(
            "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
            "cursor-grab active:cursor-grabbing",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent",
            "hover:scale-110"
          )}
          title="Drag to move or click for options"
        >
          <GripVertical className="h-[14px] w-[14px]" />
        </button>
      </div>

      {/* Move Up/Down Buttons */}
      {onMoveBlock && (
        <>
          <button
            onClick={() => onMoveBlock('up')}
            className={cn(
              "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-accent",
              "hover:scale-110"
            )}
            title="Move up"
          >
            <ChevronUp className="h-[14px] w-[14px]" />
          </button>
          <button
            onClick={() => onMoveBlock('down')}
            className={cn(
              "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-accent",
              "hover:scale-110"
            )}
            title="Move down"
          >
            <ChevronDown className="h-[14px] w-[14px]" />
          </button>
        </>
      )}

      {/* Color Picker Button */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={cn(
            "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent",
            "hover:scale-110"
          )}
          title="Change color"
        >
          <Palette className="h-[14px] w-[14px]" />
        </button>

        {/* Color Picker Dropdown */}
        {showColorPicker && (
          <div className={cn(
            "absolute left-0 top-8 z-50 min-w-48",
            "bg-card dark:bg-card",
            "border border-border dark:border-border",
            "rounded-lg shadow-lg py-2",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}>
            <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
              Text Color
            </div>
            <div className="grid grid-cols-5 gap-1 px-2 mb-3">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    onColorChange?.(color.id as NotionBlock['properties']['color']);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    "w-6 h-6 rounded border border-border",
                    color.class || "bg-card",
                    block.properties?.color === color.id && "ring-2 ring-primary"
                  )}
                  title={color.name}
                />
              ))}
            </div>
            
            <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">
              Background
            </div>
            <div className="grid grid-cols-5 gap-1 px-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    onBackgroundChange?.(bg.id as NotionBlock['properties']['backgroundColor']);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    "w-6 h-6 rounded border border-border",
                    bg.class || "bg-card",
                    block.properties?.backgroundColor === bg.id && "ring-2 ring-primary"
                  )}
                  title={bg.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* More Actions Button */}
      <div className="relative">
        <button
          onClick={() => setShowActions(!showActions)}
          className={cn(
            "p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-accent",
            "hover:scale-110"
          )}
          title="More actions"
        >
          <MoreHorizontal className="h-[14px] w-[14px]" />
        </button>

        {/* Actions Dropdown */}
        {showActions && (
          <div className={cn(
            "absolute left-0 top-8 z-50 min-w-32",
            "bg-card dark:bg-card",
            "border border-border dark:border-border",
            "rounded-lg shadow-lg py-1",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}>
            <button
              onClick={() => {
                onShowTypeMenu(null);
                setShowActions(false);
              }}
              className={cn(
                "w-full px-3 py-1 text-left text-sm",
                "text-foreground dark:text-foreground",
                "hover:bg-accent dark:hover:bg-accent",
                "transition-colors"
              )}
            >
              Change type
            </button>
            <button
              onClick={() => {
                // Copy block functionality would go here
                setShowActions(false);
              }}
              className={cn(
                "w-full px-3 py-1 text-left text-sm",
                "text-foreground dark:text-foreground",
                "hover:bg-accent dark:hover:bg-accent",
                "transition-colors"
              )}
            >
              Duplicate
            </button>
            <hr className="my-1 border-border" />
            <button
              onClick={() => {
                onDeleteBlock();
                setShowActions(false);
              }}
              className={cn(
                "w-full px-3 py-1 text-left text-sm",
                "text-destructive hover:bg-destructive/10",
                "transition-colors flex items-center gap-2"
              )}
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