import React, { useState, useRef, useEffect } from 'react';
import { NotionBlock, SlashCommand } from '@/lib/notionTypes';
import { 
  Type, Hash, List, CheckSquare, Code, Quote, Minus, 
  AlertCircle, ChevronRight, Image, Table, Smile,
  Link, FileText, Lightbulb, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedSlashMenuProps {
  position: { x: number; y: number };
  onSelect: (type: NotionBlock['type'], properties?: NotionBlock['properties']) => void;
  onClose: () => void;
  searchQuery?: string;
}

const slashCommands: SlashCommand[] = [
  // Basic blocks
  { 
    type: 'paragraph', 
    label: 'Text', 
    description: 'Just start writing with plain text',
    icon: Type, 
    shortcut: 'Ctrl+Alt+0', 
    category: 'basic',
    keywords: ['text', 'paragraph', 'plain']
  },
  { 
    type: 'h1', 
    label: 'Heading 1', 
    description: 'Big section heading',
    icon: Hash, 
    shortcut: 'Ctrl+Alt+1', 
    category: 'text',
    keywords: ['heading', 'h1', 'title', 'big']
  },
  { 
    type: 'h2', 
    label: 'Heading 2', 
    description: 'Medium section heading',
    icon: Hash, 
    shortcut: 'Ctrl+Alt+2', 
    category: 'text',
    keywords: ['heading', 'h2', 'subtitle']
  },
  { 
    type: 'h3', 
    label: 'Heading 3', 
    description: 'Small section heading',
    icon: Hash, 
    shortcut: 'Ctrl+Alt+3', 
    category: 'text',
    keywords: ['heading', 'h3', 'subheading']
  },
  
  // Lists
  { 
    type: 'ul', 
    label: 'Bulleted list', 
    description: 'Create a simple bulleted list',
    icon: List, 
    shortcut: 'Ctrl+Shift+8', 
    category: 'lists',
    keywords: ['bullet', 'list', 'unordered']
  },
  { 
    type: 'ol', 
    label: 'Numbered list', 
    description: 'Create a list with numbering',
    icon: List, 
    shortcut: 'Ctrl+Shift+7', 
    category: 'lists',
    keywords: ['numbered', 'list', 'ordered']
  },
  { 
    type: 'todo', 
    label: 'To-do list', 
    description: 'Track tasks with a to-do list',
    icon: CheckSquare, 
    shortcut: 'Ctrl+Shift+9', 
    category: 'lists',
    keywords: ['todo', 'task', 'checkbox', 'checklist']
  },
  
  // Advanced blocks
  { 
    type: 'callout', 
    label: 'Callout', 
    description: 'Make writing stand out',
    icon: AlertCircle, 
    category: 'advanced',
    keywords: ['callout', 'highlight', 'note', 'info']
  },
  { 
    type: 'toggle', 
    label: 'Toggle list', 
    description: 'Toggles can hide and show content inside',
    icon: ChevronRight, 
    category: 'advanced',
    keywords: ['toggle', 'collapse', 'expand', 'accordion']
  },
  { 
    type: 'code', 
    label: 'Code', 
    description: 'Capture a code snippet',
    icon: Code, 
    category: 'advanced',
    keywords: ['code', 'snippet', 'programming']
  },
  { 
    type: 'quote', 
    label: 'Quote', 
    description: 'Capture a quote',
    icon: Quote, 
    category: 'text',
    keywords: ['quote', 'citation', 'blockquote']
  },
  
  // Media
  { 
    type: 'image', 
    label: 'Image', 
    description: 'Upload or embed with a link',
    icon: Image, 
    category: 'media',
    keywords: ['image', 'picture', 'photo']
  },
  { 
    type: 'table', 
    label: 'Table', 
    description: 'Add a simple table',
    icon: Table, 
    category: 'database',
    keywords: ['table', 'grid', 'data']
  },
  
  // Other
  { 
    type: 'divider', 
    label: 'Divider', 
    description: 'Visually divide blocks',
    icon: Minus, 
    category: 'basic',
    keywords: ['divider', 'separator', 'line']
  },
  { 
    type: 'emoji', 
    label: 'Emoji', 
    description: 'Add an emoji',
    icon: Smile, 
    category: 'basic',
    keywords: ['emoji', 'emoticon', 'face']
  },
  { 
    type: 'link', 
    label: 'Link to page', 
    description: 'Link to another page',
    icon: Link, 
    category: 'basic',
    keywords: ['link', 'page', 'reference']
  }
];

const categories = [
  { id: 'basic', label: 'Basic blocks' },
  { id: 'text', label: 'Text' },
  { id: 'lists', label: 'Lists' },
  { id: 'media', label: 'Media' },
  { id: 'database', label: 'Database' },
  { id: 'advanced', label: 'Advanced blocks' }
];

export function EnhancedSlashMenu({ position, onSelect, onClose, searchQuery = '' }: EnhancedSlashMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [search, setSearch] = useState(searchQuery);

  // Filter commands based on search
  const filteredCommands = slashCommands.filter(command => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(query) ||
      command.description.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.includes(query))
    );
  });

  // Group commands by category
  const groupedCommands = categories.map(category => ({
    ...category,
    commands: filteredCommands.filter(command => command.category === category.id)
  })).filter(group => group.commands.length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          onSelect(selectedCommand.type);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, selectedIndex, filteredCommands]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div
      ref={menuRef}
      className={cn(
        "fixed bg-card dark:bg-card",
        "border border-border dark:border-border",
        "rounded-lg shadow-lg z-50 w-80 max-h-96 overflow-hidden",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
      style={{ left: position.x, top: position.y }}
    >
      {/* Search input */}
      <div className="p-3 border-b border-border">
        <input
          type="text"
          placeholder="Search for a block type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            "w-full px-3 py-2 text-sm",
            "bg-muted dark:bg-muted",
            "border border-input dark:border-input",
            "rounded-md",
            "text-foreground dark:text-foreground",
            "placeholder:text-muted-foreground dark:placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring"
          )}
          autoFocus
        />
      </div>

      {/* Commands */}
      <div className="max-h-80 overflow-y-auto">
        {groupedCommands.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No results found</p>
          </div>
        ) : (
          groupedCommands.map((group, groupIndex) => (
            <div key={group.id} className={groupIndex > 0 ? "border-t border-border" : ""}>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.label}
              </div>
              {group.commands.map((command, commandIndex) => {
                const Icon = command.icon;
                const globalIndex = filteredCommands.indexOf(command);
                const isSelected = globalIndex === selectedIndex;
                
                return (
                  <button
                    key={command.type}
                    onClick={() => onSelect(command.type)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left",
                      "transition-colors duration-150",
                      isSelected 
                        ? "bg-accent dark:bg-accent text-accent-foreground dark:text-accent-foreground" 
                        : "hover:bg-muted dark:hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground dark:text-foreground truncate">
                        {command.label}
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-muted-foreground truncate">
                        {command.description}
                      </div>
                    </div>
                    {command.shortcut && (
                      <div className="text-xs text-muted-foreground dark:text-muted-foreground font-mono flex-shrink-0">
                        {command.shortcut}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
