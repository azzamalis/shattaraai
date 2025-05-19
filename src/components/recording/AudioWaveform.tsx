
import React from 'react';

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  return (
    <div className={`waveform-container ${isActive ? 'active' : ''}`}>
      {Array.from({ length: 50 }).map((_, index) => (
        <div 
          key={index}
          className="waveform-bar"
          style={{
            height: `${Math.random() * 20 + 5}px`,
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
}
