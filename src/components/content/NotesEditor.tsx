
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Hash, Type, List, CheckSquare } from 'lucide-react';

interface NotesEditorProps {
  isRecording: boolean;
}

interface SlashCommand {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  action: () => void;
}

export function NotesEditor({ isRecording }: NotesEditorProps) {
  const [content, setContent] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slashCommands: SlashCommand[] = [
    {
      id: 'h1',
      label: 'Heading 1',
      icon: <Hash className="h-4 w-4" />,
      description: 'Large heading',
      action: () => insertText('# ')
    },
    {
      id: 'h2',
      label: 'Heading 2',
      icon: <Hash className="h-4 w-4" />,
      description: 'Medium heading',
      action: () => insertText('## ')
    },
    {
      id: 'h3',
      label: 'Heading 3',
      icon: <Hash className="h-4 w-4" />,
      description: 'Small heading',
      action: () => insertText('### ')
    },
    {
      id: 'paragraph',
      label: 'Paragraph',
      icon: <Type className="h-4 w-4" />,
      description: 'Plain text paragraph',
      action: () => insertText('')
    },
    {
      id: 'bullet',
      label: 'Bullet List',
      icon: <List className="h-4 w-4" />,
      description: 'Bulleted list item',
      action: () => insertText('• ')
    },
    {
      id: 'todo',
      label: 'To-do',
      icon: <CheckSquare className="h-4 w-4" />,
      description: 'Checkbox item',
      action: () => insertText('☐ ')
    }
  ];

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const beforeSlash = content.substring(0, start - 1);
      const afterCursor = content.substring(end);
      
      const newContent = beforeSlash + text + afterCursor;
      setContent(newContent);
      
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start - 1 + text.length;
          textareaRef.current.selectionStart = newPosition;
          textareaRef.current.selectionEnd = newPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
    setShowCommands(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setShowCommands(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setContent(newContent);
    setCursorPosition(cursorPos);
    
    const beforeCursor = newContent.substring(0, cursorPos);
    const lastChar = beforeCursor[beforeCursor.length - 1];
    const prevChar = beforeCursor[beforeCursor.length - 2];
    
    if (lastChar === '/' && (!prevChar || prevChar === '\n' || prevChar === ' ')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-dashboard-bg">
      <div className="flex-1 relative">
        <ScrollArea className="h-full">
          <div className="p-6">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? "Taking notes during recording..." : "Start typing your notes... Use '/' for commands"}
              className="w-full h-96 min-h-[400px] resize-none bg-transparent border-none outline-none text-dashboard-text placeholder:text-dashboard-text-secondary text-base leading-relaxed"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        </ScrollArea>
        
        {showCommands && (
          <div className="absolute left-6 bg-dashboard-card border border-dashboard-separator rounded-lg shadow-lg p-2 z-50 min-w-[240px]">
            <div className="space-y-1">
              {slashCommands.map((command) => (
                <Button
                  key={command.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-dashboard-card-hover text-left"
                  onClick={command.action}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-dashboard-text-secondary">
                      {command.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-dashboard-text">
                        {command.label}
                      </div>
                      <div className="text-xs text-dashboard-text-secondary">
                        {command.description}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
