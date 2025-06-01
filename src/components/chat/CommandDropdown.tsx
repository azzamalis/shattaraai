
import React, { useEffect, useRef } from 'react';
import { CommandOption } from '@/lib/types';

interface CommandDropdownProps {
  commands: CommandOption[];
  onSelect: (command: CommandOption) => void;
  onClose: () => void;
}

export function CommandDropdown({ commands, onSelect, onClose }: CommandDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const groupedCommands = commands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {} as Record<string, CommandOption[]>);

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 mb-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
    >
      {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
        <div key={category}>
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
            {category}
          </div>
          {categoryCommands.map((command) => (
            <button
              key={command.id}
              onClick={() => onSelect(command)}
              className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex flex-col"
            >
              <span className="font-medium text-sm">{command.label}</span>
              <span className="text-xs text-muted-foreground">{command.description}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
