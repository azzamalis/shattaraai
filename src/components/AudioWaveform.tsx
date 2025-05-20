
import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
}

const AudioWaveform = ({ isRecording }: AudioWaveformProps) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  // Generate initial random heights and update when active state changes
  useEffect(() => {
    const generateHeights = () => {
      return Array.from({ length: 40 }, () => Math.random() * 20 + 5);
    };

    setBarHeights(generateHeights());
    
    // When recording is active, periodically update bar heights for animation
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setBarHeights(generateHeights());
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  return (
    <div className="flex items-center justify-center h-6 gap-[2px]">
      {barHeights.map((height, index) => (
        <div 
          key={index}
          className={`waveform-bar transition-all duration-300 w-[2px] bg-muted-foreground rounded-full ${isRecording ? 'opacity-100' : 'opacity-30'}`}
          style={{
            height: isRecording ? `${height}px` : '1px',
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

export default AudioWaveform;
