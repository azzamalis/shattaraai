
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { RecordingHeader } from '@/components/recording/RecordingHeader';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { LeftSidebar } from '@/components/recording/LeftSidebar';
import { RightSidebar } from '@/components/recording/RightSidebar';
import { formatTime } from '@/lib/formatTime';
import '@/styles/waveform.css';

export default function RecordingRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");
  
  // Timer effect for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
    } else {
      // Stop recording
      setIsRecording(false);
    }
  };
  
  const resetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };
  
  const handleMicrophoneChange = (value: string) => {
    setSelectedMicrophone(value);
  };
  
  // Format the current time for display in the header
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-black">
        <RecordingHeader 
          currentTime={currentTime} 
          isRecording={isRecording}
        />
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
          >
            {/* Left panel - Recording area */}
            <ResizablePanel defaultSize={50} minSize={25} maxSize={60}>
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-white/10">
                  <MicrophoneSelector 
                    selected={selectedMicrophone}
                    onSelect={handleMicrophoneChange}
                  />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                  <RecordingControls 
                    isRecording={isRecording}
                    toggleRecording={toggleRecording}
                    recordingTime={formatTime(recordingTime)}
                  />
                  
                  {!isRecording && recordingTime === 0 && (
                    <div className="mt-8 text-white/60 text-center">
                      <p>Start recording to view chapters</p>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-white/10">
                  <LeftSidebar />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle className="bg-white/10" />
            
            {/* Right panel - AI Features */}
            <ResizablePanel defaultSize={50} minSize={40}>
              <RightSidebar />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DashboardLayout>
  );
}
