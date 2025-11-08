import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

interface TopicsSelectorProps {
  topics: string[];
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  placeholder?: string;
}

export function TopicsSelector({ topics, selectedTopics, onTopicsChange, placeholder = "Select topics" }: TopicsSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isAllSelected = selectedTopics.length === topics.length;
  const displayTopics = showAll ? selectedTopics : selectedTopics.slice(0, 1);

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

  return (
    <Command className="h-auto overflow-visible bg-transparent">
      <div className="min-h-10 rounded-lg border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 px-3 py-2 cursor-text max-h-56 overflow-y-auto w-full">
        <div className="relative flex flex-wrap gap-1 pr-8">
          {isAllSelected && !showAll ? (
            <Badge className="bg-primary text-primary-foreground hover:bg-primary/80">
              Selected All Topics
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={handleClearAll}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ) : (
            displayTopics.map((topic) => (
              <Badge key={topic} className="bg-primary text-primary-foreground hover:bg-primary/80">
                {topic}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => handleRemoveTopic(topic)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            ))
          )}
          
          {selectedTopics.length > 1 && !showAll && (
            <button
              type="button"
              className="ml-1 p-1 px-2 bg-muted rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted group"
              onClick={() => setShowAll(true)}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground group-hover:text-foreground">Show all items</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
              </div>
            </button>
          )}

          <CommandInput
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground ml-1"
            value={inputValue}
            onValueChange={setInputValue}
          />

          {selectedTopics.length > 0 && (
            <button
              type="button"
              className="absolute right-0 h-6 w-6 p-0 bg-background"
              onClick={handleClearAll}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {inputValue && (
        <div className="relative mt-2">
          <div className="absolute w-full z-[60] max-h-[300px] overflow-auto rounded-lg border bg-popover text-popover-foreground shadow-md">
            <CommandEmpty>No topics found.</CommandEmpty>
            <CommandGroup>
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
