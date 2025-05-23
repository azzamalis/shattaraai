
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTodo, AlignLeft, ClipboardList, FileText } from 'lucide-react';
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
          <div className="p-4 pb-2 shrink-0 bg-[#222222]">
            <MicrophoneSelector 
              selected={selectedMicrophone} 
              onSelect={onMicrophoneSelect} 
              onClear={onMicrophoneClear} 
            />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-[#222222]">
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
      <div className="p-4 shrink-0 bg-[#222222]">
        <ContentViewer 
          contentData={contentData}
          onUpdateContent={onUpdateContent}
        />
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
                <div className="text-white/60">
                  {contentData.type === 'recording' && isRecording && "Recording in progress..."}
                  {contentData.type !== 'recording' && "Processing content..."}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ClipboardList className="h-12 w-12 mb-4 text-white/30" />
                <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Chapters Yet</p>
                <p className="text-[13px] text-white/60 text-center">
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
                <div className="text-white/60">
                  {contentData.type === 'recording' && isRecording && "Transcribing in progress..."}
                  {contentData.type !== 'recording' && "Extracting text..."}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <FileText className="h-12 w-12 mb-4 text-white/30" />
                <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Transcripts Yet</p>
                <p className="text-[13px] text-white/60 text-center">
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
    <div className="h-full flex flex-col min-h-0 bg-black">
      {renderControls()}
      
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-[#222222]">
        <TabsList className="w-full border-b border-white/10 p-0 h-12 px-4 gap-6 mb-2 shrink-0 bg-[#222222]">
          <TabsTrigger value="chapters" className="flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white/70 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 flex items-center justify-center">
            <ListTodo className="h-[18px] w-[18px] mr-2.5 flex-shrink-0" />
            <span className="text-[14px] font-medium tracking-[-0.1px]">Chapters</span>
          </TabsTrigger>
          <TabsTrigger value="transcripts" className="flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white/70 data-[state=active]:shadow-none data-[state=active]:bg-transparent px-4 py-2 flex items-center justify-center">
            <AlignLeft className="h-[18px] w-[18px] mr-2.5 flex-shrink-0" />
            <span className="text-[14px] font-medium tracking-[-0.1px]">Transcripts</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>
  );
}
