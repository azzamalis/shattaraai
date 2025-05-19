
import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  // Generate initial random heights and update when active state changes
  useEffect(() => {
    const generateHeights = () => {
      return Array.from({ length: 50 }, () => Math.random() * 20 + 5);
    };

    setBarHeights(generateHeights());
    
    // When recording is active, periodically update bar heights for animation
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setBarHeights(generateHeights());
      }, 800);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  return (
    <div className={`waveform-container ${isActive ? 'active' : ''}`}>
      {barHeights.map((height, index) => (
        <div 
          key={index}
          className="waveform-bar"
          style={{
            height: `${height}px`,
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
}
