
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
    <div className="w-full">
      <div className="flex items-center w-full bg-dashboard-card hover:bg-dashboard-card-hover border border-dashboard-separator rounded-xl px-3 py-3 transition-colors duration-200">
        <Button
          onClick={toggleRecording}
          className={`h-9 px-4 flex items-center justify-center gap-2 rounded-lg text-sm font-medium mr-3 transition-all duration-300 ${
            isRecording 
              ? 'bg-red-600 text-white hover:bg-red-700 border-red-600' 
              : 'bg-[#00A3FF] text-white hover:bg-[#00A3FF]/90 border-[#00A3FF]'
          }`}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span>{isRecording ? 'Stop' : 'Start'} Recording</span>
        </Button>
        <div className="flex-1 flex items-center h-8 bg-transparent">
          <AudioWaveform isActive={isRecording} />
        </div>
        <div className="text-dashboard-text text-sm font-mono min-w-[45px] text-right pl-3">
          {recordingTime}
        </div>
      </div>
    </div>
  );
}
