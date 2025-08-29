import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Clock, Loader2, RefreshCw } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { ContentType } from '@/lib/types';

interface ChapterData {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

interface RealtimeChaptersDisplayProps {
  chapters: ChapterData[];
  transcriptionStatus: 'ready' | 'pending' | 'processing' | 'completed' | 'failed';
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  contentType?: ContentType;
  isRecording?: boolean;
  isProcessingFinal?: boolean;
  onRequestChapters?: () => void;
  onChapterClick?: (startTime: number) => void;
  onRetryProcessing?: () => void;
  isLoadingData?: boolean;
}

export const RealtimeChaptersDisplay = ({
  chapters,
  transcriptionStatus,
  processingStatus = 'pending',
  contentType = 'audio_file',
  isRecording = false,
  isProcessingFinal = false,
  onRequestChapters,
  onChapterClick,
  onRetryProcessing,
  isLoadingData = false
}: RealtimeChaptersDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canGenerateChapters = transcriptionStatus === 'completed' || 
    (transcriptionStatus === 'processing' && !isRecording);

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
  if (isRecording || isProcessingFinal || processingStatus === 'processing') {
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

  if (chapters.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
          <BookOpen className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-sm text-center mb-3">
            {processingStatus === 'failed' 
              ? 'Processing failed. Click to retry.'
              : transcriptionStatus === 'pending' 
              ? 'Start recording to generate chapters'
              : transcriptionStatus === 'processing'
              ? 'Processing audio for chapter generation...'
              : 'No chapters available'
            }
          </p>
          
          {processingStatus === 'failed' && onRetryProcessing && (
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
          
          {canGenerateChapters && onRequestChapters && processingStatus !== 'failed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRequestChapters}
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate Chapters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Chapters List */}
      <div className="space-y-8">
        {chapters.map((chapter, index) => (
          <div 
            key={index}
            className="group cursor-pointer"
            onClick={() => onChapterClick?.(chapter.startTime)}
          >
            {/* Timestamp */}
            <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
              {formatTime(chapter.startTime)}
              {chapter.endTime && chapter.endTime > chapter.startTime && (
                <span> - {formatTime(chapter.endTime)}</span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
              {chapter.title}
            </h3>
            
            {/* Summary */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {chapter.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeChaptersDisplay;
