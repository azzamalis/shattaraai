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
  onSeekToTimestamp?: (timestamp: number) => void;
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
  isLoadingData = false,
  onSeekToTimestamp
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
        return 'Processing YouTube video...';
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
    <div className="h-full w-full flex-grow overflow-y-auto overscroll-y-none rounded-lg bg-background">
      <div>
        {chapters.map((chapter, index) => (
          <div 
            key={index}
            className="group cursor-pointer rounded-2xl border border-transparent p-3 pb-4 hover:bg-primary/5 transition-colors"
            onClick={() => {
              onChapterClick?.(chapter.startTime);
              onSeekToTimestamp?.(chapter.startTime);
            }}
          >
            {/* Page/Timestamp Badge */}
            <div className="mb-2 flex items-start">
              <span className="inline-flex items-center border px-2.5 py-0.5 text-xs transition-colors border-transparent cursor-pointer rounded-md bg-neutral-100 font-medium text-primary/80 hover:bg-foreground/10 hover:text-foreground dark:bg-neutral-800">
                {contentType === 'pdf' ? (
                  `Page ${Math.floor(chapter.startTime) || index + 1}`
                ) : (
                  <>
                    {formatTime(chapter.startTime)}
                    {chapter.endTime && chapter.endTime > chapter.startTime && (
                      <span> - {formatTime(chapter.endTime)}</span>
                    )}
                  </>
                )}
              </span>
            </div>
            
            {/* Title & Summary */}
            <div className="w-full">
              <h3 className="mb-2 line-clamp-1 text-lg text-current">
                <div>{chapter.title}</div>
              </h3>
              <div className="mt-2 text-sm leading-relaxed">
                <div className="markdown-body">
                  {chapter.summary}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealtimeChaptersDisplay;
