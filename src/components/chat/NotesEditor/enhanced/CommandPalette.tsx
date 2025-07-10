import React, { useState, useRef, useEffect } from 'react';
import { CommandPaletteAction } from '@/lib/notionTypes';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  actions: CommandPaletteAction[];
  onClose: () => void;
}

export function CommandPalette({ actions, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter actions based on search
  const filteredActions = actions.filter(action => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      action.label.toLowerCase().includes(query) ||
      action.description.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredActions.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedAction = filteredActions[selectedIndex];
        if (selectedAction) {
          selectedAction.action();
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, selectedIndex, filteredActions]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className={cn(
        "w-full max-w-lg mx-4",
        "bg-card dark:bg-card",
        "border border-border dark:border-border",
        "rounded-lg shadow-lg",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}>
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "flex-1 bg-transparent text-foreground dark:text-foreground",
              "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
              "focus:outline-none"
            )}
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Esc</kbd>
            <span>to close</span>
          </div>
        </div>

        {/* Actions List */}
        <div className="max-h-80 overflow-y-auto">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Command className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No commands found</p>
            </div>
          ) : (
            filteredActions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => {
                  action.action();
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left",
                  "transition-colors duration-150",
                  index === selectedIndex 
                    ? "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground" 
                    : "hover:bg-muted dark:hover:bg-muted"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground dark:text-foreground truncate">
                    {action.label}
                  </div>
                  <div className="text-xs text-muted-foreground dark:text-muted-foreground truncate">
                    {action.description}
                  </div>
                </div>
                {action.shortcut && (
                  <div className="text-xs text-muted-foreground dark:text-muted-foreground font-mono flex-shrink-0">
                    {action.shortcut}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}