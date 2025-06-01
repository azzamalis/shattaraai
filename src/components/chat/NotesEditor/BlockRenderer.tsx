import React, { useState } from 'react';
import { NotesBlock } from '@/lib/types';
import { BlockControls } from './BlockControls';
import { cn } from '@/lib/utils';

interface BlockRendererProps {
  block: NotesBlock;
  onUpdate: (updates: Partial<NotesBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: (e: React.MouseEvent) => void;
}

export function BlockRenderer({ 
  block, 
  onUpdate, 
  onKeyDown, 
  onAddBlock, 
  onDeleteBlock,
  onShowTypeMenu 
}: BlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case 'h1':
        return 'Heading 1';
      case 'h2':
        return 'Heading 2';
      case 'h3':
        return 'Heading 3';
      case 'ul':
      case 'ol':
        return 'List item';
      case 'todo':
        return 'To-do';
      case 'code':
        return 'Enter code...';
      case 'quote':
        return 'Quote';
      default:
        return 'Type / for commands';
    }
  };

  const getClassName = () => {
    const baseClasses = cn(
      "w-full bg-transparent border-0 outline-none resize-none min-h-[1.5rem]",
      "text-dashboard-text dark:text-dashboard-text",
      "placeholder:text-dashboard-text-secondary/70 dark:placeholder:text-dashboard-text-secondary/70",
      "leading-relaxed",
      "focus:outline-none focus:ring-0 focus:border-0",
      "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0",
      "focus-within:outline-none focus-within:ring-0 focus-within:border-0",
      "appearance-none",
      "[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-0",
      "[&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:border-0"
    );
    
    switch (block.type) {
      case 'h1':
        return cn(baseClasses, "text-2xl font-bold");
      case 'h2':
        return cn(baseClasses, "text-xl font-semibold");
      case 'h3':
        return cn(baseClasses, "text-lg font-medium");
      case 'code':
        return cn(baseClasses, "font-mono bg-dashboard-card dark:bg-dashboard-card p-3 rounded text-sm");
      case 'quote':
        return cn(baseClasses, "border-l-4 border-primary pl-4 italic");
      default:
        return baseClasses;
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'divider':
        return <hr className="border-dashboard-separator dark:border-dashboard-separator my-4" />;
      
      case 'ul':
        return (
          <div className="flex items-start gap-2">
            <span className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 mt-1">•</span>
            <textarea
              data-block-id={block.id}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={getPlaceholder()}
              className={getClassName()}
              rows={1}
            />
          </div>
        );
      
      case 'ol':
        return (
          <div className="flex items-start gap-2">
            <span className="text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 mt-1">1.</span>
            <textarea
              data-block-id={block.id}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={getPlaceholder()}
              className={getClassName()}
              rows={1}
            />
          </div>
        );
      
      case 'todo':
        return (
          <div className="flex items-start gap-2">
            <input 
              type="checkbox" 
              className="mt-1 border-dashboard-separator dark:border-dashboard-separator" 
            />
            <textarea
              data-block-id={block.id}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={getPlaceholder()}
              className={getClassName()}
              rows={1}
            />
          </div>
        );
      
      default:
        return (
          <textarea
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={getPlaceholder()}
            className={getClassName()}
            rows={1}
          />
        );
    }
  };

  return (
    <div 
      className="py-1 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BlockControls
        block={block}
        onAddBlock={onAddBlock}
        onDeleteBlock={onDeleteBlock}
        onShowTypeMenu={onShowTypeMenu}
        isVisible={isHovered}
      />
      {renderBlock()}
    </div>
  );
}
