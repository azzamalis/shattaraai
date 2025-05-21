
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
      <div className="flex items-center w-full bg-[#18181b] rounded-xl px-2 py-2">
        <Button
          onClick={toggleRecording}
          className={`h-8 px-4 flex items-center justify-center gap-2 border border-white/10 bg-white text-black rounded-lg shadow-none transition-all duration-300 text-sm font-medium mr-2 ${
            isRecording ? 'bg-red-600 text-white hover:bg-red-700' : 'hover:bg-zinc-200'
          }`}
          style={{ minWidth: 'auto', boxShadow: 'none' }}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span>{isRecording ? 'Stop' : 'Start'} Recording</span>
        </Button>
        <div className="flex-1 flex items-center h-8 bg-transparent">
          <AudioWaveform isActive={isRecording} />
        </div>
        <div className="text-white text-sm font-mono min-w-[40px] text-right pl-2">
          {recordingTime}
        </div>
      </div>
    </div>
  );
}
