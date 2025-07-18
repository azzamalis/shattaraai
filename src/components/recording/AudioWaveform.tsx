
import React, { useEffect, useState } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  
  // Generate initial random heights and update when active state changes
  useEffect(() => {
    const generateHeights = () => {
      return Array.from({ length: 60 }, () => Math.random() * 24 + 4);
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
    <div className={`w-full h-8 flex items-center justify-center gap-[1px] ${isActive ? 'active' : ''}`}>
      {barHeights.map((height, index) => (
        <div 
          key={index}
          className={`rounded-full transition-all duration-300 ${
            isActive 
              ? 'bg-primary animate-pulse' 
              : 'bg-muted-foreground/30'
          }`}
          style={{
            height: `${Math.min(height, 28)}px`,
            width: '2px',
            animationDelay: isActive ? `${index * 0.05}s` : '0s'
          }}
        />
      ))}
    </div>
  );
}
