import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Pause, Square } from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { RecordingLoadingSpinner } from '@/components/ui/recording-loading-spinner';

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused?: boolean;
  isProcessing?: boolean;
  toggleRecording: () => void;
  onPause?: () => void;
  onStop?: () => void;
  recordingTime: string;
}
export function RecordingControls({
  isRecording,
  isPaused = false,
  isProcessing = false,
  toggleRecording,
  onPause,
  onStop,
  recordingTime
}: RecordingControlsProps) {
  // Show loading spinner when processing after recording stops
  if (isProcessing) {
    return <RecordingLoadingSpinner />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center w-full bg-card rounded-xl min-h-[48px] gap-2 py-[10px] px-[12px]">
        {!isRecording ? (
          // Start Recording Button
          <Button 
            onClick={toggleRecording} 
            className="h-10 px-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 border-border transition-all duration-300 text-sm font-medium shrink-0"
            style={{ minWidth: 'auto', boxShadow: 'none' }}
          >
            <Mic className="h-4 w-4" />
            <span className="whitespace-nowrap">Start Recording</span>
          </Button>
        ) : (
          // Pause and Stop Icon Buttons
          <div className="flex gap-2 shrink-0">
            <Button 
              onClick={onPause} 
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full border-border hover:bg-muted"
              style={{ boxShadow: 'none' }}
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button 
              onClick={onStop} 
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full border-border hover:bg-muted"
              style={{ boxShadow: 'none' }}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex-[2] flex items-center justify-center h-10 bg-transparent px-4 min-w-0">
          <AudioWaveform isActive={isRecording && !isPaused} />
        </div>
        
        <div className="text-card-foreground text-base font-medium shrink-0 min-w-[60px] text-right">
          {recordingTime}
        </div>
      </div>
    </div>
  );
}