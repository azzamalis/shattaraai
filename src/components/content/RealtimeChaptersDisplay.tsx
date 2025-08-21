import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Clock, Loader2, RefreshCw } from 'lucide-react';

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
  onRequestChapters?: () => void;
  onChapterClick?: (startTime: number) => void;
}

const RealtimeChaptersDisplay: React.FC<RealtimeChaptersDisplayProps> = ({
  chapters,
  transcriptionStatus,
  isRecording = false,
  onRequestChapters,
  onChapterClick
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canGenerateChapters = transcriptionStatus === 'completed' || 
    (transcriptionStatus === 'processing' && !isRecording);

  if (isRecording && transcriptionStatus === 'processing') {
    return (
      <div className="space-y-4">
        {/* Recording Status */}
        <div className="flex items-center justify-center p-6 bg-card/50 rounded-lg border">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium">Recording in progress...</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs">
              Chapters will be generated automatically as you speak. 
              Continue recording to build your content structure.
            </p>
          </div>
        </div>

        {/* Existing chapters if any */}
        {chapters.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Auto-Generated Chapters ({chapters.length})
              </h4>
              <Badge variant="secondary" className="text-xs">
                Live
              </Badge>
            </div>
            
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-card/30 rounded-lg border border-border/50 hover:bg-card/50 transition-colors cursor-pointer"
                    onClick={() => onChapterClick?.(chapter.startTime)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium leading-tight">
                        {chapter.title}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {formatTime(chapter.startTime)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {chapter.summary}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
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
