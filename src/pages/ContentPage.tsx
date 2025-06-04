import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentLeftSidebar } from '@/components/content/ContentLeftSidebar';
import { ContentRightSidebar } from '@/components/content/ContentRightSidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ContentType } from '@/lib/types';
import { useRecordingState } from '@/hooks/useRecordingState';

export interface ContentData {
  id: string;
  type: ContentType;
  title: string;
  url?: string;
  filePath?: string;
  filename?: string;
  text?: string;
  metadata?: Record<string, any>;
  isProcessing?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as ContentType || 'recording';
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');
  const text = searchParams.get('text');
  
  // Use recording state detection hook
  const { 
    recordingStateInfo, 
    recordingMetadata, 
    isLoading: isRecordingLoading 
  } = useRecordingState({
    contentId: id || 'new',
    contentType: type
  });

  const [contentData, setContentData] = useState<ContentData>({
    id: id || 'new',
    type,
    title: getDefaultTitle(type, filename, recordingStateInfo?.isExistingRecording),
    url,
    filename,
    text,
    isProcessing: false,
    hasError: false,
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

  useEffect(() => {
    // Update content data when URL parameters change or recording state is detected
    setContentData(prev => ({
      ...prev,
      type,
      title: getDefaultTitle(type, filename, recordingStateInfo?.isExistingRecording),
      url,
      filename,
      text,
    }));
  }, [type, url, filename, text, recordingStateInfo?.isExistingRecording]);

  // Simulate content processing for non-recording types or modify for existing recordings
  useEffect(() => {
    if (recordingStateInfo?.isExistingRecording && !isRecordingLoading) {
      // For existing recordings, set processing to false immediately
      setContentData(prev => ({ ...prev, isProcessing: false }));
    } else if (contentData.type !== 'recording' && (contentData.url || contentData.filePath || contentData.text)) {
      setContentData(prev => ({ ...prev, isProcessing: true }));
      
      const timer = setTimeout(() => {
        setContentData(prev => ({ ...prev, isProcessing: false }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [contentData.type, contentData.url, contentData.filePath, contentData.text, recordingStateInfo?.isExistingRecording, isRecordingLoading]);

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

  // New function to handle text actions from PDF viewer
  const handleTextAction = (action: 'explain' | 'search' | 'summarize', text: string) => {
    // This would typically trigger a chat message in the ContentRightSidebar
    console.log(`PDF Text Action: ${action} for text: "${text}"`);
    // You could emit an event, use a context, or pass this to the chat component
    // For now, we'll just log it - integration with chat would be the next step
  };

  return (
    <DashboardLayout 
      className="content-page-layout p-0"
      contentData={contentData}
      onUpdateContent={updateContentData}
    >
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background transition-colors duration-300">
        <div className="h-full px-4 md:px-6 py-4">
          <ResizablePanelGroup 
            direction="horizontal"
            className="h-full gap-4"
          >
            <ResizablePanel 
              defaultSize={50} 
              minSize={25} 
              maxSize={60}
              className="bg-card rounded-lg border border-border"
            >
              <ContentLeftSidebar 
                contentData={contentData}
                onUpdateContent={updateContentData}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                recordingTime={formatTime(recordingTime)}
                selectedMicrophone={selectedMicrophone}
                onMicrophoneSelect={handleMicrophoneSelect}
                onMicrophoneClear={handleMicrophoneClear}
                recordingStateInfo={recordingStateInfo}
                recordingMetadata={recordingMetadata}
                isRecordingLoading={isRecordingLoading}
                onTextAction={handleTextAction}
              />
            </ResizablePanel>
            
            <ResizableHandle 
              withHandle 
              className="w-1"
            >
              <div className="w-1 h-10 bg-border rounded-full transition-colors duration-200" />
            </ResizableHandle>
            
            <ResizablePanel 
              defaultSize={50} 
              minSize={40}
              className="bg-card rounded-lg border border-border"
            >
              <ContentRightSidebar contentData={contentData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DashboardLayout>
  );
}

function getDefaultTitle(type: ContentType, filename?: string | null, isExistingRecording?: boolean): string {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  switch (type) {
    case 'recording':
      if (isExistingRecording) {
        return filename ? filename : 'Existing Recording';
      }
      return `Recording at ${time}`;
    case 'upload':
    case 'pdf':
      return filename ? filename : `Document at ${time}`;
    case 'video':
      return filename ? filename : `Video at ${time}`;
    case 'youtube':
      return `YouTube Video at ${time}`;
    case 'website':
      return `Website Content at ${time}`;
    case 'text':
      return `Text Content at ${time}`;
    default:
      return `Content at ${time}`;
  }
}
