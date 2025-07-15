import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
interface RecordingControlsProps {
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
}
export function RecordingControls({
  isRecording,
  toggleRecording,
  recordingTime
}: RecordingControlsProps) {
  return <div className="w-full">
      <div className="flex items-center w-full bg-card rounded-xl px-3 py-3 min-h-[48px] gap-2">
        <Button onClick={toggleRecording} className={`h-10 px-4 flex items-center justify-center gap-2 border-border transition-all duration-300 text-sm font-medium shrink-0 ${isRecording ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`} style={{
        minWidth: 'auto',
        boxShadow: 'none'
      }}>
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span className="whitespace-nowrap">{isRecording ? 'Stop' : 'Start'} Recording</span>
        </Button>
        
        <div className="flex-1 flex items-center justify-center h-10 bg-transparent px-2 min-w-0">
          <AudioWaveform isActive={isRecording} />
        </div>
        
        <div className="text-card-foreground text-sm font-mono shrink-0 min-w-[48px] text-right">
          {recordingTime}
        </div>
      </div>
    </div>;
}