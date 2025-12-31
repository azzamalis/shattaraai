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
  text_content?: string;
  chapters?: Array<{
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    summary?: string;
  }>;
  metadata?: Record<string, any>;
  isProcessing?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  processing_status?: string;
  transcription_confidence?: number;
  ai_summary?: string;
  summary_key_points?: string[];
  summary_generated_at?: string;
}
export default function ContentPage() {
  const {
    contentId
  } = useParams<{
    contentId: string;
  }>();
  const [searchParams] = useSearchParams();
  const {
    fetchContentById
  } = useContentContext();
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
  const [currentTimestamp, setCurrentTimestamp] = useState<number | undefined>();

  // Fetch content from database
  useEffect(() => {
    const fetchContent = async () => {
      console.log('ContentPage: Starting content fetch for contentId:', contentId);
      if (!contentId) {
        console.error('ContentPage: No content ID provided');
        setError('No content ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        console.log('ContentPage: Fetching content from database...');
        const fetchedContent = await fetchContentById(contentId);
        console.log('ContentPage: Fetched content:', fetchedContent);
        if (!fetchedContent) {
          console.log('ContentPage: Content not found in database, checking URL parameters');
          // If content not found in database, fall back to URL parameters for new content
          const type = searchParams.get('type') as ContentType || 'recording';
          const url = searchParams.get('url');
          const filename = searchParams.get('filename');
          const text = searchParams.get('text');
          console.log('ContentPage: Creating fallback content data:', {
            type,
            url,
            filename,
            text
          });
          setContentData({
            id: contentId || 'new',
            type,
            title: getDefaultTitle(type, filename, recordingStateInfo?.isExistingRecording),
            url,
            filename,
            text,
            isProcessing: false,
            hasError: false
          });
        } else {
          // Use fetched content from database
          console.log('ContentPage: Using fetched content from database');
          setContentData({
            id: fetchedContent.id,
            type: fetchedContent.type as ContentType,
            title: fetchedContent.title,
            url: fetchedContent.url,
            filename: fetchedContent.filename,
            text: fetchedContent.text_content,
            text_content: fetchedContent.text_content,
            chapters: fetchedContent.chapters,
            metadata: fetchedContent.metadata,
            processing_status: fetchedContent.processing_status,
            transcription_confidence: fetchedContent.transcription_confidence,
            isProcessing: false,
            hasError: false
          });
        }
      } catch (err) {
        console.error('ContentPage: Error fetching content:', err);
        setError(`Failed to load content: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [contentId, fetchContentById, searchParams, recordingStateInfo?.isExistingRecording]);
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
      setContentData(prev => prev ? {
        ...prev,
        isProcessing: false
      } : null);
    } else if (contentData.type !== 'live_recording' && (contentData.url || contentData.text)) {
      setContentData(prev => prev ? {
        ...prev,
        isProcessing: true
      } : null);
      const timer = setTimeout(() => {
        setContentData(prev => prev ? {
          ...prev,
          isProcessing: false
        } : null);
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
    setContentData(prev => prev ? {
      ...prev,
      ...updates
    } : null);
  };

  // New function to handle text actions from PDF viewer
  const handleTextAction = (action: 'explain' | 'search' | 'summarize', text: string) => {
    // This would typically trigger a chat message in the ContentRightSidebar
    console.log(`PDF Text Action: ${action} for text: "${text}"`);
    // You could emit an event, use a context, or pass this to the chat component
    // For now, we'll just log it - integration with chat would be the next step
  };

  // Handle chapter click to jump to timestamp
  const handleChapterClick = (timestamp: number) => {
    setCurrentTimestamp(timestamp);
  };

  // Handle seek to timestamp functionality for video player
  const handleSeekToTimestamp = (timestamp: number) => {
    setCurrentTimestamp(timestamp);
  };

  // Loading state
  if (loading) {
    return <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading content...</span>
          </div>
        </div>
      </DashboardLayout>;
  }

  // Error state
  if (error) {
    return <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium">Error loading content</p>
            <p className="text-sm text-center max-w-md">{error}</p>
            <p className="text-xs text-center max-w-md text-muted-foreground/60 mt-2">Content ID: {contentId}</p>
          </div>
        </div>
      </DashboardLayout>;
  }

  // No content state
  if (!contentData) {
    return <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-12 w-12" />
            <p className="text-lg font-medium">Content not found</p>
            <p className="text-sm text-center max-w-md">The requested content could not be found.</p>
            <p className="text-xs text-center max-w-md text-muted-foreground/60 mt-2">Content ID: {contentId}</p>
          </div>
        </div>
      </DashboardLayout>;
  }
  console.log('ContentPage: Rendering with content data:', contentData);
  return <DashboardLayout className="content-page-layout p-0" contentData={contentData} onUpdateContent={updateContentData}>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-background transition-colors duration-300 overflow-hidden">
        <div className="flex-1 px-4 py-[10px] md:px-[16px] overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full gap-4 overflow-hidden">
            <ResizablePanel defaultSize={50} minSize={25} maxSize={60} className="bg-card rounded-lg">
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
              onChapterClick={handleChapterClick} 
              currentTimestamp={currentTimestamp} 
              onSeekToTimestamp={handleSeekToTimestamp} 
            />
            </ResizablePanel>
            
            <ResizableHandle withHandle className="w-0.5 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="w-1 h-10 bg-border rounded-full transition-colors duration-200" />
            </ResizableHandle>
            
            <ResizablePanel defaultSize={50} minSize={40} className="bg-card rounded-lg">
              <ContentRightSidebar contentData={contentData} initialTab={searchParams.get('tab') || undefined} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </DashboardLayout>;
}
function getDefaultTitle(type: ContentType, filename?: string | null, isExistingRecording?: boolean): string {
  const now = new Date();
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
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