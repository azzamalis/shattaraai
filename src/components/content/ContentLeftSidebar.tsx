import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTodo, AlignLeft, ClipboardList, FileText, Loader2 } from 'lucide-react';
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

  const renderTabContent = () => {
    const hasContent = contentData.type === 'live_recording' ? isRecording : recordingStateInfo?.isNewRecording ? isRecording : recordingStateInfo?.isExistingRecording ? true : !!contentData.url || !!contentData.text;
    return <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {(contentData.type === 'live_recording' || recordingStateInfo?.isNewRecording && isRecording) && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Recording in progress...
                  </div>}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && <div className="space-y-3">
                    {recordingMetadata.chaptersData.map(chapter => <div key={chapter.id} className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-lg">
                              {chapter.title}
                            </h4>
                            <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary mt-1 text-sm">
                              {chapter.summary}
                            </p>
                          </div>
                          <span className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-nowrap">
                            {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>)}
                  </div>}
                {contentData.type === 'youtube' && contentData.metadata?.chapters && Array.isArray(contentData.metadata.chapters) && contentData.metadata.chapters.length > 0 && <div className="space-y-3">
                    {contentData.metadata.chapters.map((chapter: any, index: number) => <div key={index} className="p-3 rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-lg">
                              {chapter.title}
                            </h4>
                          </div>
                          <span className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary whitespace-nowrap">
                            {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>)}
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
                {contentData.type === 'youtube' && contentData.text && contentData.text.length > 100 && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10">
                      <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed">{contentData.text}</p>
                    </div>
                  </div>}
                {(!contentData.text || contentData.text.length <= 100) && contentData.text && contentData.type === 'youtube' && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10">
                      <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap">{contentData.text}</p>
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
  return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg">
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
