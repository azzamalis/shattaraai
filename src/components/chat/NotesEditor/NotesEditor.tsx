
import React, { useState, useRef, useEffect } from 'react';
import { NotesBlock } from '@/lib/types';
import { BlockRenderer } from './BlockRenderer';
import { SlashCommandMenu } from './SlashCommandMenu';

export function NotesEditor() {
  const [blocks, setBlocks] = useState<NotesBlock[]>([
    { id: '1', type: 'paragraph', content: '' }
  ]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [currentBlockId, setCurrentBlockId] = useState<string>('');
  const editorRef = useRef<HTMLDivElement>(null);

  const addBlock = (afterId: string, type: NotesBlock['type'] = 'paragraph') => {
    const newBlock: NotesBlock = {
      id: Date.now().toString(),
      type,
      content: ''
    };

    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    return newBlock.id;
  };

  const updateBlock = (id: string, updates: Partial<NotesBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length === 1) return;
    
    setBlocks(prev => prev.filter(block => block.id !== id));
  };

  const handleSlashCommand = (blockId: string, type: NotesBlock['type']) => {
    updateBlock(blockId, { type, content: '' });
    setShowSlashMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    // Handle slash commands
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setCurrentBlockId(blockId);
      setShowSlashMenu(true);
      
      // Calculate position for slash menu
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
      return;
    }

    // Handle Enter key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlockId = addBlock(blockId);
      
      // Focus the new block
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

    // Handle keyboard shortcuts
    if (e.ctrlKey && e.altKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          updateBlock(blockId, { type: 'h1' });
          break;
        case '2':
          e.preventDefault();
          updateBlock(blockId, { type: 'h2' });
          break;
        case '3':
          e.preventDefault();
          updateBlock(blockId, { type: 'h3' });
          break;
        case '0':
          e.preventDefault();
          updateBlock(blockId, { type: 'paragraph' });
          break;
      }
    }

    if (e.ctrlKey && e.shiftKey) {
      switch (e.key) {
        case '7':
          e.preventDefault();
          updateBlock(blockId, { type: 'ol' });
          break;
        case '8':
          e.preventDefault();
          updateBlock(blockId, { type: 'ul' });
          break;
        case '9':
          e.preventDefault();
          updateBlock(blockId, { type: 'todo' });
          break;
      }
    }
  };

  return (
    <div ref={editorRef} className="h-full overflow-y-auto bg-[#000]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-1">
          {blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onKeyDown={(e) => handleKeyDown(e, block.id)}
              onAddBlock={() => addBlock(block.id)}
              onDeleteBlock={() => deleteBlock(block.id)}
              onShowTypeMenu={() => {
                setCurrentBlockId(block.id);
                setShowSlashMenu(true);
                setSlashMenuPosition({ x: 200, y: 200 });
              }}
            />
          ))}
        </div>
      </div>

      {showSlashMenu && (
        <SlashCommandMenu
          position={slashMenuPosition}
          onSelect={(type) => handleSlashCommand(currentBlockId, type)}
          onClose={() => setShowSlashMenu(false)}
        />
      )}
    </div>
  );
}
