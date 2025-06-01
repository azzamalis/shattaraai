import React, { useRef, useEffect } from 'react';
import { NotesBlock } from '@/lib/types';
import { Type, Hash, List, CheckSquare, Code, Quote, Table, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlashCommandMenuProps {
  position: { x: number; y: number };
  onSelect: (type: NotesBlock['type']) => void;
  onClose: () => void;
}

const slashCommands = [
  { type: 'paragraph' as const, label: 'Paragraph', shortcut: 'Ctrl+Alt+0', icon: Type },
  { type: 'h1' as const, label: 'Heading 1', shortcut: 'Ctrl+Alt+1', icon: Hash },
  { type: 'h2' as const, label: 'Heading 2', shortcut: 'Ctrl+Alt+2', icon: Hash },
  { type: 'h3' as const, label: 'Heading 3', shortcut: 'Ctrl+Alt+3', icon: Hash },
  { type: 'ul' as const, label: 'Bullet List', shortcut: 'Ctrl+Shift+8', icon: List },
  { type: 'ol' as const, label: 'Numbered List', shortcut: 'Ctrl+Shift+7', icon: List },
  { type: 'todo' as const, label: 'Checklist', shortcut: 'Ctrl+Shift+9', icon: CheckSquare },
  { type: 'code' as const, label: 'Code Block', shortcut: 'Ctrl+Alt+C', icon: Code },
  { type: 'quote' as const, label: 'Quote', shortcut: '', icon: Quote },
  { type: 'divider' as const, label: 'Divider', shortcut: '', icon: Minus },
];

export function SlashCommandMenu({ position, onSelect, onClose }: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed bg-dashboard-card dark:bg-dashboard-card",
        "border border-dashboard-separator dark:border-dashboard-separator",
        "rounded-lg shadow-lg z-50 w-72 max-h-60 overflow-y-auto"
      )}
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-2">
        <div className="text-xs font-medium text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 px-2 py-1 mb-1">
          Basic Blocks
        </div>
        {slashCommands.map((command) => {
          const Icon = command.icon;
          return (
            <button
              key={command.type}
              onClick={() => onSelect(command.type)}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-2 text-left",
                "hover:bg-dashboard-bg dark:hover:bg-dashboard-bg",
                "rounded-md transition-colors"
              )}
            >
              <Icon className="h-[14px] w-[14px] text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70" />
              <div className="flex-1">
                <div className="text-sm font-medium text-dashboard-text dark:text-dashboard-text">
                  {command.label}
                </div>
              </div>
              {command.shortcut && (
                <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
                  {command.shortcut}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
