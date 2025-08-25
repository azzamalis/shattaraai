import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Clock, Loader2, RefreshCw } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

interface ChapterData {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

interface RealtimeChaptersDisplayProps {
  chapters: ChapterData[];
  transcriptionStatus: 'ready' | 'pending' | 'processing' | 'completed' | 'failed';
  isRecording?: boolean;
  isProcessingFinal?: boolean;
  onRequestChapters?: () => void;
  onChapterClick?: (startTime: number) => void;
  isLoadingData?: boolean;
}

export const RealtimeChaptersDisplay = ({
  chapters,
  transcriptionStatus,
  isRecording = false,
  isProcessingFinal = false,
  onRequestChapters,
  onChapterClick,
  isLoadingData = false
}: RealtimeChaptersDisplayProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canGenerateChapters = transcriptionStatus === 'completed' || 
    (transcriptionStatus === 'processing' && !isRecording);

  // Show shimmer text when recording or processing final content
  if (isRecording || isProcessingFinal) {
    return (
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center h-full py-16">
          <TextShimmer className="text-lg font-semibold" duration={1.5}>
            {isRecording ? 'Processing audio for chapter generation...' : 'Generating content...'}
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
            {transcriptionStatus === 'pending' 
              ? 'Start recording to generate chapters'
              : transcriptionStatus === 'processing'
              ? 'Processing audio for chapter generation...'
              : 'No chapters available'
            }
          </p>
          
          {canGenerateChapters && onRequestChapters && (
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <h4 className="text-sm font-medium text-foreground">
          Chapters ({chapters.length})
        </h4>
        
        <div className="flex items-center gap-2">
          {transcriptionStatus === 'processing' && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
          
          {canGenerateChapters && onRequestChapters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onRequestChapters}
              className="text-xs h-auto p-1"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <ScrollArea className="h-64">
        <div className="space-y-6 px-4">
          {chapters.map((chapter, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
              onClick={() => onChapterClick?.(chapter.startTime)}
            >
              {/* Timestamp */}
              <div className="text-xs text-muted-foreground mb-1">
                {formatTime(chapter.startTime)}
                {chapter.endTime && chapter.endTime > chapter.startTime && (
                  <span> - {formatTime(chapter.endTime)}</span>
                )}
              </div>
              
              {/* Title */}
              <h5 className="text-sm font-semibold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                {chapter.title}
              </h5>
              
              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {chapter.summary}
              </p>
              
              {/* Separator - only show if not the last item */}
              {index < chapters.length - 1 && (
                <div className="mt-6 border-b border-border/30"></div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RealtimeChaptersDisplay;
