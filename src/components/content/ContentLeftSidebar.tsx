
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTodo, AlignLeft } from 'lucide-react';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentViewer } from '@/components/content/ContentViewer';
import { ContentData } from '@/pages/ContentPage';

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
      return (
        <>
          <div className="p-4 pb-3 shrink-0 bg-dashboard-bg">
            <MicrophoneSelector 
              selected={selectedMicrophone} 
              onSelect={onMicrophoneSelect} 
              onClear={onMicrophoneClear} 
            />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-dashboard-bg">
            <RecordingControls 
              isRecording={isRecording} 
              toggleRecording={toggleRecording} 
              recordingTime={recordingTime} 
            />
          </div>
        </>
      );
    }
    return (
      <div className="p-4 shrink-0 bg-dashboard-bg">
        <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} />
      </div>
    );
  };

  const renderTabContent = () => {
    const hasContent = contentData.type === 'recording' ? isRecording : !!contentData.url || !!contentData.filePath;
    
    return (
      <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? (
              <div className="p-4 space-y-4">
                <div className="text-dashboard-text-secondary">
                  {contentData.type === 'recording' && isRecording && "Recording in progress..."}
                  {contentData.type !== 'recording' && "Processing content..."}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <p className="text-dashboard-text-secondary text-center text-base">
                  {contentData.type === 'recording' ? 'Start recording to view chapters' : 'Add content to view chapters'}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? (
              <div className="p-4 space-y-4">
                <div className="text-dashboard-text-secondary">
                  {contentData.type === 'recording' && isRecording && "Transcribing in progress..."}
                  {contentData.type !== 'recording' && "Extracting text..."}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <p className="text-dashboard-text-secondary text-center text-base">
                  {contentData.type === 'recording' ? 'Start recording to view transcripts' : 'Add content to view transcripts'}
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </>
    );
  };

  return (
    <div className="h-full flex flex-col min-h-0 bg-dashboard-bg">
      {renderControls()}
      
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-dashboard-bg">
        <div className="px-4 pt-2 pb-3 shrink-0">
          <TabsList className="w-fit bg-dashboard-card border border-dashboard-separator shadow-sm rounded-lg p-1 h-9 flex gap-1">
            <TabsTrigger 
              value="chapters" 
              className="h-7 px-3 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
            >
              <ListTodo className="h-4 w-4" />
              <span className="text-sm font-medium">Chapters</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transcripts" 
              className="h-7 px-3 rounded-md bg-transparent text-dashboard-text-secondary hover:text-dashboard-text data-[state=active]:bg-dashboard-bg data-[state=active]:text-dashboard-text data-[state=active]:shadow-sm transition-all duration-200 flex items-center gap-2"
            >
              <AlignLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Transcripts</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
}
