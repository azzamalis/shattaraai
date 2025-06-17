
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ContentLeftSidebar } from '@/components/content/ContentLeftSidebar';
import { ContentRightSidebar } from '@/components/content/ContentRightSidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ContentType } from '@/lib/types';
import { useRecordingState } from '@/hooks/useRecordingState';
import { useContentContext } from '@/contexts/ContentContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

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

// Helper function to infer content type based on filename and existing type
const inferContentType = (type: ContentType, filename?: string): ContentType => {
  if (filename?.toLowerCase().endsWith('.pdf')) {
    console.log('ContentPage - Inferred type as PDF based on filename:', filename);
    return 'pdf';
  }
  if (filename?.toLowerCase().match(/\.(mp4|mov|avi|wmv|flv|webm)$/)) {
    console.log('ContentPage - Inferred type as video based on filename:', filename);
    return 'video';
  }
  if (filename?.toLowerCase().match(/\.(mp3|wav|ogg|m4a|aac)$/)) {
    console.log('ContentPage - Inferred type as audio_file based on filename:', filename);
    return 'audio_file';
  }
  console.log('ContentPage - Using original type:', type, 'for filename:', filename);
  return type;
};

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as ContentType || 'recording';
  const url = searchParams.get('url');
  const filename = searchParams.get('filename');
  const text = searchParams.get('text');
  
  const { content, loading: contentLoading, authLoading, updateContent: contextUpdateContent } = useContentContext();
  
  // Use recording state detection hook
  const { 
    state: recordingStateInfo, 
    metadata: recordingMetadata, 
    mockChapters,
    getRecordingState,
    analyzeRecording
  } = useRecordingState();

  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Primary effect: Load content data from database or URL params
  useEffect(() => {
    console.log('ContentPage - Loading content data, id:', id, 'authLoading:', authLoading, 'contentLoading:', contentLoading, 'content length:', content.length);
    
    // Wait for authentication to complete before processing
    if (authLoading) {
      console.log('ContentPage - Auth still loading, waiting...');
      return;
    }

    if (!id) {
      // No ID means this is a new content creation from URL params
      console.log('ContentPage - No ID, using URL params for new content');
      const inferredType = inferContentType(type, filename || undefined);
      setContentData({
        id: 'new',
        type: inferredType,
        title: getDefaultTitle(inferredType, filename, recordingStateInfo?.isExistingRecording),
        url,
        filename,
        text,
        isProcessing: false,
        hasError: false,
      });
      setIsLoading(false);
      return;
    }

    if (contentLoading) {
      // Content is still being loaded, wait
      console.log('ContentPage - Content still loading, waiting...');
      return;
    }

    const existingContent = content.find(item => item.id === id);
    console.log('ContentPage - Found existing content:', !!existingContent);
    
    if (!existingContent) {
      console.log('ContentPage - No content found for ID:', id);
      setContentData({
        id: id,
        type: 'upload', // Default fallback type
        title: 'Content Not Found',
        isProcessing: false,
        hasError: true,
        errorMessage: 'Content not found or you do not have permission to access it'
      });
      setIsLoading(false);
      return;
    }

    // Infer the correct content type based on filename and existing type
    const inferredType = inferContentType(existingContent.type as ContentType, existingContent.filename);
    console.log('ContentPage - Original type:', existingContent.type, 'Inferred type:', inferredType, 'Filename:', existingContent.filename);

    // We have existing content from database - use it
    let contentUrl = existingContent.url;
    
    // For PDF content with storage_path, generate public URL if URL is missing
    if (inferredType === 'pdf' && existingContent.storage_path && !existingContent.url) {
      contentUrl = generatePublicURL(existingContent.storage_path);
      console.log('ContentPage - Generated URL for PDF from storage_path:', contentUrl);
    }
    
    const updatedContentData = {
      id: existingContent.id,
      title: existingContent.title,
      type: inferredType, // Use the inferred type instead of database type
      url: contentUrl,
      filename: existingContent.filename,
      text: existingContent.text_content,
      storage_path: existingContent.storage_path,
      metadata: existingContent.metadata,
      isProcessing: false,
      hasError: false,
    };
    
    console.log('ContentPage - Setting content data from database with inferred type:', updatedContentData);
    setContentData(updatedContentData);
    setIsLoading(false);
  }, [id, content, contentLoading, authLoading, type, url, filename, text, recordingStateInfo?.isExistingRecording]);

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
    if (!contentData) return;
    
    if (recordingStateInfo?.isExistingRecording || contentData.type === 'audio_file') {
      // For existing recordings or uploaded audio files, set processing to false immediately
      setContentData(prev => prev ? { ...prev, isProcessing: false } : null);
    } else if (contentData.type !== 'live_recording' && (contentData.url || contentData.filePath || contentData.text)) {
      setContentData(prev => prev ? { ...prev, isProcessing: true } : null);
      
      const timer = setTimeout(() => {
        setContentData(prev => prev ? { ...prev, isProcessing: false } : null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [contentData?.type, contentData?.url, contentData?.filePath, contentData?.text, recordingStateInfo?.isExistingRecording]);

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

  const updateContentData = async (updates: Partial<ContentData>) => {
    console.log('ContentPage - Updating content data with:', updates);
    
    // Update local state immediately for UI responsiveness
    setContentData(prev => prev ? { ...prev, ...updates } : null);
    
    // If we have a valid content ID (not 'new'), update the database
    if (contentData && contentData.id !== 'new') {
      try {
        // Use the context's updateContent function to ensure database persistence
        await contextUpdateContent(contentData.id, updates);
        console.log('ContentPage - Successfully updated content in database');
      } catch (error) {
        console.error('ContentPage - Failed to update content in database:', error);
        // Revert local state on error
        setContentData(prev => prev ? { ...prev, ...Object.fromEntries(Object.keys(updates).map(key => [key, prev[key as keyof ContentData]])) } : null);
      }
    }
  };

  // New function to handle text actions from PDF viewer
  const handleTextAction = (action: 'explain' | 'search' | 'summarize', text: string) => {
    // This would typically trigger a chat message in the ContentRightSidebar
    console.log(`PDF Text Action: ${action} for text: "${text}"`);
    // You could emit an event, use a context, or pass this to the chat component
    // For now, we'll just log it - integration with chat would be the next step
  };

  // Show loading state while auth or content is being loaded
  if (authLoading || isLoading || contentLoading) {
    return (
      <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-background">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>
              {authLoading ? 'Authenticating...' : 
               contentLoading ? 'Loading content...' : 
               'Loading...'}
            </span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if content data is null or has error
  if (!contentData || contentData.hasError) {
    return (
      <DashboardLayout className="content-page-layout p-0">
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-background">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-lg font-medium">Content Not Found</span>
            <span className="text-sm">{contentData?.errorMessage || 'The requested content could not be loaded.'}</span>
            <div className="text-xs text-muted-foreground/60 mt-2">
              <p>Debug info:</p>
              <p>ID: {id}</p>
              <p>Content loaded: {content.length} items</p>
              <p>Auth loading: {authLoading.toString()}</p>
              <p>Content loading: {contentLoading.toString()}</p>
            </div>
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
