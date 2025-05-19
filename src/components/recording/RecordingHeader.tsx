import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Share2, Download, User, Search } from 'lucide-react';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
interface RecordingHeaderProps {
  currentTime: string;
  isRecording: boolean;
  onOpenCommandMenu?: () => void;
}
export function RecordingHeader({
  currentTime,
  isRecording,
  onOpenCommandMenu = () => {}
}: RecordingHeaderProps) {
  // Set up keyboard shortcut for command menu
  useKeyboardShortcut('k', onOpenCommandMenu, {
    metaKey: true
  });
  useKeyboardShortcut('k', onOpenCommandMenu, {
    ctrlKey: true
  });
  return <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center">
        <h1 className="text-white text-lg font-medium">
          Recording at {currentTime}
          {isRecording && <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
        </h1>
        <Button variant="ghost" size="icon" className="ml-2 text-white/70 hover:text-white hover:bg-white/10">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        
        
        <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        
        
        
      </div>
    </div>;
}