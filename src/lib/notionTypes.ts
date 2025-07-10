// Enhanced NotesBlock types for Notion-like experience
export interface NotionBlock {
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'todo' | 'code' | 'quote' | 'divider' | 
        'callout' | 'toggle' | 'column' | 'image' | 'table' | 'emoji' | 'link';
  content: string;
  properties?: {
    color?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
    backgroundColor?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
    emoji?: string;
    checked?: boolean;
    expanded?: boolean;
    level?: number;
    alignment?: 'left' | 'center' | 'right';
    url?: string;
    caption?: string;
  };
  children?: NotionBlock[];
}

export interface SlashCommand {
  type: NotionBlock['type'];
  label: string;
  description: string;
  icon: any; // Lucide icon component
  shortcut?: string;
  category: 'basic' | 'text' | 'lists' | 'media' | 'database' | 'ai' | 'advanced';
  keywords: string[];
}

export interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  blocks: NotionBlock[];
}

export interface CommandPaletteAction {
  id: string;
  label: string;
  description: string;
  icon: any;
  shortcut?: string;
  category: 'editor' | 'format' | 'block' | 'view' | 'help';
  action: () => void;
}