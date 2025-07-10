import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ListTodo, AlignLeft, ClipboardList, FileText, Loader2, ChevronDown, Expand, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentViewer } from '@/components/content/ContentViewer';
import { AudioPlayer } from '@/components/content/AudioPlayer';
import { ContentData } from '@/pages/ContentPage';
import { RecordingStateInfo, RecordingMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ContentLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
  recordingStateInfo?: RecordingStateInfo;
  recordingMetadata?: RecordingMetadata | null;
  isRecordingLoading?: boolean;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
}

export function ContentLeftSidebar({
  contentData,
  onUpdateContent,
  isRecording,
  toggleRecording,
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear,
  recordingStateInfo,
  recordingMetadata,
  isRecordingLoading,
  onTextAction
}: ContentLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set());
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

  const toggleChapter = (index: number) => {
    const newOpenChapters = new Set(openChapters);
    if (newOpenChapters.has(index)) {
      newOpenChapters.delete(index);
    } else {
      newOpenChapters.add(index);
    }
    setOpenChapters(newOpenChapters);
  };

  // Check if we should hide tabs (for PDF content)
  const shouldHideTabs = contentData.type === 'pdf';
  
  const renderControls = () => {
    // Show loading state while detecting recording state
    if (contentData.type === 'recording' && isRecordingLoading) {
      return <div className="p-4 flex items-center justify-center bg-dashboard-card dark:bg-dashboard-card">
          <div className="flex items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recording...</span>
          </div>
        </div>;
    }

    // Live recording interface - show recording controls with microphone selector below
    if (contentData.type === 'live_recording') {
      return <>
          <div className="p-4 pb-2 shrink-0 bg-background ">
            <RecordingControls isRecording={isRecording} toggleRecording={toggleRecording} recordingTime={recordingTime} />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-background ">
            <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>;
    }

    // New recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isNewRecording) {
      return <>
          <div className="p-4 pb-2 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <RecordingControls isRecording={isRecording} toggleRecording={toggleRecording} recordingTime={recordingTime} />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>;
    }

    // Existing recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isExistingRecording && recordingMetadata) {
      return <div className="p-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
          <AudioPlayer metadata={recordingMetadata} onTimeUpdate={time => {
          // Update current playback time for chapter navigation
          console.log('Current time:', time);
        }} />
        </div>;
    }

    // Default content viewer for other types
    return <div className={cn("p-4 shrink-0 bg-background", shouldHideTabs && "flex-1")}>
        <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} onTextAction={onTextAction} />
      </div>;
  };

  // Helper function to extract transcript segment for a chapter based on timestamps
  const getChapterTranscript = (chapter: any, fullTranscript: string, chapters: any[]) => {
    if (!fullTranscript || !chapter.startTime) return 'Transcript not available for this chapter.';
    
    // Find current and next chapter for time boundaries
    const currentChapterIndex = chapters.findIndex((c: any) => c.title === chapter.title);
    const nextChapter = chapters[currentChapterIndex + 1];
    
    const startTime = chapter.startTime; // in seconds
    const endTime = nextChapter ? nextChapter.startTime : null;
    
    // Split transcript by lines/sentences to find timestamp-based segments
    const transcriptLines = fullTranscript.split(/[.!?]\s+|\n/).filter(line => line.trim().length > 0);
    
    // For YouTube transcripts, we need to extract the segment that corresponds to this chapter's timeframe
    // Since we don't have exact timestamp alignment, we'll use proportional extraction
    const totalVideoDuration = chapters[chapters.length - 1]?.startTime || startTime + 300; // fallback duration
    
    const startRatio = startTime / totalVideoDuration;
    const endRatio = endTime ? endTime / totalVideoDuration : 1;
    
    const startLineIndex = Math.floor(transcriptLines.length * startRatio);
    const endLineIndex = endTime ? Math.floor(transcriptLines.length * endRatio) : transcriptLines.length;
    
    // Extract the relevant transcript segment
    const chapterTranscript = transcriptLines.slice(startLineIndex, endLineIndex).join('. ');
    
    // Ensure we have meaningful content
    if (chapterTranscript.length < 50 && transcriptLines.length > 0) {
      // If segment is too short, take a minimum meaningful portion
      const minLines = Math.min(5, transcriptLines.length - startLineIndex);
      return transcriptLines.slice(startLineIndex, startLineIndex + minLines).join('. ') + '.';
    }
    
    return chapterTranscript ? chapterTranscript + '.' : 'Transcript segment not available for this chapter.';
  };

  const formatTimestamp = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTabContent = () => {
    const hasContent = contentData.type === 'live_recording' ? isRecording : recordingStateInfo?.isNewRecording ? isRecording : recordingStateInfo?.isExistingRecording ? true : !!contentData.url || !!contentData.text;
    return <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {(contentData.type === 'live_recording' || recordingStateInfo?.isNewRecording && isRecording) && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Recording in progress...
                  </div>}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && <div className="grid grid-cols-2 gap-3">
                    {recordingMetadata.chaptersData.map((chapter, index) => (
                      <Collapsible 
                        key={chapter.id} 
                        open={openChapters.has(index)}
                        onOpenChange={() => toggleChapter(index)}
                      >
                        <div className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-start justify-between gap-2 w-full">
                              <div className="flex-1 min-w-0 text-left">
                                <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm">
                                  {chapter.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-nowrap">
                                  {formatTimestamp(chapter.startTime)}
                                </span>
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-dashboard-text-secondary transition-transform",
                                  openChapters.has(index) && "rotate-180"
                                )} />
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-2">
                            <div className="prose prose-sm max-w-none text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                              <p className="text-xs whitespace-pre-wrap leading-relaxed">
                                {chapter.summary}
                              </p>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>}
                {contentData.type === 'youtube' && contentData.metadata?.chapters && Array.isArray(contentData.metadata.chapters) && contentData.metadata.chapters.length > 0 && <div className="grid grid-cols-2 gap-3">
                    {contentData.metadata.chapters.map((chapter: any, index: number) => (
                      <Collapsible 
                        key={index} 
                        open={openChapters.has(index)}
                        onOpenChange={() => toggleChapter(index)}
                      >
                        <div className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-start justify-between gap-2 w-full">
                              <div className="flex-1 min-w-0 text-left">
                                <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm">
                                  {chapter.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono whitespace-nowrap">
                                  {formatTimestamp(chapter.startTime)}
                                </span>
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-dashboard-text-secondary transition-transform",
                                  openChapters.has(index) && "rotate-180"
                                )} />
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pt-3">
                            <div className="prose prose-sm max-w-none">
                              <div className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-pre-wrap leading-relaxed p-3 bg-background/50 dark:bg-background/50 rounded border border-dashboard-separator/10 dark:border-white/5">
                                {getChapterTranscript(chapter, contentData.text || '', contentData.metadata?.chapters || [])}
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>}
                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Processing content...
                  </div>}
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-sm">
                  {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view chapters' : 'Add content to view chapters'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {(contentData.type === 'live_recording' || recordingStateInfo?.isNewRecording && isRecording) && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Transcribing in progress...
                  </div>}
                {recordingStateInfo?.isExistingRecording && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-4">
                      Full transcript available
                    </p>
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10">
                      <p>This is where the full transcript would appear. The transcript would be searchable and time-synced with the audio playback.</p>
                    </div>
                  </div>}
                {contentData.type === 'youtube' && contentData.text && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-dashboard-separator/20"
                      >
                        {isTranscriptExpanded ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Expand className="h-4 w-4" />
                        )}
                      </Button>
                      <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed pr-10">
                        {contentData.text}
                      </p>
                    </div>
                  </div>}
                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Extracting text...
                  </div>}
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-sm">
                  {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view transcripts' : 'Add content to view transcripts'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
      </>;
  };

  // If it's PDF content, render without tabs
  if (shouldHideTabs) {
    return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg">
        {renderControls()}
      </div>;
  }

  // Default layout with tabs for other content types
  return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg relative">
      {/* Full-page transcript overlay */}
      {isTranscriptExpanded && contentData.type === 'youtube' && contentData.text && (
        <div className="absolute inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Full Transcript</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTranscriptExpanded(false)}
              className="h-8 w-8 p-0"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {contentData.text}
              </p>
            </div>
          </ScrollArea>
        </div>
      )}

      {renderControls()}
      
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-background ">
        <TabsList className={cn("w-fit justify-start gap-1 p-1 h-12 shrink-0 mx-4 my-2", "bg-card dark:bg-card", "transition-colors duration-200", "rounded-xl")}>
          <TabsTrigger value="chapters" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none", "px-6")}>
            <ListTodo className="h-[14px] w-[14px]" />
            <span>Chapters</span>
          </TabsTrigger>
          <TabsTrigger value="transcripts" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none", "px-6")}>
            <AlignLeft className="h-[14px] w-[14px]" />
            <span>Transcripts</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>;
}
