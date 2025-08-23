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
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
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

  // Show loading state when fetching data
  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-center mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dashboard-accent/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-dashboard-accent animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-dashboard-text mb-2">Loading Chapters</h3>
          <p className="text-dashboard-text-secondary text-sm">
            Retrieving saved chapter data...
          </p>
        </div>
      </div>
    );
  }

  // Show shimmer text when processing final content (after recording stops)
  if (isProcessingFinal) {
    return (
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center h-full py-16">
          <TextShimmer className="text-lg font-semibold" duration={1.5}>
            Generating content...
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
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
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <div 
              key={index}
              className="group p-3 bg-card/30 rounded-lg border border-border/50 hover:bg-card/60 hover:border-border transition-all cursor-pointer"
              onClick={() => onChapterClick?.(chapter.startTime)}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                  {chapter.title}
                </h5>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(chapter.startTime)}</span>
                  {chapter.endTime && chapter.endTime > chapter.startTime && (
                    <>
                      <span>-</span>
                      <span>{formatTime(chapter.endTime)}</span>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {chapter.summary}
              </p>
              
              {/* Duration indicator */}
              {chapter.endTime && chapter.endTime > chapter.startTime && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((chapter.endTime - chapter.startTime) / 60)}m duration
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="flex justify-between text-xs text-muted-foreground p-2 bg-muted/20 rounded">
        <span>Total chapters: {chapters.length}</span>
        {chapters.length > 0 && (
          <span>
            Duration: {formatTime(Math.max(...chapters.map(c => c.endTime || c.startTime)))}
          </span>
        )}
      </div>
    </div>
  );
};

export default RealtimeChaptersDisplay;
