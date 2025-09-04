import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { ContentType, TranscriptionChunk, TranscriptionSegment } from '@/lib/types';

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
  contentType = 'audio_file'
}: RealtimeTranscriptionDisplayProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastChunkRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest transcription
  useEffect(() => {
    if (lastChunkRef.current) {
      lastChunkRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [transcriptionChunks.length, fullTranscript]);

  const getStatusIcon = () => {
    switch (transcriptionStatus) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Mic className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (isRecording && transcriptionStatus === 'processing') {
      return 'Transcribing live...';
    }
    switch (transcriptionStatus) {
      case 'processing':
        return 'Processing audio...';
      case 'completed':
        return 'Transcription complete';
      case 'failed':
        return 'Transcription failed';
      default:
        return 'Ready to transcribe';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (timestamp: number) => {
    // Convert timestamp to MM:SS format (timestamp should be in seconds)
    const totalSeconds = Math.floor(timestamp);
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Process segments from transcription chunks to create timestamped text blocks
  const getTimestampedSegments = () => {
    const segments: Array<{ timestamp: number; text: string }> = [];
    
    // Process chunks and their segments
    transcriptionChunks.forEach(chunk => {
      if (chunk.segments && chunk.segments.length > 0) {
        chunk.segments.forEach(segment => {
          segments.push({
            timestamp: segment.start,
            text: segment.text.trim()
          });
        });
      } else if (chunk.text) {
        // Fallback to chunk-level if no segments available
        segments.push({
          timestamp: chunk.timestamp / 1000, // Convert ms to seconds if needed
          text: chunk.text.trim()
        });
      }
    });

    // Sort by timestamp and merge segments that are very close together
    segments.sort((a, b) => a.timestamp - b.timestamp);
    
    const mergedSegments: Array<{ timestamp: number; text: string }> = [];
    let currentSegment: { timestamp: number; text: string } | null = null;
    
    segments.forEach(segment => {
      if (!currentSegment) {
        currentSegment = { ...segment };
      } else if (segment.timestamp - currentSegment.timestamp < 30) {
        // Merge segments that are within 30 seconds of each other
        currentSegment.text += ' ' + segment.text;
      } else {
        // Start a new segment
        mergedSegments.push(currentSegment);
        currentSegment = { ...segment };
      }
    });
    
    if (currentSegment) {
      mergedSegments.push(currentSegment);
    }
    
    return mergedSegments;
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

  // Initial state - waiting to start recording (only if no existing data)
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

  // Get timestamped segments for display
  const timestampedSegments = getTimestampedSegments();

  return (
    <div className="space-y-6">
      {/* Timestamped Transcription Display */}
      {timestampedSegments.length > 0 ? (
        timestampedSegments.map((segment, index) => (
          <div 
            key={`${segment.timestamp}-${index}`}
            className="group"
            ref={index === timestampedSegments.length - 1 ? lastChunkRef : undefined}
          >
            {/* Timestamp */}
            <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 font-mono">
              {formatTime(segment.timestamp)}
            </div>
            
            {/* Transcript Text */}
            <p className="text-sm text-dashboard-text dark:text-dashboard-text leading-relaxed mb-6">
              {segment.text}
            </p>
          </div>
        ))
      ) : fullTranscript ? (
        /* Show full transcript if no segments available */
        <div>
          <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 font-mono">
            00:00
          </div>
          <p className="text-sm text-dashboard-text dark:text-dashboard-text leading-relaxed whitespace-pre-wrap">
            {fullTranscript}
          </p>
        </div>
      ) : null}

      {/* Live indicator for recording */}
      {isRecording && transcriptionStatus === 'processing' && (
        <div className="group">
          <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 font-mono">
            Live
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-dashboard-accent rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-dashboard-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-1.5 h-1.5 bg-dashboard-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <TextShimmer className="text-sm text-dashboard-text dark:text-dashboard-text">
              {getProcessingMessage()}
            </TextShimmer>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeTranscriptionDisplay;