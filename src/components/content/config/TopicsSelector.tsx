import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface TopicsSelectorProps {
  topics: string[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  placeholder?: string;
}

export function TopicsSelector({ topics, selectedTopics, onTopicsChange, placeholder = "Select topics" }: TopicsSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAllSelected = selectedTopics.length === topics.length;
  const displayTopics = showAll ? selectedTopics : selectedTopics.slice(0, 3);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearAll = () => {
    onTopicsChange([]);
  };

  const handleRemoveTopic = (topic: string) => {
    onTopicsChange(selectedTopics.filter(t => t !== topic));
  };

  const handleSelectTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onTopicsChange(selectedTopics.filter(t => t !== topic));
    } else {
      onTopicsChange([...selectedTopics, topic]);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onTopicsChange([]);
    } else {
      onTopicsChange([...topics]);
    }
  };

  const handleContainerClick = () => {
    setIsOpen(true);
  };

  return (
    <Command className="h-auto overflow-visible bg-transparent [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]>svg]:hidden" ref={containerRef}>
      <div 
        className="min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 px-3 py-2 cursor-text max-h-56 overflow-y-auto w-full"
        onClick={handleContainerClick}
      >
        <div className="relative flex flex-wrap gap-1 pr-8">
          <div className="flex flex-wrap gap-1 items-center">
            {isAllSelected && !showAll ? (
              <Badge className="bg-foreground text-background hover:bg-foreground/90 border-transparent">
                Selected All Topics
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={handleClearAll}
                  title="Clear all selected items"
                >
                  <X className="h-3 w-3 text-background/60 hover:text-background" />
                </button>
              </Badge>
            ) : (
              displayTopics.map((topic) => (
                <Badge key={topic} className="bg-foreground text-background hover:bg-foreground/90 border-transparent">
                  {topic}
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => handleRemoveTopic(topic)}
                  >
                    <X className="h-3 w-3 text-background/60 hover:text-background" />
                  </button>
                </Badge>
              ))
            )}
            
            {selectedTopics.length > 3 && !showAll && (
              <button
                type="button"
                className="ml-1 outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 group whitespace-nowrap"
                onClick={() => setShowAll(true)}
                title="Show all selected items"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground group-hover:text-foreground">Show all items</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                </div>
              </button>
            )}

            <CommandInput
              placeholder={placeholder}
              className="flex-1 min-w-[200px] bg-transparent outline-none placeholder:text-muted-foreground ml-1"
              value={inputValue}
              onValueChange={setInputValue}
            />
          </div>

          <button
            type="button"
            className={cn("absolute right-0 h-6 w-6 p-0 bg-background", selectedTopics.length === 0 && "hidden")}
            onClick={handleClearAll}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {(isOpen || inputValue) && (
        <div className="relative mt-2">
          <div className="absolute w-full z-[60] max-h-[300px] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md">
            <CommandEmpty>No topics found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="select-all"
                onSelect={handleSelectAll}
                className="cursor-pointer font-medium"
              >
                <div className={`mr-2 h-4 w-4 border rounded-sm ${isAllSelected ? 'bg-primary border-primary' : 'border-input'}`}>
                  {isAllSelected && (
                    <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                Select All
              </CommandItem>
              {topics.map((topic) => (
                <CommandItem
                  key={topic}
                  value={topic}
                  onSelect={() => handleSelectTopic(topic)}
                  className="cursor-pointer"
                >
                  <div className={`mr-2 h-4 w-4 border rounded-sm ${selectedTopics.includes(topic) ? 'bg-primary border-primary' : 'border-input'}`}>
                    {selectedTopics.includes(topic) && (
                      <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {topic}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        </div>
      )}
    </Command>
  );
}
