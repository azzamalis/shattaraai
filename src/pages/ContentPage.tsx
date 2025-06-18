
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentLeftSidebar } from '@/components/content/ContentLeftSidebar';
import { ContentRightSidebar } from '@/components/content/ContentRightSidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ContentType } from '@/lib/types';
import { useRecordingState } from '@/hooks/useRecordingState';
import { useContentContext } from '@/contexts/ContentContext';
import { Loader2, AlertTriangle } from 'lucide-react';

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
  const { fetchContentById } = useContentContext();
  
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use recording state detection hook
  const { 
    state: recordingStateInfo, 
    metadata: recordingMetadata, 
    mockChapters,
    getRecordingState,
    analyzeRecording
  } = useRecordingState();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedMicrophone, setSelectedMicrophone] = useState("Default - Microphone Array (Intel® Smart Sound Technology for Digital Microphones)");

  // Fetch content from database
  useEffect(() => {
    const fetchContent = async () => {
      if (!id) {
        setError('No content ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const fetchedContent = await fetchContentById(id);
        
        if (!fetchedContent) {
          // If content not found in database, fall back to URL parameters for new content
          const type = searchParams.get('type') as ContentType || 'recording';
          const url = searchParams.get('url');
          const filename = searchParams.get('filename');
          const text = searchParams.get('text');
          
          setContentData({
            id: id || 'new',
            type,
            title: getDefaultTitle(type, filename, recordingStateInfo?.isExistingRecording),
            url,
            filename,
            text,
            isProcessing: false,
            hasError: false,
          });
        } else {
          // Use fetched content from database
          setContentData({
            id: fetchedContent.id,
            type: fetchedContent.type as ContentType,
            title: fetchedContent.title,
            url: fetchedContent.url,
            filename: fetchedContent.filename,
            text: fetchedContent.text_content,
            metadata: fetchedContent.metadata,
            isProcessing: false,
            hasError: false,
          });
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, fetchContentById, searchParams, recordingStateInfo?.isExistingRecording]);

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

  // Simulate content processing for non-recording types or modify for existing recordings
  useEffect(() => {
    if (!contentData) return;

    if (recordingStateInfo?.isExistingRecording || contentData.type === 'audio_file') {
      // For existing recordings or uploaded audio files, set processing to false immediately
      setContentData(prev => prev ? { ...prev, isProcessing: false } : null);
    } else if (contentData.type !== 'live_recording' && (contentData.url || contentData.text)) {
      setContentData(prev => prev ? { ...prev, isProcessing: true } : null);
      
      const timer = setTimeout(() => {
        setContentData(prev => prev ? { ...prev, isProcessing: false } : null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [contentData?.type, contentData?.url, contentData?.text, recordingStateInfo?.isExistingRecording]);

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
    setContentData(prev => prev ? { ...prev, ...updates } : null);
  };

  // New function to handle text actions from PDF viewer
  const handleTextAction = (action: 'explain' | 'search' | 'summarize', text: string) => {
    // This would typically trigger a chat message in the ContentRightSidebar
    console.log(`PDF Text Action: ${action} for text: "${text}"`);
    // You could emit an event, use a context, or pass this to the chat component
    // For now, we'll just log it - integration with chat would be the next step
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading content...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium">Error loading content</p>
            <p className="text-sm text-center max-w-md">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No content state
  if (!contentData) {
    return (
      <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-12 w-12" />
            <p className="text-lg font-medium">Content not found</p>
            <p className="text-sm text-center max-w-md">The requested content could not be found.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
