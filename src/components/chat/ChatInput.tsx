import React, { useState, useRef, useEffect } from 'react';
import { CommandOption } from '@/lib/types';
import { Mic, MicOff, Send, Search, AtSign, Globe } from 'lucide-react';
import { CommandDropdown } from './CommandDropdown';
import { cn } from '@/lib/utils';

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
  const [searchActive, setSearchActive] = useState(false);
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
    const newValue = value.slice(0, atIndex) + 'Create @' + command.label + ' on ';
    onChange(newValue);
    setShowCommandMenu(false);
    inputRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
  };

  const getVoiceButton = () => {
    if (isRecording) {
      return (
        <button
          onClick={handleVoiceToggle}
          className={cn(
            "p-2 rounded-full transition-colors",
            "bg-red-500 text-white hover:bg-red-600"
          )}
          title="Stop recording"
        >
          <MicOff className="h-[14px] w-[14px]" />
        </button>
      );
    }
    
    if (value.trim()) {
      return (
        <button
          onClick={handleSend}
          className={cn(
            "p-2 rounded-full transition-colors",
            "bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90"
          )}
          title="Send message"
        >
          <Send className="h-[14px] w-[14px]" />
        </button>
      );
    }
    
    return (
      <button
        onClick={handleVoiceToggle}
        className={cn(
          "p-2 rounded-full transition-colors",
          "bg-dashboard-bg dark:bg-dashboard-bg",
          "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
          "hover:bg-dashboard-card dark:hover:bg-dashboard-card",
          "hover:text-dashboard-text dark:hover:text-dashboard-text"
        )}
        title="Start recording"
      >
        <Mic className="h-[14px] w-[14px]" />
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
      
      <div className={cn(
        "rounded-lg border p-1",
        "bg-dashboard-bg dark:bg-dashboard-bg",
        "border-dashboard-separator dark:border-dashboard-separator"
      )}>
        {/* Main input area */}
        <div className="flex items-center gap-3 p-3">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything"
            className={cn(
              "flex-1 bg-transparent border-0 outline-none",
              "text-sm text-dashboard-text dark:text-dashboard-text",
              "placeholder:text-dashboard-text-secondary/70 dark:placeholder:text-dashboard-text-secondary/70",
              "focus:outline-none focus:ring-0 focus:border-0",
              "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0",
              "[&_@]:text-[#00A3FF]"
            )}
          />
          
          {getVoiceButton()}
        </div>
        
        {/* Command and search options */}
        <div className="flex items-center gap-3 px-3 pb-2">
          <button 
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-colors",
              "bg-[#00A3FF]/10 text-[#00A3FF]",
              "hover:bg-[#00A3FF]/20"
            )}
            onClick={() => onChange(value + '@')}
          >
            <AtSign className="h-[14px] w-[14px]" />
            Commands
          </button>

          <button
            onClick={() => setSearchActive(!searchActive)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-colors",
              searchActive 
                ? "bg-[#00A3FF]/10 text-[#00A3FF] hover:bg-[#00A3FF]/20"
                : "bg-dashboard-bg dark:bg-dashboard-bg text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70 hover:bg-dashboard-card dark:hover:bg-dashboard-card hover:text-dashboard-text dark:hover:text-dashboard-text"
            )}
          >
            <Globe className="h-[14px] w-[14px]" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
