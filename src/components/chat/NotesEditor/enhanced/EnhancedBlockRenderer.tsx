import React, { useState, useRef } from 'react';
import { NotionBlock } from '@/lib/notionTypes';
import { EnhancedBlockControls } from './EnhancedBlockControls';
import { cn } from '@/lib/utils';
import { ChevronRight, AlertCircle, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface EnhancedBlockRendererProps {
  block: NotionBlock;
  onUpdate: (updates: Partial<NotionBlock>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onAddBlock: () => void;
  onDeleteBlock: () => void;
  onShowTypeMenu: (e: React.MouseEvent) => void;
  onMoveBlock?: (direction: 'up' | 'down') => void;
  isSelected?: boolean;
  isMultiSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export function EnhancedBlockRenderer({ 
  block, 
  onUpdate, 
  onKeyDown, 
  onAddBlock, 
  onDeleteBlock,
  onShowTypeMenu,
  onMoveBlock,
  isSelected = false,
  isMultiSelected = false,
  onSelect
}: EnhancedBlockRendererProps) {
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (content: string) => {
    onUpdate({ content });
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleColorChange = (color: NotionBlock['properties']['color']) => {
    onUpdate({ 
      properties: { ...block.properties, color } 
    });
  };

  const handleBackgroundChange = (backgroundColor: NotionBlock['properties']['backgroundColor']) => {
    onUpdate({ 
      properties: { ...block.properties, backgroundColor } 
    });
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
      case 'callout':
        return 'Type something...';
      case 'toggle':
        return 'Toggle';
      case 'table':
        return 'Table content';
      case 'link':
        return 'Link title';
      default:
        return 'Type / for commands';
    }
  };

  const getTextColorClass = () => {
    if (!block.properties?.color || block.properties.color === 'default') return '';
    
    const colorMap = {
      gray: 'text-gray-600 dark:text-gray-400',
      brown: 'text-amber-700 dark:text-amber-400',
      orange: 'text-orange-600 dark:text-orange-400',
      yellow: 'text-yellow-600 dark:text-yellow-400',
      green: 'text-green-600 dark:text-green-400',
      blue: 'text-blue-600 dark:text-blue-400',
      purple: 'text-purple-600 dark:text-purple-400',
      pink: 'text-pink-600 dark:text-pink-400',
      red: 'text-red-600 dark:text-red-400'
    };
    
    return colorMap[block.properties.color] || '';
  };

  const getBackgroundColorClass = () => {
    if (!block.properties?.backgroundColor || block.properties.backgroundColor === 'default') return '';
    
    const bgMap = {
      gray: 'bg-gray-100 dark:bg-gray-900',
      brown: 'bg-amber-50 dark:bg-amber-900/20',
      orange: 'bg-orange-50 dark:bg-orange-900/20',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20',
      green: 'bg-green-50 dark:bg-green-900/20',
      blue: 'bg-blue-50 dark:bg-blue-900/20',
      purple: 'bg-purple-50 dark:bg-purple-900/20',
      pink: 'bg-pink-50 dark:bg-pink-900/20',
      red: 'bg-red-50 dark:bg-red-900/20'
    };
    
    return bgMap[block.properties.backgroundColor] || '';
  };

  const getClassName = () => {
    const baseClasses = cn(
      "w-full bg-transparent border-0 outline-none resize-none min-h-[1.5rem]",
      "text-foreground dark:text-foreground",
      "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
      "leading-relaxed",
      getTextColorClass()
    );
    
    switch (block.type) {
      case 'h1':
        return cn(baseClasses, "text-2xl font-bold");
      case 'h2':
        return cn(baseClasses, "text-xl font-semibold");
      case 'h3':
        return cn(baseClasses, "text-lg font-medium");
      case 'code':
        return cn(baseClasses, "font-mono bg-muted dark:bg-muted p-3 rounded text-sm");
      case 'quote':
        return cn(baseClasses, "border-l-4 border-primary pl-4 italic");
      default:
        return baseClasses;
    }
  };

  const renderToggleBlock = () => (
    <div className={cn("p-3 rounded-lg border border-border", getBackgroundColorClass())}>
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => onUpdate({ 
            properties: { ...block.properties, expanded: !block.properties?.expanded } 
          })}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <ChevronRight 
            className={cn(
              "h-4 w-4 transition-transform",
              block.properties?.expanded ? "rotate-90" : ""
            )} 
          />
        </button>
        <textarea
          ref={textareaRef}
          data-block-id={block.id}
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={getPlaceholder()}
          className={cn(getClassName(), "flex-1")}
          rows={1}
        />
      </div>
      {block.properties?.expanded && block.children && (
        <div className="ml-6 space-y-1">
          {/* Render child blocks here if needed */}
          <div className="text-sm text-muted-foreground">
            Toggle content would be rendered here
          </div>
        </div>
      )}
    </div>
  );

  const renderCalloutBlock = () => (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg border border-border",
      getBackgroundColorClass()
    )}>
      <div className="flex-shrink-0 mt-1">
        <AlertCircle className="h-4 w-4 text-muted-foreground" />
      </div>
      <textarea
        ref={textareaRef}
        data-block-id={block.id}
        value={block.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={getPlaceholder()}
        className={cn(getClassName(), "flex-1")}
        rows={1}
      />
    </div>
  );

  const renderImageBlock = () => (
    <div className={cn("p-4 border-2 border-dashed border-border rounded-lg text-center", getBackgroundColorClass())}>
      <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2">
        Click to upload an image or paste a URL
      </p>
      <textarea
        ref={textareaRef}
        data-block-id={block.id}
        value={block.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Image URL or caption..."
        className={cn(getClassName(), "text-center")}
        rows={1}
      />
    </div>
  );

  const renderTableBlock = () => (
    <div className={cn("border border-border rounded-lg overflow-hidden", getBackgroundColorClass())}>
      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="p-2 bg-muted">
          <div className="text-xs font-medium text-muted-foreground">Column 1</div>
        </div>
        <div className="p-2 bg-muted">
          <div className="text-xs font-medium text-muted-foreground">Column 2</div>
        </div>
        <div className="p-2 bg-muted">
          <div className="text-xs font-medium text-muted-foreground">Column 3</div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        <div className="p-2">
          <textarea
            ref={textareaRef}
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Cell content..."
            className={cn(getClassName(), "w-full")}
            rows={1}
          />
        </div>
        <div className="p-2">
          <div className="text-sm text-muted-foreground">Cell 2</div>
        </div>
        <div className="p-2">
          <div className="text-sm text-muted-foreground">Cell 3</div>
        </div>
      </div>
    </div>
  );

  const renderLinkBlock = () => (
    <div className={cn("flex items-center gap-2 p-2 border border-border rounded-lg", getBackgroundColorClass())}>
      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <textarea
        ref={textareaRef}
        data-block-id={block.id}
        value={block.content}
        onChange={(e) => handleContentChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={getPlaceholder()}
        className={cn(getClassName(), "flex-1")}
        rows={1}
      />
    </div>
  );

  const renderBlock = () => {
    const containerClass = cn(
      getBackgroundColorClass(),
      isSelected && "ring-2 ring-primary",
      isMultiSelected && "ring-2 ring-blue-400"
    );

    switch (block.type) {
      case 'divider':
        return <hr className="border-border dark:border-border my-4" />;
      
      case 'toggle':
        return <div className={containerClass}>{renderToggleBlock()}</div>;
      
      case 'callout':
        return <div className={containerClass}>{renderCalloutBlock()}</div>;
      
      case 'image':
        return <div className={containerClass}>{renderImageBlock()}</div>;
      
      case 'table':
        return <div className={containerClass}>{renderTableBlock()}</div>;
      
      case 'link':
        return <div className={containerClass}>{renderLinkBlock()}</div>;
      
      case 'ul':
        return (
          <div className={cn("flex items-start gap-2", containerClass)}>
            <span className="text-muted-foreground mt-1">•</span>
            <textarea
              ref={textareaRef}
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
          <div className={cn("flex items-start gap-2", containerClass)}>
            <span className="text-muted-foreground mt-1">1.</span>
            <textarea
              ref={textareaRef}
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
          <div className={cn("flex items-start gap-2", containerClass)}>
            <input 
              type="checkbox" 
              checked={block.properties?.checked || false}
              onChange={(e) => onUpdate({ 
                properties: { ...block.properties, checked: e.target.checked } 
              })}
              className="mt-1 border-border dark:border-border" 
            />
            <textarea
              ref={textareaRef}
              data-block-id={block.id}
              value={block.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={getPlaceholder()}
              className={cn(
                getClassName(),
                block.properties?.checked && "line-through opacity-60"
              )}
              rows={1}
            />
          </div>
        );
      
      default:
        return (
          <textarea
            ref={textareaRef}
            data-block-id={block.id}
            value={block.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={getPlaceholder()}
            className={cn(getClassName(), containerClass)}
            rows={1}
          />
        );
    }
  };

  return (
    <div 
      className={cn(
        "py-1 relative group transition-all duration-200",
        isSelected && "bg-accent/50",
        isMultiSelected && "bg-blue-50 dark:bg-blue-900/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <EnhancedBlockControls
        block={block}
        onAddBlock={onAddBlock}
        onDeleteBlock={onDeleteBlock}
        onShowTypeMenu={onShowTypeMenu}
        onMoveBlock={onMoveBlock}
        onColorChange={handleColorChange}
        onBackgroundChange={handleBackgroundChange}
        isVisible={isHovered || isSelected}
      />
      {renderBlock()}
    </div>
  );
}