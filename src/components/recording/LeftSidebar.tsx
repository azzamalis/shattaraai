
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, AlignLeft, ListTodo, ClipboardList } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecordingControls } from './RecordingControls';
import { MicrophoneSelector } from './MicrophoneSelector';

interface LeftSidebarProps {
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
}

export function LeftSidebar({
  isRecording,
  toggleRecording,
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  
  return (
    <div className="flex flex-col h-full bg-black">
      <Tabs 
        defaultValue="chapters"
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="w-full bg-transparent border-b border-white/10 p-0 h-12">
          <TabsTrigger 
            value="chapters"
            className="flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <ListTodo className="mr-2 h-4 w-4" />
            Chapters
          </TabsTrigger>
          <TabsTrigger 
            value="transcripts"
            className="flex-1 h-full rounded-none bg-transparent text-white/70 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-[#2323FF] data-[state=active]:shadow-none data-[state=active]:bg-transparent"
          >
            <AlignLeft className="mr-2 h-4 w-4" />
            Transcripts
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4 border-b border-white/10">
          <MicrophoneSelector 
            selected={selectedMicrophone}
            onSelect={onMicrophoneSelect}
            onClear={onMicrophoneClear}
          />
          
          <div className="mt-4 w-full">
            <RecordingControls 
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              recordingTime={recordingTime}
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <TabsContent value="chapters" className="p-4 min-h-[200px]">
            <div className="flex flex-col items-center justify-center h-full text-white/60">
              <ClipboardList className="h-12 w-12 mb-4 text-white/30" />
              <p className="font-medium text-white mb-1">No Chapters Yet</p>
              <p className="text-sm">Start recording to view chapters</p>
            </div>
          </TabsContent>
          
          <TabsContent value="transcripts" className="p-4 min-h-[200px]">
            <div className="flex flex-col items-center justify-center h-full text-white/60">
              <FileText className="h-12 w-12 mb-4 text-white/30" />
              <p className="font-medium text-white mb-1">No Transcripts Yet</p>
              <p className="text-sm">Start recording to view transcripts</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
