
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
  return (
    <div className="flex flex-col items-center w-full py-4">
      <Button
        onClick={toggleRecording}
        className={`rounded-full w-14 h-14 flex items-center justify-center transition-all duration-300 ${
          isRecording 
            ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
            : 'bg-[#2323FF] hover:bg-[#2323FF]/90'
        }`}
      >
        {isRecording ? (
          <MicOff className="h-6 w-6 animate-pulse" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>
      
      <div className="mt-2 text-white font-medium">
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </div>
      
      <div className="w-full mt-4">
        <AudioWaveform isActive={isRecording} />
      </div>
      
      <div className="mt-3 text-white text-2xl font-mono">
        {recordingTime}
      </div>
    </div>
  );
}
