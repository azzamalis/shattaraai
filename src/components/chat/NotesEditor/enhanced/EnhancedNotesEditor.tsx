import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NotionBlock } from '@/lib/notionTypes';
import { EnhancedBlockRenderer } from './EnhancedBlockRenderer';
import { EnhancedSlashMenu } from './EnhancedSlashMenu';
import { CommandPalette } from './CommandPalette';
import { cn } from '@/lib/utils';

interface EnhancedNotesEditorProps {
  useDynamicMenuPosition?: boolean;
  className?: string;
}

export function EnhancedNotesEditor({
  useDynamicMenuPosition = false,
  className
}: EnhancedNotesEditorProps) {
  const [blocks, setBlocks] = useState<NotionBlock[]>([{
    id: '1',
    type: 'paragraph',
    content: '',
    properties: {}
  }]);
  
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [currentBlockId, setCurrentBlockId] = useState<string>('');
  const [selectedBlockIds, setSelectedBlockIds] = useState<Set<string>>(new Set());
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const autoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      // Save to localStorage for demo purposes
      localStorage.setItem('enhanced-notes', JSON.stringify(blocks));
      console.log('Auto-saved notes');
    }, 1000);
  }, [blocks]);

  useEffect(() => {
    autoSave();
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [autoSave]);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem('enhanced-notes');
    if (saved) {
      try {
        const parsedBlocks = JSON.parse(saved);
        if (parsedBlocks.length > 0) {
          setBlocks(parsedBlocks);
        }
      } catch (error) {
        console.error('Failed to load saved notes:', error);
      }
    }
  }, []);

  const addBlock = useCallback((afterId: string, type: NotionBlock['type'] = 'paragraph', properties: NotionBlock['properties'] = {}) => {
    const newBlock: NotionBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      properties,
      children: []
    };
    
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });
    
    return newBlock.id;
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<NotionBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    if (blocks.length === 1) return;
    
    setBlocks(prev => {
      const filtered = prev.filter(block => block.id !== id);
      if (filtered.length === 0) {
        return [{
          id: Date.now().toString(),
          type: 'paragraph',
          content: '',
          properties: {}
        }];
      }
      return filtered;
    });
    
    setSelectedBlockIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, [blocks.length]);

  const moveBlock = useCallback((id: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const currentIndex = prev.findIndex(block => block.id === id);
      if (currentIndex === -1) return prev;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);
      
      return newBlocks;
    });
  }, []);

  const handleSlashCommand = useCallback((blockId: string, type: NotionBlock['type'], properties?: NotionBlock['properties']) => {
    updateBlock(blockId, { type, content: '', properties: properties || {} });
    setShowSlashMenu(false);
  }, [updateBlock]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Command Palette shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setShowCommandPalette(true);
      return;
    }

    // Fullscreen toggle
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      setIsFullscreen(!isFullscreen);
      return;
    }

    // Handle slash commands
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setCurrentBlockId(blockId);
      setShowSlashMenu(true);

      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      setSlashMenuPosition({
        x: rect.left,
        y: rect.bottom
      });
      return;
    }

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlockId = addBlock(blockId);

      setTimeout(() => {
        const newBlockElement = document.querySelector(`[data-block-id="${newBlockId}"]`) as HTMLElement;
        newBlockElement?.focus();
      }, 10);
    }

    // Handle Backspace on empty block
    if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
      e.preventDefault();
      const currentIndex = blocks.findIndex(b => b.id === blockId);
      const prevBlock = blocks[currentIndex - 1];
      if (prevBlock) {
        deleteBlock(blockId);
        setTimeout(() => {
          const prevBlockElement = document.querySelector(`[data-block-id="${prevBlock.id}"]`) as HTMLElement;
          prevBlockElement?.focus();
        }, 10);
      }
    }

    // Handle keyboard shortcuts for formatting
    if (e.ctrlKey && e.altKey) {
      const shortcuts = {
        '1': 'h1', '2': 'h2', '3': 'h3', '0': 'paragraph'
      } as const;
      
      if (shortcuts[e.key]) {
        e.preventDefault();
        updateBlock(blockId, { type: shortcuts[e.key] });
      }
    }

    if (e.ctrlKey && e.shiftKey) {
      const shortcuts = {
        '7': 'ol', '8': 'ul', '9': 'todo'
      } as const;
      
      if (shortcuts[e.key]) {
        e.preventDefault();
        updateBlock(blockId, { type: shortcuts[e.key] });
      }
    }
  }, [blocks, addBlock, deleteBlock, updateBlock, isFullscreen]);

  const handleShowTypeMenu = useCallback((event: React.MouseEvent | null, blockId: string) => {
    if (useDynamicMenuPosition && event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setSlashMenuPosition({
        x: rect.left,
        y: rect.bottom
      });
    } else {
      setSlashMenuPosition({ x: 200, y: 200 });
    }
    setCurrentBlockId(blockId);
    setShowSlashMenu(true);
  }, [useDynamicMenuPosition]);

  const handleBlockSelect = useCallback((e: React.MouseEvent, blockId: string) => {
    if (e.ctrlKey || e.metaKey) {
      setSelectedBlockIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(blockId)) {
          newSet.delete(blockId);
        } else {
          newSet.add(blockId);
        }
        return newSet;
      });
    } else if (e.shiftKey && selectedBlockIds.size > 0) {
      // Range selection logic would go here
      const lastSelected = Array.from(selectedBlockIds)[selectedBlockIds.size - 1];
      const currentIndex = blocks.findIndex(b => b.id === blockId);
      const lastIndex = blocks.findIndex(b => b.id === lastSelected);
      
      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);
      
      const rangeIds = blocks.slice(start, end + 1).map(b => b.id);
      setSelectedBlockIds(new Set(rangeIds));
    } else {
      setSelectedBlockIds(new Set([blockId]));
    }
  }, [selectedBlockIds, blocks]);

  const commandPaletteActions = [
    {
      id: 'toggle-fullscreen',
      label: 'Toggle Fullscreen',
      description: 'Enter or exit fullscreen mode',
      icon: 'Maximize',
      shortcut: 'Ctrl+Shift+F',
      category: 'view' as const,
      action: () => setIsFullscreen(!isFullscreen)
    },
    {
      id: 'export-markdown',
      label: 'Export as Markdown',
      description: 'Export your notes as Markdown',
      icon: 'Download',
      category: 'editor' as const,
      action: () => {
        const markdown = blocks.map(block => {
          switch (block.type) {
            case 'h1': return `# ${block.content}`;
            case 'h2': return `## ${block.content}`;
            case 'h3': return `### ${block.content}`;
            case 'quote': return `> ${block.content}`;
            case 'code': return `\`\`\`\n${block.content}\n\`\`\``;
            case 'ul': return `- ${block.content}`;
            case 'ol': return `1. ${block.content}`;
            case 'todo': return `- [${block.properties?.checked ? 'x' : ' '}] ${block.content}`;
            default: return block.content;
          }
        }).join('\n\n');
        
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.md';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  ];

  return (
    <div 
      ref={editorRef} 
      className={cn(
        "h-full overflow-y-auto bg-background transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 bg-background",
        className
      )}
    >
      <div className={cn(
        "max-w-4xl mx-auto p-6",
        isFullscreen ? "pl-16 pt-12" : "pl-16"
      )}>

        {/* Blocks */}
        <div className="space-y-1">
          {blocks.map(block => (
            <EnhancedBlockRenderer
              key={block.id}
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onAddBlock={() => addBlock(block.id)}
              onDeleteBlock={() => deleteBlock(block.id)}
              onShowTypeMenu={(event) => handleShowTypeMenu(event, block.id)}
              onMoveBlock={(direction) => moveBlock(block.id, direction)}
              isSelected={selectedBlockIds.has(block.id)}
              isMultiSelected={selectedBlockIds.size > 1 && selectedBlockIds.has(block.id)}
              onSelect={(e) => handleBlockSelect(e, block.id)}
            />
          ))}
        </div>

        {/* Empty state hint */}
        {blocks.length === 1 && blocks[0].content === '' && (
          <div className="mt-8 text-center text-muted-foreground">
            <p className="text-lg mb-2">Start writing...</p>
            <p className="text-sm">Type <code className="px-1 py-0.5 bg-muted rounded">/</code> for commands</p>
            <p className="text-sm">Press <code className="px-1 py-0.5 bg-muted rounded">Ctrl+K</code> for the command palette</p>
          </div>
        )}
      </div>

      {/* Enhanced Slash Menu */}
      {showSlashMenu && (
        <EnhancedSlashMenu
          position={slashMenuPosition}
          onSelect={(type, properties) => handleSlashCommand(currentBlockId, type, properties)}
          onClose={() => setShowSlashMenu(false)}
        />
      )}

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          actions={commandPaletteActions}
          onClose={() => setShowCommandPalette(false)}
        />
      )}
    </div>
  );
}