import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Mic, CheckCircle, AlertCircle } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

interface TranscriptionChunk {
  chunkIndex: number;
  timestamp: number;
  text: string;
  confidence: number;
  segments: any[];
  duration: number;
}

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
  isLoadingData = false
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

  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show shimmer text when recording or processing final content
  if (isRecording || isProcessingFinal) {
    return (
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center h-full py-16">
          <TextShimmer className="text-lg font-semibold" duration={1.5}>
            {isRecording ? 'Processing audio...' : 'Generating final transcript...'}
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

  return (
    <div className="space-y-8">
      {/* Real-time Transcription Display */}
      <div className="space-y-8">
        {/* Show chunks for real-time display */}
        {transcriptionChunks.length > 0 ? (
          transcriptionChunks.map((chunk, index) => (
            <div 
              key={`${chunk.chunkIndex}-${chunk.timestamp}`}
              className="group"
              ref={index === transcriptionChunks.length - 1 ? lastChunkRef : undefined}
            >
              {/* Timestamp */}
              <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
                {formatTime(chunk.timestamp)}
              </div>
              
              {/* Transcript Text */}
              <p className="text-sm text-foreground leading-relaxed">
                {chunk.text || 'Processing...'}
              </p>
            </div>
          ))
        ) : (
          /* Show full transcript if no chunks available */
          fullTranscript && (
            <div className="space-y-6">
              <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
                00:00
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {fullTranscript}
              </p>
            </div>
          )
        )}

        {/* Live indicator for recording */}
        {isRecording && transcriptionStatus === 'processing' && (
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
                Transcribing...
              </TextShimmer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeTranscriptionDisplay;