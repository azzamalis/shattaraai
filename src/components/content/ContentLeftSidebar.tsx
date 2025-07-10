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
  const [activeTab, setActiveTab] = useState("content");
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

  const getChapterTranscriptSegment = (chapter: any, allText: string) => {
    // For demo purposes, we'll split the transcript text by approximate chapter boundaries
    // In a real implementation, this would use actual timestamp-based segmentation
    const words = allText.split(' ');
    const wordsPerChapter = Math.floor(words.length / (contentData.metadata?.chapters?.length || 1));
    const chapterIndex = contentData.metadata?.chapters?.indexOf(chapter) || 0;
    const startIndex = chapterIndex * wordsPerChapter;
    const endIndex = Math.min(startIndex + wordsPerChapter, words.length);
    return words.slice(startIndex, endIndex).join(' ');
  };

  const renderTabContent = () => {
    const hasContent = contentData.type === 'live_recording' ? isRecording : recordingStateInfo?.isNewRecording ? isRecording : recordingStateInfo?.isExistingRecording ? true : !!contentData.url || !!contentData.text;
    
    return <>
        <TabsContent value="content" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {(contentData.type === 'live_recording' || recordingStateInfo?.isNewRecording && isRecording) && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Recording in progress...
                  </div>}
                
                {/* Combined chapters and transcripts view */}
                {contentData.type === 'youtube' && contentData.metadata?.chapters && Array.isArray(contentData.metadata.chapters) && contentData.metadata.chapters.length > 0 && contentData.text && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text">Chapters & Transcripts</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                        className="h-8 w-8 p-0 hover:bg-dashboard-separator/20"
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {contentData.metadata.chapters.map((chapter: any, index: number) => (
                        <Collapsible 
                          key={index} 
                          open={openChapters.has(index)}
                          onOpenChange={() => toggleChapter(index)}
                        >
                          <div className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors">
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-start justify-between gap-2 w-full">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-nowrap font-mono">
                                    {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                                  </span>
                                  <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm text-left">
                                    {chapter.title}
                                  </h4>
                                </div>
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-dashboard-text-secondary transition-transform shrink-0",
                                  openChapters.has(index) && "rotate-180"
                                )} />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3 space-y-3">
                              {chapter.summary && (
                                <div className="p-2 bg-dashboard-separator/10 dark:bg-white/5 rounded">
                                  <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-xs">
                                    {chapter.summary}
                                  </p>
                                </div>
                              )}
                              <div className="p-2 bg-dashboard-separator/5 dark:bg-white/5 rounded">
                                <p className="text-dashboard-text dark:text-dashboard-text text-xs leading-relaxed">
                                  {getChapterTranscriptSegment(chapter, contentData.text)}
                                </p>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recording content with chapters */}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text">Chapters & Transcripts</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {recordingMetadata.chaptersData.map((chapter, index) => (
                        <Collapsible 
                          key={chapter.id} 
                          open={openChapters.has(index)}
                          onOpenChange={() => toggleChapter(index)}
                        >
                          <div className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors">
                            <CollapsibleTrigger className="w-full">
                              <div className="flex items-start justify-between gap-2 w-full">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-nowrap font-mono">
                                    {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                                  </span>
                                  <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm text-left">
                                    {chapter.title}
                                  </h4>
                                </div>
                                <ChevronDown className={cn(
                                  "h-4 w-4 text-dashboard-text-secondary transition-transform shrink-0",
                                  openChapters.has(index) && "rotate-180"
                                )} />
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3 space-y-3">
                              <div className="p-2 bg-dashboard-separator/10 dark:bg-white/5 rounded">
                                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-xs">
                                  {chapter.summary}
                                </p>
                              </div>
                              <div className="p-2 bg-dashboard-separator/5 dark:bg-white/5 rounded">
                                <p className="text-dashboard-text dark:text-dashboard-text text-xs leading-relaxed">
                                  Chapter transcript would appear here based on timestamps
                                </p>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback for content without chapters */}
                {contentData.type === 'youtube' && contentData.text && (!contentData.metadata?.chapters || contentData.metadata.chapters.length === 0) && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-dashboard-text dark:text-dashboard-text">Full Transcript</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                        className="h-8 w-8 p-0 hover:bg-dashboard-separator/20"
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10">
                      <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed">
                        {contentData.text}
                      </p>
                    </div>
                  </div>
                )}

                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Processing content...
                  </div>}
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-sm">
                  {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view content' : 'Add content to view chapters and transcripts'}
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
      
      <Tabs defaultValue="content" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-background ">
        <TabsList className={cn("w-fit justify-start gap-1 p-1 h-12 shrink-0 mx-4 my-2", "bg-card dark:bg-card", "transition-colors duration-200", "rounded-xl")}>
          <TabsTrigger value="content" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none", "px-6")}>
            <FileText className="h-[14px] w-[14px]" />
            <span>Content</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>;
}
