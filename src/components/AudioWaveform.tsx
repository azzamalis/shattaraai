
import React, { useEffect, useState } from "react";

interface AudioWaveformProps {
  isRecording: boolean;
}

const AudioWaveform = ({ isRecording }: AudioWaveformProps) => {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate initial random bars
    const initialBars = Array.from({ length: 40 }, () => Math.random() * 0.5 + 0.1);
    setBars(initialBars);

    // If recording, animate the bars
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  return (
    <div className="flex items-center justify-center h-full w-full gap-0.5">
      {bars.map((height, index) => (
        <div
          key={index}
          className="waveform-bar bg-white/40 rounded-full w-[3px]"
          style={{
            height: isRecording ? `${height * 100}%` : "10%",
            transform: isRecording ? `scaleY(${height * 1.5})` : "scaleY(0.2)",
            transition: "transform 0.1s ease-in-out",
            opacity: isRecording ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
