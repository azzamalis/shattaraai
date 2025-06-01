
import React, { useState } from 'react';
import { NotesBlock } from '@/lib/types';
import { BlockControls } from './BlockControls';

interface BlockRendererProps {
  block: NotesBlock;
  onUpdate: (updates: Partial<NotesBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: () => void;
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
    const baseClasses = 'w-full bg-transparent border-0 outline-none focus:outline-none resize-none min-h-[1.5rem] text-[#FFF] placeholder:text-[#A6A6A6] leading-relaxed';
    
    switch (block.type) {
      case 'h1':
        return `${baseClasses} text-3xl font-bold`;
      case 'h2':
        return `${baseClasses} text-2xl font-semibold`;
      case 'h3':
        return `${baseClasses} text-xl font-medium`;
      case 'code':
        return `${baseClasses} font-mono bg-[#4B4B4B] p-3 rounded text-sm`;
      case 'quote':
        return `${baseClasses} border-l-4 border-[#00A3FF] pl-4 italic`;
      default:
        return baseClasses;
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'divider':
        return <hr className="border-[#4B4B4B] my-4" />;
      
      case 'ul':
        return (
          <div className="flex items-start gap-2">
            <span className="text-[#A6A6A6] mt-1">•</span>
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
            <span className="text-[#A6A6A6] mt-1">1.</span>
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
            <input type="checkbox" className="mt-1" />
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
