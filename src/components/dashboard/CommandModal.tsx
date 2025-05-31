import React from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Mic,
  Upload,
  Box,
  FileText,
  Video,
  Globe,
  Youtube
} from 'lucide-react';

interface CommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandModal({ open, onOpenChange }: CommandModalProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick start">
          <CommandItem>
            <Mic size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>New Recording</span>
          </CommandItem>
          <CommandItem>
            <Upload size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Upload Content</span>
          </CommandItem>
          <CommandItem>
            <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Add a Room</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          <CommandItem>
            <FileText size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Introduction to Quantum Physics</span>
            <div className="ms-auto flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5">
                <Box size={12} className="opacity-50" />
                <span className="text-xs text-muted-foreground">Physics Room</span>
              </div>
            </div>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          <CommandItem>
            <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Go to Azzam's Room</span>
          </CommandItem>
          <CommandItem>
            <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Go to Project 'Neom'</span>
          </CommandItem>
          <CommandItem>
            <Box size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Go to Untitled Room</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
