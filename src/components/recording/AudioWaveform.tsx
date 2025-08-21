
import React, { useEffect, useState, useRef } from 'react';

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize audio analysis when recording starts
  useEffect(() => {
    const initializeAudioAnalysis = async () => {
      if (isActive) {
        try {
          // Get microphone access
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 24000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          
          streamRef.current = stream;
          
          // Create audio context and analyser
          audioContextRef.current = new AudioContext({ sampleRate: 24000 });
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 128; // Small for responsive visualization
          analyserRef.current.smoothingTimeConstant = 0.8;
          
          // Connect stream to analyser
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          
          // Start visualization
          const visualize = () => {
            if (!analyserRef.current || !isActive) return;
            
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Convert frequency data to bar heights (60 bars)
            const barCount = 60;
            const barWidth = Math.floor(dataArray.length / barCount);
            const heights = [];
            
            for (let i = 0; i < barCount; i++) {
              const start = i * barWidth;
              const end = start + barWidth;
              let sum = 0;
              for (let j = start; j < end; j++) {
                sum += dataArray[j];
              }
              const average = sum / barWidth;
              // Scale to 4-28px range with some baseline activity
              const height = Math.max(4, (average / 255) * 24 + 4);
              heights.push(height);
            }
            
            setBarHeights(heights);
            animationFrameRef.current = requestAnimationFrame(visualize);
          };
          
          visualize();
        } catch (error) {
          console.error('Failed to initialize audio analysis:', error);
          // Fallback to dummy animation if mic access fails
          fallbackAnimation();
        }
      } else {
        // Cleanup when not recording
        cleanup();
        // Show static bars when not recording
        setBarHeights(Array.from({ length: 60 }, () => 6));
      }
    };

    const fallbackAnimation = () => {
      const generateHeights = () => {
        return Array.from({ length: 60 }, () => Math.random() * 20 + 8);
      };
      
      setBarHeights(generateHeights());
      const interval = setInterval(() => {
        setBarHeights(generateHeights());
      }, 200);
      
      return () => clearInterval(interval);
    };

    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      analyserRef.current = null;
    };

    initializeAudioAnalysis();
    
    return cleanup;
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
