import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface ModernAudioPlayerProps {
  metadata: {
    audioUrl: string;
    duration?: number;
    title?: string;
    transcript?: string;
  };
  onTimeUpdate?: (currentTime: number) => void;
}

export function ModernAudioPlayer({ metadata, onTimeUpdate }: ModernAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(metadata.duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-card rounded-lg p-4 border border-border">
      <audio
        ref={audioRef}
        src={metadata.audioUrl}
        preload="metadata"
        className="hidden"
      />
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(-10)}
          className="h-10 w-10 rounded-full hover:bg-muted transition-colors"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={togglePlayback}
          size="icon"
          className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => skip(10)}
          className="h-10 w-10 rounded-full hover:bg-muted transition-colors"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Waveform/Progress Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="w-full"
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-center">
          <span className="text-sm font-medium text-muted-foreground">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
}