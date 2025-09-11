import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Layers, FileText, ClipboardList } from 'lucide-react';
import { ContentData } from '@/pages/ContentPage';
import RealtimeTranscriptionDisplay from './RealtimeTranscriptionDisplay';
import RealtimeChaptersDisplay from './RealtimeChaptersDisplay';
import { useContent } from '@/hooks/useContent';
import { cn } from '@/lib/utils';

interface MediaLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  onChapterClick?: (timestamp: number) => void;
  currentTimestamp?: number;
  onSeekToTimestamp?: (timestamp: number) => void;
  isRecording?: boolean;
  transcriptionChunks?: any[];
  fullTranscript?: string;
  liveChapters?: any[];
  transcriptionStatus?: string;
  isProcessingFinal?: boolean;
  isLoadingData?: boolean;
  requestChapters?: () => void;
}

export function MediaLeftSidebar({
  contentData,
  onUpdateContent,
  onTextAction,
  onChapterClick,
  currentTimestamp,
  onSeekToTimestamp,
  isRecording = false,
  transcriptionChunks = [],
  fullTranscript = '',
  liveChapters = [],
  transcriptionStatus = 'pending',
  isProcessingFinal = false,
  isLoadingData = false,
  requestChapters
}: MediaLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const { retryProcessing } = useContent();

  const handleChapterClick = (timestamp: number) => {
    if (onChapterClick) {
      onChapterClick(timestamp);
    }
  };

  const hasContent = contentData.type === 'live_recording' ? (isRecording || transcriptionChunks.length > 0) : 
                    !!contentData.url || !!contentData.text;

  const renderEmptyState = (icon: React.ReactNode, title: string, description: string) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      {icon}
      <p className="text-[14px] font-medium text-primary mb-1.5 text-center">{title}</p>
      <p className="text-[13px] text-muted-foreground text-center">{description}</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <Tabs defaultValue="chapters" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none gap-6 p-4 bg-transparent h-12">
            <TabsTrigger
              value="chapters"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary/70 px-0 py-2 text-muted-foreground hover:text-primary flex items-center justify-center h-full"
            >
              <Layers className="h-[18px] w-[18px] mr-2.5" />
              <span className="text-[14px] font-medium tracking-[-0.1px]">Chapters</span>
            </TabsTrigger>
            <TabsTrigger
              value="transcripts"
              className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary/70 px-0 py-2 text-muted-foreground hover:text-primary flex items-center justify-center h-full"
            >
              <FileText className="h-[18px] w-[18px] mr-2.5" />
              <span className="text-[14px] font-medium tracking-[-0.1px]">Transcript</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 relative">
        <Tabs defaultValue="chapters" value={activeTab} className="w-full h-full">
          <TabsContent value="chapters" className="absolute inset-0">
            <ScrollArea className="h-full">
              {hasContent ? (
                <div className="p-6 space-y-8">
                  {/* Live recording chapters */}
                  {contentData.type === 'live_recording' && (
                    <RealtimeChaptersDisplay
                      chapters={liveChapters}
                      transcriptionStatus={transcriptionStatus as 'pending' | 'ready' | 'processing' | 'completed' | 'failed'}
                      isRecording={isRecording}
                      isProcessingFinal={isProcessingFinal}
                      onRequestChapters={requestChapters}
                      onChapterClick={handleChapterClick}
                      onSeekToTimestamp={onSeekToTimestamp}
                      isLoadingData={isLoadingData}
                    />
                  )}
                  
                  {/* Audio/Video file chapters */}
                  {(contentData.type === 'audio_file' || contentData.type === 'video') && (
                    <RealtimeChaptersDisplay
                      chapters={contentData.chapters ? contentData.chapters.map((chapter: any) => ({
                        title: chapter.title,
                        summary: chapter.summary || '',
                        startTime: chapter.startTime,
                        endTime: chapter.endTime || chapter.startTime + 60
                      })) : []}
                      transcriptionStatus={contentData.text_content ? 'completed' as const : 'pending' as const}
                      processingStatus={contentData.processing_status as 'pending' | 'processing' | 'completed' | 'failed'}
                      contentType={contentData.type}
                      onChapterClick={handleChapterClick}
                      onSeekToTimestamp={onSeekToTimestamp}
                      onRetryProcessing={() => contentData.id && retryProcessing(contentData.id)}
                    />
                  )}

                  {/* YouTube chapters */}
                  {contentData.type === 'youtube' && (
                    <RealtimeChaptersDisplay
                      chapters={contentData.chapters ? contentData.chapters.map((chapter: any) => ({
                        title: chapter.title,
                        summary: chapter.summary || '',
                        startTime: chapter.startTime,
                        endTime: chapter.endTime || chapter.startTime + 60
                      })) : []}
                      transcriptionStatus={contentData.text_content ? 'completed' : 'pending'}
                      processingStatus={contentData.processing_status as 'pending' | 'processing' | 'completed' | 'failed'}
                      contentType={contentData.type}
                      onChapterClick={handleChapterClick}
                      onSeekToTimestamp={onSeekToTimestamp}
                      onRetryProcessing={() => contentData.id && retryProcessing(contentData.id)}
                    />
                  )}
                </div>
              ) : (
                renderEmptyState(
                  <ClipboardList className="h-12 w-12 mb-4 text-muted-foreground/30" />,
                  "No Chapters Yet",
                  "Upload or start recording to view chapters"
                )
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="transcripts" className="absolute inset-0">
            <ScrollArea className="h-full">
              {hasContent ? (
                <div className="p-6 space-y-8">
                  {/* Live recording transcripts */}
                  {contentData.type === 'live_recording' && (
                    <RealtimeTranscriptionDisplay
                      transcriptionChunks={transcriptionChunks}
                      fullTranscript={fullTranscript}
                      transcriptionProgress={0}
                      transcriptionStatus={transcriptionStatus as 'pending' | 'ready' | 'processing' | 'completed' | 'failed'}
                      averageConfidence={0}
                      isProcessingAudio={false}
                      isRecording={isRecording}
                      isProcessingFinal={isProcessingFinal}
                      currentPlaybackTime={currentTimestamp}
                      onSeekToTimestamp={onSeekToTimestamp}
                      isLoadingData={isLoadingData}
                    />
                  )}
                  
                  {/* Other media types transcripts */}
                  {(contentData.type === 'audio_file' || contentData.type === 'video' || contentData.type === 'youtube') && (
                    <div className="space-y-4">
                      {contentData.text_content ? (
                        <div className="prose max-w-none text-sm text-foreground bg-card rounded-lg p-4">
                          <div className="whitespace-pre-wrap">{contentData.text_content}</div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Transcript not available yet</p>
                          {contentData.processing_status === 'failed' && (
                            <button 
                              onClick={() => contentData.id && retryProcessing(contentData.id)}
                              className="mt-2 text-primary hover:underline"
                            >
                              Retry processing
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                renderEmptyState(
                  <FileText className="h-12 w-12 mb-4 text-muted-foreground/30" />,
                  "No Transcript Yet",
                  "Upload or start recording to view transcript"
                )
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
