
import React from 'react';
import { NotesBlock } from '@/lib/types';

interface BlockRendererProps {
  block: NotesBlock;
  onUpdate: (updates: Partial<NotesBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function BlockRenderer({ block, onUpdate, onKeyDown }: BlockRendererProps) {
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
    const baseClasses = 'w-full bg-transparent border-0 outline-none resize-none min-h-[1.5rem] text-foreground placeholder:text-muted-foreground leading-relaxed';
    
    switch (block.type) {
      case 'h1':
        return `${baseClasses} text-3xl font-bold`;
      case 'h2':
        return `${baseClasses} text-2xl font-semibold`;
      case 'h3':
        return `${baseClasses} text-xl font-medium`;
      case 'code':
        return `${baseClasses} font-mono bg-muted p-3 rounded text-sm`;
      case 'quote':
        return `${baseClasses} border-l-4 border-primary pl-4 italic`;
      default:
        return baseClasses;
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'divider':
        return <hr className="border-border my-4" />;
      
      case 'ul':
        return (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground mt-1">•</span>
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
            <span className="text-muted-foreground mt-1">1.</span>
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
    <div className="py-1">
      {renderBlock()}
    </div>
  );
}
