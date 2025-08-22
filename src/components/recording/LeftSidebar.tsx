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
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePause = () => setIsPaused(!isPaused);
  const handleStop = async () => {
    setIsPaused(false);
    setIsProcessing(true);
    
    try {
      // Stop the recording and wait for processing
      toggleRecording();
      
      // Simulate processing time (you can integrate with actual processing logic)
      setTimeout(() => {
        setIsProcessing(false);
      }, 3000); // Adjust timing based on your actual processing needs
    } catch (error) {
      console.error('Error processing recording:', error);
      setIsProcessing(false);
    }
  };

  return <div className="h-full flex flex-col min-h-0 bg-black">
      {/* Microphone Selector row */}
      <div className="p-4 pb-2 shrink-0 bg-[#222222]">
        <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
      </div>
      {/* Recording Controls row */}
      <div className="px-4 pb-4 shrink-0 bg-[#222222]">
        <RecordingControls 
          isRecording={isRecording} 
          isPaused={isPaused}
          isProcessing={isProcessing}
          toggleRecording={toggleRecording} 
          onPause={handlePause}
          onStop={handleStop}
          recordingTime={recordingTime} 
        />
      </div>
      
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
          <TabsContent value="chapters" className="absolute inset-0">
            <ScrollArea className="h-full">
              {isRecording ? <div className="p-4 space-y-4">
                  {/* Placeholder for dynamic chapter content */}
                  <div className="text-white/60">Recording in progress...</div>
                </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                  <ClipboardList className="h-12 w-12 mb-4 text-white/30" />
                  <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Chapters Yet</p>
                  <p className="text-[13px] text-white/60 text-center">Start recording to view chapters</p>
                </div>}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="transcripts" className="absolute inset-0">
            <ScrollArea className="h-full">
              {isRecording ? <div className="p-4 space-y-4">
                  {/* Placeholder for dynamic transcript content */}
                  <div className="text-white/60">Transcribing in progress...</div>
                </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                  <FileText className="h-12 w-12 mb-4 text-white/30" />
                  <p className="text-[14px] font-medium text-white mb-1.5 text-center">No Transcripts Yet</p>
                  <p className="text-[13px] text-white/60 text-center">Start recording to view transcripts</p>
                </div>}
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>;
}