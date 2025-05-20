
import React, { useState, useEffect } from "react";
import RecordingHeader from "@/components/RecordingHeader";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import MicrophoneSelector from "@/components/MicrophoneSelector";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import RecordingControls from "@/components/RecordingControls";

const RecordingRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setTime(0);
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground dark">
      <RecordingHeader />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={25} maxSize={60}>
            <div className="flex flex-col h-full">
              <MicrophoneSelector />
              <RecordingControls 
                isRecording={isRecording} 
                time={time} 
                toggleRecording={toggleRecording} 
              />
              <LeftSidebar isRecording={isRecording} />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={40}>
            <RightSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default RecordingRoom;
