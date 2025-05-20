
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import AudioWaveform from "./AudioWaveform";

interface RecordingControlsProps {
  isRecording: boolean;
  time: number;
  toggleRecording: () => void;
}

const RecordingControls = ({ isRecording, time, toggleRecording }: RecordingControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full px-4 py-3 border-b border-border flex items-center justify-between">
      <Button
        onClick={toggleRecording}
        size="sm"
        className={`rounded-full ${
          isRecording ? "bg-destructive hover:bg-destructive/90" : ""
        }`}
      >
        <Mic className="h-4 w-4 mr-2" />
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      
      <div className="flex-1 mx-4">
        <AudioWaveform isRecording={isRecording} />
      </div>
      
      <span className="font-medium text-sm">{formatTime(time)}</span>
    </div>
  );
};

export default RecordingControls;
