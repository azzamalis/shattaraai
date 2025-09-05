import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Mic, FileText, RefreshCw } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { TranscriptionChunk, ContentType, WordSegment } from '@/lib/types';

interface RealtimeTranscriptionDisplayProps {
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
  onRetryProcessing?: () => void;
}

export const RealtimeTranscriptionDisplay = ({
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
  currentPlaybackTime = 0,
  onRetryProcessing
}: RealtimeTranscriptionDisplayProps) => {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleWordClick = (timestamp: number) => {
    if (onSeekToTimestamp) {
      onSeekToTimestamp(timestamp);
    }
  };

  const isWordActive = (word: WordSegment) => {
    return currentPlaybackTime >= word.start && currentPlaybackTime <= word.end;
  };

  // Get processing message based on content type
  const getProcessingMessage = () => {
    switch (contentType) {
      case 'video':
        return 'Processing video...';
      case 'audio_file':
      case 'live_recording':
        return 'Processing audio...';
      case 'pdf':
        return 'Processing PDF...';
      case 'file':
        return 'Processing document...';
      case 'website':
        return 'Processing website...';
      case 'youtube':
        return 'Processing video...';
      case 'text':
      case 'chat':
        return 'Processing text...';
      default:
        return 'Processing content...';
    }
  };

  // Show shimmer text when recording or processing final content
  if (isRecording || isProcessingFinal || isProcessingAudio) {
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
  const timeSegments: { timestamp: number; words: (WordSegment & { chunkIndex: number })[]; text: string }[] = [];
  let currentSegment: { timestamp: number; words: (WordSegment & { chunkIndex: number })[]; text: string } | null = null;

  allWords.forEach(word => {
    const segmentTime = Math.floor(word.start / 10) * 10; // Group by 10-second intervals
    
    if (!currentSegment || currentSegment.timestamp !== segmentTime) {
      currentSegment = { timestamp: segmentTime, words: [], text: '' };
      timeSegments.push(currentSegment);
    }
    
    currentSegment.words.push(word);
    currentSegment.text += (currentSegment.text ? ' ' : '') + word.word;
  });

  // Fallback to chunk-based segments if no word-level data
  const chunkSegments = transcriptionChunks.map(chunk => ({
    timestamp: chunk.timestamp / 1000,
    text: chunk.text || 'Processing...',
    words: [] as (WordSegment & { chunkIndex: number })[]
  }));

  const displaySegments = timeSegments.length > 0 ? timeSegments : chunkSegments;

  // No content state
  if (displaySegments.length === 0 && !fullTranscript) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <FileText className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm text-center mb-3">
            {transcriptionStatus === 'failed' 
              ? 'Processing failed. Click to retry.'
              : transcriptionStatus === 'pending' 
              ? 'Start recording to see transcription'
              : isProcessingAudio
              ? 'Processing audio for transcription...'
              : 'No transcription available'
            }
          </p>
          
          {transcriptionStatus === 'failed' && onRetryProcessing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetryProcessing}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry Processing
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Transcription Segments */}
      <div className="space-y-8">
        {displaySegments.map((segment, index) => (
          <div 
            key={index}
            className="group cursor-pointer hover:bg-muted/20 rounded-lg p-3 transition-colors"
            onClick={() => handleWordClick(segment.timestamp)}
          >
            {/* Timestamp */}
            <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
              {formatTime(segment.timestamp)}
            </div>
            
            {/* Transcription Text with Word-level Highlighting */}
            <div className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
              {segment.words.length > 0 ? (
                // Word-level display
                segment.words.map((word, wordIndex) => {
                  const isActive = isWordActive(word);
                  return (
                    <span
                      key={`${segment.timestamp}-${wordIndex}`}
                      ref={isActive ? activeWordRef : undefined}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWordClick(word.start);
                      }}
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
                      title={`${formatTime(word.start)} - Confidence: ${((word.confidence || 0) * 100).toFixed(0)}%`}
                    >
                      {word.word}
                    </span>
                  );
                })
              ) : (
                // Fallback to text display
                <p className="leading-relaxed">
                  {segment.text}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Full transcript fallback */}
        {displaySegments.length === 0 && fullTranscript && (
          <div 
            className="group cursor-pointer hover:bg-muted/20 rounded-lg p-3 transition-colors"
            onClick={() => handleWordClick(0)}
          >
            <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
              {formatTime(0)}
            </div>
            <div className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
              <p className="whitespace-pre-wrap leading-relaxed">
                {fullTranscript}
              </p>
            </div>
          </div>
        )}

        {/* Live indicator for recording */}
        {isRecording && isProcessingAudio && (
          <div className="group">
            <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
              Live
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <TextShimmer className="text-sm">
                {getProcessingMessage()}
              </TextShimmer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeTranscriptionDisplay;