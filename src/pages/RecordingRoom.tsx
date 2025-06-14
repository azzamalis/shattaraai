import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecordingHeader } from "@/components/recording/RecordingHeader";
import { LeftSidebar } from "@/components/recording/LeftSidebar";
import RightSidebar from "@/components/recording/RightSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const RecordingRoom = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");
  const dummyRooms = [
    { id: '1', name: 'Physics Lab', user_id: '', created_at: '', updated_at: '' },
    { id: '2', name: 'Math Studies', user_id: '', created_at: '', updated_at: '' }
  ];

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
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
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  const handleMicrophoneSelect = (value: string) => {
    setSelectedMicrophone(value);
  };
  
  const handleMicrophoneClear = () => {
    setSelectedMicrophone("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");
  };
  
  const recordingContent = (
    <div className="flex flex-col h-screen bg-black text-white dark">
      <RecordingHeader 
        currentTime={currentTime} 
        isRecording={isRecording} 
        toggleRecording={toggleRecording} 
        recordingTime={formatTime(time)} 
        selectedMicrophone={selectedMicrophone} 
        onMicrophoneSelect={handleMicrophoneSelect} 
        onMicrophoneClear={handleMicrophoneClear} 
        rooms={dummyRooms} 
      />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={25} maxSize={60}>
            <LeftSidebar 
              isRecording={isRecording} 
              toggleRecording={toggleRecording} 
              recordingTime={formatTime(time)} 
              selectedMicrophone={selectedMicrophone} 
              onMicrophoneSelect={handleMicrophoneSelect} 
              onMicrophoneClear={handleMicrophoneClear} 
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-zinc-700" />
          
          <ResizablePanel defaultSize={50} minSize={40}>
            <RightSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
  
  return (
    <DashboardLayout className="p-0">
      {recordingContent}
    </DashboardLayout>
  );
};

export default RecordingRoom;
