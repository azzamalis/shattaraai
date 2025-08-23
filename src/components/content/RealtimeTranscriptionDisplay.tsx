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
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
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

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' });
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
    <div className="space-y-4">
      {/* Status Header */}
      <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
          {isProcessingAudio && (
            <Badge variant="secondary" className="text-xs">
              Processing...
            </Badge>
          )}
        </div>
        
        {averageConfidence > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span>Confidence:</span>
            <span className={`font-medium ${getConfidenceColor(averageConfidence)}`}>
              {(averageConfidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {transcriptionProgress > 0 && transcriptionStatus === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Transcription Progress</span>
            <span>{transcriptionProgress.toFixed(0)}%</span>
          </div>
          <Progress value={transcriptionProgress} className="h-2" />
        </div>
      )}

      {/* Real-time Transcription Display */}
      <ScrollArea className="h-64 w-full border rounded-lg p-4" ref={scrollAreaRef}>
        <div className="space-y-3">
          {/* Show chunks for real-time display */}
          {transcriptionChunks.length > 0 ? (
            transcriptionChunks.map((chunk, index) => (
              <div 
                key={`${chunk.chunkIndex}-${chunk.timestamp}`}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index === transcriptionChunks.length - 1 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/30'
                }`}
                ref={index === transcriptionChunks.length - 1 ? lastChunkRef : undefined}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Chunk {chunk.chunkIndex + 1} • {formatTimestamp(chunk.timestamp)}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getConfidenceColor(chunk.confidence)}`}
                  >
                    {(chunk.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {chunk.text || 'Processing...'}
                </p>
              </div>
            ))
          ) : (
            /* Show full transcript if no chunks available */
            fullTranscript && (
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {fullTranscript}
                </p>
              </div>
            )
          )}

          {/* Live shimmer indicator for recording */}
          {isRecording && transcriptionStatus === 'processing' && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <TextShimmer className="text-xs">
                Generating content...
              </TextShimmer>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Stats */}
      {transcriptionChunks.length > 0 && (
        <div className="flex justify-between text-xs text-muted-foreground p-2 bg-muted/20 rounded">
          <span>Chunks processed: {transcriptionChunks.length}</span>
          <span>Total words: {fullTranscript.split(' ').filter(word => word.length > 0).length}</span>
        </div>
      )}
    </div>
  );
};

export default RealtimeTranscriptionDisplay;