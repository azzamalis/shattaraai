import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { ContentType, WordSegment, TranscriptionChunk } from '@/lib/types';

interface WordLevelTranscriptionDisplayProps {
  transcriptionChunks: TranscriptionChunk[];
  fullTranscript: string;
  transcriptionProgress: number;
  transcriptionStatus: 'ready' | 'pending' | 'processing' | 'completed' | 'failed';
  averageConfidence: number;
  isProcessingAudio: boolean;
  isProcessingFinal?: boolean;
  isRecording?: boolean;
  isLoadingData?: boolean;
  contentType?: ContentType;
  onSeekToTimestamp?: (timestamp: number) => void;
  currentPlaybackTime?: number;
}

export const WordLevelTranscriptionDisplay = ({
  transcriptionChunks,
  fullTranscript,
  transcriptionProgress,
  transcriptionStatus,
  averageConfidence,
  isProcessingAudio,
  isProcessingFinal = false,
  isRecording = false,
  isLoadingData = false,
  contentType = 'audio_file',
  onSeekToTimestamp,
  currentPlaybackTime = 0
}: WordLevelTranscriptionDisplayProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to active word during playback
  useEffect(() => {
    if (activeWordRef.current && currentPlaybackTime > 0) {
      activeWordRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [currentPlaybackTime]);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWordClick = (timestamp: number) => {
    if (onSeekToTimestamp) {
      onSeekToTimestamp(timestamp);
    }
  };

  const isWordActive = (word: WordSegment) => {
    return currentPlaybackTime >= word.start && currentPlaybackTime <= word.end;
  };

  const getProcessingMessage = () => {
    switch (contentType) {
      case 'video':
        return 'Processing video...';
      case 'audio_file':
      case 'live_recording':
        return 'Processing audio...';
      default:
        return 'Processing content...';
    }
  };

  // Show shimmer text when recording or processing final content
  if (isRecording || isProcessingFinal) {
    return (
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center h-full py-16">
          <TextShimmer className="text-base font-semibold" duration={1.5}>
            {getProcessingMessage()}
          </TextShimmer>
        </div>
      </ScrollArea>
    );
  }

  // Initial state - waiting to start recording
  if (!isRecording && (!transcriptionChunks || transcriptionChunks.length === 0) && !fullTranscript) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dashboard-accent/10 flex items-center justify-center">
            <Mic className="h-8 w-8 text-dashboard-accent" />
          </div>
          <h3 className="text-lg font-medium text-dashboard-text mb-2">Ready to Record</h3>
          <p className="text-dashboard-text-secondary text-sm">
            Click "Start Recording" to begin live transcription
          </p>
        </div>
      </div>
    );
  }

  // Get all words from all chunks
  const allWords: (WordSegment & { chunkIndex: number })[] = [];
  transcriptionChunks.forEach((chunk, chunkIndex) => {
    if (chunk.words) {
      chunk.words.forEach(word => {
        allWords.push({ ...word, chunkIndex });
      });
    } else if (chunk.segments) {
      // Extract words from segments if direct words not available
      chunk.segments.forEach(segment => {
        if (segment.words) {
          segment.words.forEach(word => {
            allWords.push({ ...word, chunkIndex });
          });
        }
      });
    }
  });

  // Group words by time segments (every ~10 seconds)
  const timeSegments: { timestamp: number; words: (WordSegment & { chunkIndex: number })[] }[] = [];
  let currentSegment: { timestamp: number; words: (WordSegment & { chunkIndex: number })[] } | null = null;

  allWords.forEach(word => {
    const segmentTime = Math.floor(word.start / 10) * 10; // Group by 10-second intervals
    
    if (!currentSegment || currentSegment.timestamp !== segmentTime) {
      currentSegment = { timestamp: segmentTime, words: [] };
      timeSegments.push(currentSegment);
    }
    
    currentSegment.words.push(word);
  });

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="space-y-6 p-4">
        {timeSegments.length > 0 ? (
          timeSegments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="group">
              {/* Timestamp */}
              <button
                onClick={() => handleWordClick(segment.timestamp)}
                className="inline-flex items-center px-3 py-1.5 bg-muted/50 hover:bg-muted/70 rounded-md text-xs text-muted-foreground font-mono mb-3 transition-colors cursor-pointer"
              >
                {formatTimestamp(segment.timestamp)}
              </button>
              
              {/* Words */}
              <div className="text-sm text-foreground leading-relaxed">
                {segment.words.map((word, wordIndex) => {
                  const isActive = isWordActive(word);
                  return (
                    <span
                      key={`${segment.timestamp}-${wordIndex}`}
                      ref={isActive ? activeWordRef : undefined}
                      onClick={() => handleWordClick(word.start)}
                      className={`
                        inline-block mr-1 mb-1 px-1 py-0.5 rounded cursor-pointer transition-all duration-200
                        hover:bg-primary/10 hover:text-primary
                        ${isActive 
                          ? 'bg-primary/20 text-primary font-medium' 
                          : 'hover:bg-muted/50'
                        }
                        ${word.confidence && word.confidence < 0.6 
                          ? 'text-muted-foreground' 
                          : ''
                        }
                      `}
                      title={`${formatTimestamp(word.start)} - Confidence: ${(word.confidence || 0 * 100).toFixed(0)}%`}
                    >
                      {word.word}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          /* Fallback to sentence-based display if no word-level data */
          <div className="space-y-6">
            {transcriptionChunks.length > 0 ? (
              transcriptionChunks.map((chunk, index) => (
                <div key={`${chunk.chunkIndex}-${chunk.timestamp}`} className="group">
                  <button
                    onClick={() => handleWordClick(chunk.timestamp / 1000)}
                    className="inline-flex items-center px-3 py-1.5 bg-muted/50 hover:bg-muted/70 rounded-md text-xs text-muted-foreground font-mono mb-3 transition-colors cursor-pointer"
                  >
                    {formatTimestamp(chunk.timestamp / 1000)}
                  </button>
                  <p className="text-sm text-foreground leading-relaxed">
                    {chunk.text || 'Processing...'}
                  </p>
                </div>
              ))
            ) : (
              fullTranscript && (
                <div className="space-y-6">
                  <button
                    onClick={() => handleWordClick(0)}
                    className="inline-flex items-center px-3 py-1.5 bg-muted/50 hover:bg-muted/70 rounded-md text-xs text-muted-foreground font-mono mb-3 transition-colors cursor-pointer"
                  >
                    00:00
                  </button>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {fullTranscript}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* Live indicator for recording */}
        {isRecording && transcriptionStatus === 'processing' && (
          <div className="group">
            <div className="inline-flex items-center px-3 py-1.5 bg-muted/50 rounded-md text-xs text-muted-foreground font-mono mb-3">
              Live
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <TextShimmer className="text-base">
                {getProcessingMessage()}
              </TextShimmer>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default WordLevelTranscriptionDisplay;