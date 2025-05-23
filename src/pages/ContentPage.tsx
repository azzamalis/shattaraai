
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentLeftSidebar } from '@/components/content/ContentLeftSidebar';
import { ContentRightSidebar } from '@/components/content/ContentRightSidebar';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export type ContentType = 'recording' | 'pdf' | 'video' | 'youtube';

export interface ContentData {
  id: string;
  type: ContentType;
  title: string;
  url?: string;
  filePath?: string;
  metadata?: Record<string, any>;
}

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as ContentType || 'recording';
  
  const [contentData, setContentData] = useState<ContentData>({
    id: id || 'new',
    type,
    title: getDefaultTitle(type),
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");

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
      setRecordingTime(0);
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

  const updateContentData = (updates: Partial<ContentData>) => {
    setContentData(prev => ({ ...prev, ...updates }));
  };

  return (
    <DashboardLayout className="p-0">
      <div className="flex flex-col h-screen bg-black text-white dark">
        <ContentHeader 
          contentData={contentData}
          onUpdateContent={updateContentData}
          isRecording={isRecording}
          recordingTime={formatTime(recordingTime)}
        />
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={25} maxSize={60}>
              <ContentLeftSidebar 
                contentData={contentData}
                onUpdateContent={updateContentData}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                recordingTime={formatTime(recordingTime)}
                selectedMicrophone={selectedMicrophone}
                onMicrophoneSelect={handleMicrophoneSelect}
                onMicrophoneClear={handleMicrophoneClear}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle className="bg-zinc-700" />
            
            <ResizablePanel defaultSize={50} minSize={40}>
              <ContentRightSidebar contentData={contentData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getDefaultTitle(type: ContentType): string {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  switch (type) {
    case 'recording':
      return `Recording at ${time}`;
    case 'pdf':
      return `Document at ${time}`;
    case 'video':
      return `Video at ${time}`;
    case 'youtube':
      return `YouTube Video at ${time}`;
    default:
      return `Content at ${time}`;
  }
}
