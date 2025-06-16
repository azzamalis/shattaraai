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

  // For PDF content, we render it in the main content area without tabs
  if (contentData.type === 'pdf') {
    return (
      <div className="h-full flex flex-col min-h-0 bg-background">
        <div className="flex-1 p-0 bg-card">
          <ContentViewer 
            contentData={contentData} 
            onUpdateContent={onUpdateContent} 
            onTextAction={onTextAction} 
          />
        </div>
      </div>
    );
  }
  
  const renderControls = () => {
    // Show loading state while detecting recording state
    if (contentData.type === 'recording' && isRecordingLoading) {
      return (
        <div className="p-4 flex items-center justify-center bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recording...</span>
          </div>
        </div>
      );
    }

    // Live recording interface - show recording controls
    if (contentData.type === 'recording' && recordingStateInfo?.isNewRecording) {
      return (
        <>
          <div className="p-4 pb-2 shrink-0 bg-card">
            <MicrophoneSelector 
              selected={selectedMicrophone} 
              onSelect={onMicrophoneSelect} 
              onClear={onMicrophoneClear} 
            />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-card">
            <RecordingControls 
              isRecording={isRecording} 
              toggleRecording={toggleRecording} 
              recordingTime={recordingTime} 
            />
          </div>
        </>
      );
    }

    // Existing recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isExistingRecording && recordingMetadata) {
      return (
        <div className="p-4 shrink-0 bg-card">
          <AudioPlayer 
            metadata={recordingMetadata} 
            onTimeUpdate={(time) => {
              // Update current playback time for chapter navigation
              console.log('Current time:', time);
            }} 
          />
        </div>
      );
    }

    // For other content types (not recording), show a preview in the controls area
    if (contentData.type !== 'recording') {
      return (
        <div className="p-4 shrink-0 bg-card">
          <ContentViewer 
            contentData={contentData} 
            onUpdateContent={onUpdateContent} 
            onTextAction={onTextAction} 
          />
        </div>
      );
    }

    return null;
  };
  
  const renderTabContent = () => {
    const hasContent = contentData.type === 'recording' ? 
                      recordingStateInfo?.isNewRecording ? isRecording : 
                      recordingStateInfo?.isExistingRecording ? true : 
                      false :
                      !!contentData.url || !!contentData.filePath || !!contentData.text;
    
    return (
      <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? (
              <div className="p-4 space-y-4">
                {(recordingStateInfo?.isNewRecording && isRecording) && (
                  <div className="text-muted-foreground">
                    Recording in progress...
                  </div>
                )}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && (
                  <div className="space-y-3">
                    {recordingMetadata.chaptersData.map(chapter => (
                      <div 
                        key={chapter.id} 
                        className="p-3 rounded-lg bg-background border border-border/20 hover:bg-muted/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate text-lg">
                              {chapter.title}
                            </h4>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {chapter.summary}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {contentData.type !== 'recording' && (
                  <div className="text-muted-foreground">
                    Processing content...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ClipboardList className="h-8 w-8 mb-4 text-muted-foreground/40" />
                <p className="text-muted-foreground text-center text-base">
                  {contentData.type === 'recording' 
                    ? 'Start recording to view chapters' 
                    : 'Add content to view chapters'}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? (
              <div className="p-4 space-y-4">
                {(recordingStateInfo?.isNewRecording && isRecording) && (
                  <div className="text-muted-foreground">
                    Transcribing in progress...
                  </div>
                )}
                {recordingStateInfo?.isExistingRecording && (
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p className="text-muted-foreground mb-4">
                      Full transcript available
                    </p>
                    <div className="bg-background p-4 rounded-lg border border-border/20">
                      <p>This is where the full transcript would appear. The transcript would be searchable and time-synced with the audio playback.</p>
                    </div>
                  </div>
                )}
                {contentData.type !== 'recording' && (
                  <div className="text-muted-foreground">
                    Extracting text...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <FileText className="h-8 w-8 mb-4 text-muted-foreground/40" />
                <p className="text-muted-foreground text-center text-base">
                  {contentData.type === 'recording' 
                    ? 'Start recording to view transcripts' 
                    : 'Add content to view transcripts'}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </>
    );
  };

  // Default layout with tabs for other content types
  return (
    <div className="h-full flex flex-col min-h-0 bg-background">
      {renderControls()}
      
      <Tabs 
        defaultValue="chapters" 
        onValueChange={setActiveTab} 
        className="flex-1 flex flex-col overflow-hidden bg-card"
      >
        <TabsList className={cn(
          "w-fit justify-start gap-4 p-4 h-12 shrink-0 mx-4 my-2",
          "bg-background transition-colors duration-200",
          "rounded-xl flex"
        )}>
          <TabsTrigger 
            value="chapters" 
            className={cn(
              "h-full rounded-md flex items-center gap-2 px-6 text-sm font-medium",
              "text-muted-foreground/70 hover:text-muted-foreground",
              "data-[state=active]:text-foreground data-[state=active]:bg-card",
              "data-[state=active]:shadow-none transition-colors duration-200",
              "focus-visible:ring-0 focus-visible:ring-offset-0 border-0 outline-none"
            )}
          >
            <ListTodo className="h-[14px] w-[14px]" />
            <span>Chapters</span>
          </TabsTrigger>
          <TabsTrigger 
            value="transcripts" 
            className={cn(
              "h-full rounded-md flex items-center gap-2 px-6 text-sm font-medium",
              "text-muted-foreground/70 hover:text-muted-foreground",
              "data-[state=active]:text-foreground data-[state=active]:bg-card",
              "data-[state=active]:shadow-none transition-colors duration-200",
              "focus-visible:ring-0 focus-visible:ring-offset-0 border-0 outline-none"
            )}
          >
            <AlignLeft className="h-[14px] w-[14px]" />
            <span>Transcripts</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
}
