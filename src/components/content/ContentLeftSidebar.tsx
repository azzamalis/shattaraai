
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTodo, AlignLeft, ClipboardList, FileText } from 'lucide-react';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentViewer } from '@/components/content/ContentViewer';
import { ContentData } from '@/pages/ContentPage';
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
}

export function ContentLeftSidebar({
  contentData,
  onUpdateContent,
  isRecording,
  toggleRecording,
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear
}: ContentLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");

  const renderControls = () => {
    if (contentData.type === 'recording') {
      return <>
          <div className="p-4 pb-2 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <RecordingControls isRecording={isRecording} toggleRecording={toggleRecording} recordingTime={recordingTime} />
          </div>
        </>;
    }
    return <div className="p-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
        <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} />
      </div>;
  };

  const renderTabContent = () => {
    const hasContent = contentData.type === 'recording' ? isRecording : !!contentData.url || !!contentData.filePath || !!contentData.text;
    return <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  {contentData.type === 'recording' && isRecording && "Recording in progress..."}
                  {contentData.type !== 'recording' && "Processing content..."}
                </div>
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ClipboardList className="h-12 w-12 mb-4 text-dashboard-text-secondary/40 dark:text-dashboard-text-secondary/40" />
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-lg">
                  {contentData.type === 'recording' ? 'Start recording to view chapters' : 'Add content to view chapters'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                  {contentData.type === 'recording' && isRecording && "Transcribing in progress..."}
                  {contentData.type !== 'recording' && "Extracting text..."}
                </div>
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <FileText className="h-12 w-12 mb-4 text-dashboard-text-secondary/40 dark:text-dashboard-text-secondary/40" />
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-lg">
                  {contentData.type === 'recording' ? 'Start recording to view transcripts' : 'Add content to view transcripts'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
      </>;
  };

  return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg">
      {renderControls()}
      
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-dashboard-card dark:bg-dashboard-card">
        <TabsList className={cn(
          "w-fit justify-start gap-1 p-1 h-12 shrink-0 ml-4",
          "bg-dashboard-bg dark:bg-dashboard-bg transition-colors duration-200",
          "rounded-xl flex"
        )}>
          <TabsTrigger 
            value="chapters"
            className={cn(
              "h-full rounded-md flex items-center gap-2",
              "px-6",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
            )}
          >
            <ListTodo className="h-[14px] w-[14px]" />
            <span>Chapters</span>
          </TabsTrigger>
          <TabsTrigger 
            value="transcripts"
            className={cn(
              "h-full rounded-md flex items-center gap-2",
              "px-6",
              "text-sm font-medium",
              "text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70",
              "hover:text-dashboard-text-secondary dark:hover:text-dashboard-text-secondary",
              "data-[state=active]:text-dashboard-text dark:data-[state=active]:text-dashboard-text",
              "data-[state=active]:bg-dashboard-card dark:data-[state=active]:bg-dashboard-card",
              "data-[state=active]:shadow-none",
              "transition-colors duration-200",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "focus:ring-0 focus:ring-offset-0",
              "ring-0 ring-offset-0",
              "border-0 outline-none",
              "data-[state=active]:ring-0",
              "data-[state=active]:ring-offset-0",
              "data-[state=active]:border-0",
              "data-[state=active]:outline-none"
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
    </div>;
}
