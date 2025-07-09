import React, { useState, useRef, useEffect } from 'react';
import { CommandOption } from '@/lib/types';
import { Mic, MicOff, Send, Search, AtSign, Globe, Plus, X } from 'lucide-react';
import { CommandDropdown } from './CommandDropdown';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const academicLevels = [
  'Work Professional',
  'University', 
  'High School',
  'Middle School',
  'Elementary'
];

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [academicLevelOpen, setAcademicLevelOpen] = useState(false);
  const [selectedAcademicLevel, setSelectedAcademicLevel] = useState('University');
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleVoiceToggle}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                <MicOff className="h-[14px] w-[14px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop recording</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    if (value.trim()) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSend}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  "bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90"
                )}
              >
                <Send className="h-[14px] w-[14px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleVoiceToggle}
              className={cn(
                "p-2 rounded-full transition-colors",
                "bg-dashboard-bg dark:bg-dashboard-bg",
                "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
                "hover:bg-dashboard-card dark:hover:bg-dashboard-card",
                "hover:text-dashboard-text dark:hover:text-dashboard-text"
              )}
            >
              <Mic className="h-[14px] w-[14px]" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Talk to Shattara AI</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
          <Popover open={academicLevelOpen} onOpenChange={setAcademicLevelOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button
                      className={cn(
                        "p-1.5 rounded-full transition-all duration-300",
                        "bg-dashboard-bg dark:bg-dashboard-bg",
                        "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
                        "hover:bg-dashboard-card dark:hover:bg-dashboard-card",
                        "hover:text-dashboard-text dark:hover:text-dashboard-text"
                      )}
                    >
                      {academicLevelOpen ? (
                        <X className="h-[14px] w-[14px] transform rotate-0 transition-transform duration-300" />
                      ) : (
                        <Plus className="h-[14px] w-[14px] transform rotate-0 transition-transform duration-300" />
                      )}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Academic Level</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="p-3">
                <h4 className="font-medium text-sm mb-2 text-dashboard-text dark:text-dashboard-text">Academic Level</h4>
                <div className="space-y-1">
                  {academicLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedAcademicLevel(level);
                        setAcademicLevelOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedAcademicLevel === level
                          ? "bg-[#00A3FF]/10 text-[#00A3FF]"
                          : "text-dashboard-text-secondary dark:text-dashboard-text-secondary hover:bg-dashboard-card dark:hover:bg-dashboard-card hover:text-dashboard-text dark:hover:text-dashboard-text"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Type '@' for commands</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Search the web</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
