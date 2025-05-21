
import React from "react";
import { AudioWaveform as NewAudioWaveform } from "@/components/recording/AudioWaveform";

interface AudioWaveformProps {
  isRecording: boolean;
}

const AudioWaveform = ({ isRecording }: AudioWaveformProps) => {
  // This is a compatibility wrapper for the new AudioWaveform component
  return <NewAudioWaveform isActive={isRecording} />;
};

export default AudioWaveform;
