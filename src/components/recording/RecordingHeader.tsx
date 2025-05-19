
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Share2, Download } from 'lucide-react';

interface RecordingHeaderProps {
  currentTime: string;
  isRecording: boolean;
}

export function RecordingHeader({ currentTime, isRecording }: RecordingHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center">
        <h1 className="text-white text-lg font-medium">
          Recording at {currentTime}
        </h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-2 text-white/70 hover:text-white hover:bg-white/10"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white">
          <Download className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        <Button className="bg-transparent hover:bg-white/10 border border-white/20 text-white">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button className="bg-primary text-white">
          Upgrade
        </Button>
      </div>
    </div>
  );
}
