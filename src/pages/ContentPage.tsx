
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentLeftSidebar } from '@/components/content/ContentLeftSidebar';
import { ContentRightSidebar } from '@/components/content/ContentRightSidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ContentType } from '@/lib/types';
import { useRecordingState } from '@/hooks/useRecordingState';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/integrations/supabase/client';

export interface ContentData {
  id: string;
  type: ContentType;
  title: string;
  url?: string;
  filePath?: string;
  filename?: string;
  text?: string;
  metadata?: Record<string, any>;
  storage_path?: string;
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
  
  const { content } = useContent();
  
  // Use recording state detection hook
  const { 
    state: recordingStateInfo, 
    metadata: recordingMetadata, 
    mockChapters,
    getRecordingState,
    analyzeRecording
  } = useRecordingState();

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

  // Generate public URL from storage path
  const generatePublicURL = (storagePath: string): string => {
    console.log('ContentPage - Generating public URL for storage path:', storagePath);
    const { data: { publicUrl } } = supabase.storage
      .from('pdf-files')
      .getPublicUrl(storagePath);
    console.log('ContentPage - Generated public URL:', publicUrl);
    return publicUrl;
  };

  // Primary effect: Load content data from database
  useEffect(() => {
    console.log('ContentPage - Loading content data, id:', id, 'content length:', content.length);
    
    if (!id) {
      // No ID means this is a new content creation from URL params
      console.log('ContentPage - No ID, using URL params for new content');
      return;
    }

    if (content.length === 0) {
      // Content not loaded yet, wait
      console.log('ContentPage - Content not loaded yet, waiting...');
      return;
    }

    const existingContent = content.find(item => item.id === id);
    console.log('ContentPage - Found existing content:', existingContent);
    
    if (!existingContent) {
      console.log('ContentPage - No content found for ID:', id);
      return;
    }

    // We have existing content from database - use it
    let contentUrl = existingContent.url;
    
    // For PDF content with storage_path, generate public URL if URL is missing
    if (existingContent.type === 'pdf' && existingContent.storage_path && !existingContent.url) {
      contentUrl = generatePublicURL(existingContent.storage_path);
      console.log('ContentPage - Generated URL for PDF from storage_path:', contentUrl);
    }
    
    const updatedContentData = {
      id: existingContent.id,
      title: existingContent.title,
      type: existingContent.type as ContentType,
      url: contentUrl,
      filename: existingContent.filename,
      text: existingContent.text_content,
      storage_path: existingContent.storage_path,
      metadata: existingContent.metadata,
      isProcessing: false,
      hasError: false,
    };
    
    console.log('ContentPage - Setting content data from database:', updatedContentData);
    setContentData(updatedContentData);
  }, [id, content]);

  // Secondary effect: Handle URL params only for new content (no ID)
  useEffect(() => {
    if (id && content.length > 0) {
      // We have an ID and content is loaded - ignore URL params
      return;
    }

    if (!id) {
      // No ID - this is new content creation from URL params
      console.log('ContentPage - Setting up new content from URL params');
      setContentData(prev => ({
        ...prev,
        type,
        title: getDefaultTitle(type, filename, recordingStateInfo?.isExistingRecording),
        url,
        filename,
        text,
      }));
    }
  }, [type, url, filename, text, recordingStateInfo?.isExistingRecording, id, content.length]);

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

  // Processing simulation effect
  useEffect(() => {
    if (recordingStateInfo?.isExistingRecording || type === 'audio_file') {
      // For existing recordings or uploaded audio files, set processing to false immediately
      setContentData(prev => ({ ...prev, isProcessing: false }));
    } else if (type !== 'live_recording' && (contentData.url || contentData.filePath || contentData.text)) {
      setContentData(prev => ({ ...prev, isProcessing: true }));
      
      const timer = setTimeout(() => {
        setContentData(prev => ({ ...prev, isProcessing: false }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [type, contentData.url, contentData.filePath, contentData.text, recordingStateInfo?.isExistingRecording]);

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
                isRecordingLoading={false}
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
    case 'live_recording':
      return `Live Recording at ${time}`;
    case 'audio_file':
      return filename ? filename : `Audio File at ${time}`;
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
