
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, FileText, ClipboardList } from "lucide-react";
import RecordingControls from "@/components/RecordingControls";
import MicrophoneSelector from "@/components/MicrophoneSelector";

interface LeftSidebarProps {
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
}

const LeftSidebar = ({ 
  isRecording, 
  toggleRecording, 
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear
}: LeftSidebarProps) => {
  const [activeTab, setActiveTab] = useState("chapters");

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden">
      {/* Microphone Selector */}
      <div className="p-4 pb-2">
        <MicrophoneSelector 
          selected={selectedMicrophone}
          onSelect={onMicrophoneSelect}
          onClear={onMicrophoneClear}
        />
      </div>
      
      {/* Recording Controls */}
      <div className="px-4 pb-4">
        <RecordingControls 
          isRecording={isRecording} 
          time={parseInt(recordingTime.split(':')[0]) * 60 + parseInt(recordingTime.split(':')[1])} 
          toggleRecording={toggleRecording} 
        />
      </div>
      
      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-black border-b border-white/10">
        <Tabs defaultValue="chapters" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start rounded-none gap-6 p-4 bg-transparent h-12">
            <TabsTrigger
              value="chapters"
              className={`data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white/70 px-0 py-2 text-white/70 hover:text-white flex items-center justify-center h-full`}
            >
              <Layers className="h-[18px] w-[18px] mr-2.5" />
              <span className="text-[14px] font-medium tracking-[-0.1px]">Chapters</span>
            </TabsTrigger>
            <TabsTrigger
              value="transcripts"
              className={`data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white/70 px-0 py-2 text-white/70 hover:text-white flex items-center justify-center h-full`}
            >
              <FileText className="h-[18px] w-[18px] mr-2.5" />
              <span className="text-[14px] font-medium tracking-[-0.1px]">Transcripts</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="chapters" value={activeTab} className="w-full h-full">
          <TabsContent value="chapters" className="h-full p-0 m-0">
            {isRecording ? (
              <div className="p-4 space-y-4">
                <div className="text-white/60">Recording in progress...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <ClipboardList className="h-12 w-12 mb-4 text-white/30" />
                <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Chapters Yet</p>
                <p className="text-[13px] text-white/60 text-center">Start recording to view chapters</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="transcripts" className="h-full p-0 m-0">
            {isRecording ? (
              <div className="p-4 space-y-4">
                <div className="text-white/60">Transcribing in progress...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <FileText className="h-12 w-12 mb-4 text-white/30" />
                <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Transcripts Yet</p>
                <p className="text-[13px] text-white/60 text-center">Start recording to view transcripts</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};

export default LeftSidebar;
