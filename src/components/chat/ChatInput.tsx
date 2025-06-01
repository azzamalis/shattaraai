
import React, { useState, useRef, useEffect } from 'react';
import { CommandOption } from '@/lib/types';
import { Mic, MicOff, Send, Search } from 'lucide-react';
import { CommandDropdown } from './CommandDropdown';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
}

const commandOptions: CommandOption[] = [
  // Learning category
  { id: 'quiz', label: 'Quiz', description: 'Generate a quiz', category: 'Learning' },
  { id: 'flashcards', label: 'Flashcards', description: 'Create flashcards', category: 'Learning' },
  { id: 'timeline', label: 'Timeline', description: 'Create timeline', category: 'Learning' },
  
  // Charts category
  { id: 'bar-chart', label: 'Bar Chart', description: 'Generate bar chart', category: 'Charts' },
  { id: 'line-chart', label: 'Line Chart', description: 'Generate line chart', category: 'Charts' },
  { id: 'pie-chart', label: 'Pie Chart', description: 'Generate pie chart', category: 'Charts' },
  
  // Diagrams category
  { id: 'venn-diagram', label: 'Venn Diagram', description: 'Create Venn diagram', category: 'Diagrams' },
  { id: 'flow-chart', label: 'Flow Chart', description: 'Create flow chart', category: 'Diagrams' },
  { id: 'mind-map', label: 'Mind Map', description: 'Create mind map', category: 'Diagrams' }
];

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === value.length - 1 - commandSearch.length) {
      setShowCommandMenu(true);
      setCommandSearch(value.slice(atIndex + 1));
    } else {
      setShowCommandMenu(false);
      setCommandSearch('');
    }
  }, [value, commandSearch]);

  const filteredCommands = commandOptions.filter(cmd =>
    cmd.label.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.description.toLowerCase().includes(commandSearch.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend(value.trim());
    }
  };

  const handleCommandSelect = (command: CommandOption) => {
    const atIndex = value.lastIndexOf('@');
    const newValue = value.slice(0, atIndex) + command.label + ' ';
    onChange(newValue);
    setShowCommandMenu(false);
    inputRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  const getVoiceButton = () => {
    if (isRecording) {
      return (
        <button
          onClick={handleVoiceToggle}
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          title="Stop recording"
        >
          <MicOff className="h-4 w-4" />
        </button>
      );
    }
    
    if (value.trim()) {
      return (
        <button
          onClick={handleSend}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          title="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      );
    }
    
    return (
      <button
        onClick={handleVoiceToggle}
        className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-accent transition-colors"
        title="Start recording"
      >
        <Mic className="h-4 w-4" />
      </button>
    );
  };

  return (
    <div className="relative">
      {showCommandMenu && (
        <CommandDropdown
          commands={filteredCommands}
          onSelect={handleCommandSelect}
          onClose={() => setShowCommandMenu(false)}
        />
      )}
      
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
        <button className="p-2 rounded-full hover:bg-accent transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground"
        />
        
        {getVoiceButton()}
      </div>
    </div>
  );
}
