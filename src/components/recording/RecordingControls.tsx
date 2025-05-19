
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
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
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Button
        onClick={toggleRecording}
        className={`rounded-full w-14 h-14 flex items-center justify-center ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-primary hover:bg-primary-light'
        }`}
      >
        <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />
      </Button>
      
      <div className="mt-3 text-white font-medium">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </div>
      
      <div className="w-full max-w-xl mt-6">
        <AudioWaveform isActive={isRecording} />
      </div>
      
      <div className="mt-4 text-white text-2xl font-mono">
        {recordingTime}
      </div>
    </div>
  );
}
