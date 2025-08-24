import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaveformAudioPlayerProps {
  metadata: {
    audioUrl: string;
    duration?: number;
    title?: string;
    transcript?: string;
  };
  onTimeUpdate?: (currentTime: number) => void;
}

export function WaveformAudioPlayer({ metadata, onTimeUpdate }: WaveformAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(metadata.duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate responsive waveform data based on container width
  useEffect(() => {
    const updateWaveform = () => {
      const width = containerRef.current?.offsetWidth || 400;
      setContainerWidth(width);
      
      // Calculate number of bars based on container width (responsive)
      const minBars = 60;  // Minimum bars for mobile
      const maxBars = 150; // Maximum bars for desktop
      const barsPerPixel = 0.25; // Adjust density
      const calculatedBars = Math.min(maxBars, Math.max(minBars, Math.floor(width * barsPerPixel)));
      
      const data = [];
      for (let i = 0; i < calculatedBars; i++) {
        // Create a more realistic waveform pattern
        const baseHeight = Math.random() * 0.6 + 0.1;
        const variation = Math.sin(i * 0.1) * 0.3;
        data.push(Math.max(0.05, Math.min(1, baseHeight + variation)));
      }
      setWaveformData(data);
    };
    
    updateWaveform();
    
    const handleResize = () => updateWaveform();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progress = clickX / rect.width;
    const newTime = progress * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div 
      ref={containerRef}
      className="w-full bg-background rounded-lg border border-border/50 p-3 sm:p-4"
    >
      <audio
        ref={audioRef}
        src={metadata.audioUrl}
        preload="metadata"
        className="hidden"
      />
      
      {/* Mobile Layout (Stacked) */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Top row: Play button and Speed control */}
        <div className="flex items-center justify-between">
          <Button
            onClick={togglePlayback}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              onClick={changePlaybackSpeed}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {playbackRate}x
            </Button>
            <div className="text-xs font-medium text-muted-foreground min-w-[35px] text-right">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Waveform - Full width */}
        <div
          className="flex items-center justify-center gap-0.5 h-6 cursor-pointer group px-1"
          onClick={handleWaveformClick}
        >
          {waveformData.map((height, index) => {
            const barProgress = index / waveformData.length;
            const isPlayed = barProgress <= progress;
            const barHeight = height * 100;
            
            return (
              <div
                key={index}
                className={cn(
                  "rounded-full transition-all duration-150 ease-out",
                  isPlayed
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                )}
                style={{
                  width: `${Math.max(1, Math.min(3, containerWidth / waveformData.length - 0.5))}px`,
                  height: `${Math.max(6, barHeight * 0.2)}px`,
                  minHeight: '2px'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop Layout (Horizontal) */}
      <div className="hidden sm:flex items-center gap-3 md:gap-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayback}
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-muted/50 transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </Button>

        {/* Waveform Visualization */}
        <div
          className="flex-1 flex items-center justify-center gap-0.5 h-8 cursor-pointer group min-w-0"
          onClick={handleWaveformClick}
        >
          {waveformData.map((height, index) => {
            const barProgress = index / waveformData.length;
            const isPlayed = barProgress <= progress;
            const barHeight = height * 100;
            
            return (
              <div
                key={index}
                className={cn(
                  "rounded-full transition-all duration-150 ease-out",
                  isPlayed
                    ? "bg-primary"
                    : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50"
                )}
                style={{
                  width: `${Math.max(1, Math.min(4, (containerWidth - 120) / waveformData.length - 0.5))}px`,
                  height: `${Math.max(8, barHeight * 0.24)}px`,
                  minHeight: '2px'
                }}
              />
            );
          })}
        </div>

        {/* Speed Control */}
        <Button
          onClick={changePlaybackSpeed}
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 hidden md:flex"
        >
          {playbackRate}x
        </Button>

        {/* Timestamp */}
        <div className="text-xs font-medium text-muted-foreground flex-shrink-0 min-w-[35px] text-right">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}