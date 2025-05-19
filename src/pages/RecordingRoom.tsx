import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { RecordingHeader } from '@/components/recording/RecordingHeader';
import { LeftSidebar } from '@/components/recording/LeftSidebar';
import RightSidebar from "@/components/recording/RightSidebar";
import { formatTime } from '@/lib/formatTime';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Mic, FileText, Brain, BookOpen, Settings, MessageSquare } from 'lucide-react';
import '@/styles/waveform.css';

export default function RecordingRoom() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");
  const [commandOpen, setCommandOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  }));
  
  // Update current time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      }));
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
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
  
  const clearMicrophone = () => {
    setSelectedMicrophone("");
  };
  
  const RecordingContent = () => (
    <div className="flex flex-col h-full min-h-0 bg-black">
      <RecordingHeader 
        currentTime={currentTime} 
        isRecording={isRecording}
        onOpenCommandMenu={() => setCommandOpen(true)}
        toggleRecording={toggleRecording}
        recordingTime={formatTime(recordingTime)}
        selectedMicrophone={selectedMicrophone}
        onMicrophoneSelect={handleMicrophoneChange}
        onMicrophoneClear={clearMicrophone}
      />
      
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
        >
          {/* Left panel - Recording area */}
          <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="h-full">
            <LeftSidebar
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              recordingTime={formatTime(recordingTime)}
              selectedMicrophone={selectedMicrophone}
              onMicrophoneSelect={handleMicrophoneChange}
              onMicrophoneClear={clearMicrophone}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-white/10" />
          
          {/* Right panel - AI Features */}
          <ResizablePanel defaultSize={60} minSize={40} className="h-full">
            <RightSidebar />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    
      {/* Command Menu Dialog */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandGroup heading="Recording">
            <CommandItem 
              onSelect={() => {
                toggleRecording();
                setCommandOpen(false);
              }}
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </CommandItem>
            {recordingTime > 0 && (
              <CommandItem 
                onSelect={() => {
                  resetRecording();
                  setCommandOpen(false);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Reset Recording
              </CommandItem>
            )}
          </CommandGroup>
          
          <CommandGroup heading="AI Tools">
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI
            </CommandItem>
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <BookOpen className="mr-2 h-4 w-4" />
              Generate Summary
            </CommandItem>
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <Brain className="mr-2 h-4 w-4" />
              Create Flashcards
            </CommandItem>
          </CommandGroup>
          
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => setCommandOpen(false)}>
              <Settings className="mr-2 h-4 w-4" />
              Recording Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
  
  return (
    <DashboardLayout>
      <RecordingContent />
    </DashboardLayout>
  );
}
