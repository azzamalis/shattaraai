import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ListTodo, AlignLeft, ClipboardList, FileText, Loader2, ChevronDown, Expand, Minimize2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentViewer } from '@/components/content/ContentViewer';
import { DocumentViewer } from '@/components/content/DocumentViewer/DocumentViewer';
import { AudioPlayer } from '@/components/content/AudioPlayer';
import { ContentData } from '@/pages/ContentPage';
import { RecordingStateInfo, RecordingMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRealtimeTranscription } from '@/hooks/useRealtimeTranscription';
import RealtimeTranscriptionDisplay from './RealtimeTranscriptionDisplay';
import RealtimeChaptersDisplay from './RealtimeChaptersDisplay';
import { AudioChunker, getOptimalAudioStream } from '@/utils/audioChunking';
interface ContentLeftSidebarProps {
  contentData: ContentData;
  onUpdateContent: (updates: Partial<ContentData>) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  recordingTime: string;
  selectedMicrophone: string;
  onMicrophoneSelect: (value: string) => void;
  onMicrophoneClear?: () => void;
  recordingStateInfo?: RecordingStateInfo;
  recordingMetadata?: RecordingMetadata | null;
  isRecordingLoading?: boolean;
  onTextAction?: (action: 'explain' | 'search' | 'summarize', text: string) => void;
  onChapterClick?: (timestamp: number) => void;
  currentTimestamp?: number;
}
export function ContentLeftSidebar({
  contentData,
  onUpdateContent,
  isRecording,
  toggleRecording,
  recordingTime,
  selectedMicrophone,
  onMicrophoneSelect,
  onMicrophoneClear,
  recordingStateInfo,
  recordingMetadata,
  isRecordingLoading,
  onTextAction,
  onChapterClick,
  currentTimestamp
}: ContentLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  // Real-time transcription integration for live recording
  const {
    isConnected,
    transcriptionChunks,
    fullTranscript,
    chapters: liveChapters,
    transcriptionProgress,
    transcriptionStatus,
    averageConfidence,
    isProcessingAudio,
    queueAudioChunk,
    finalizeTranscription,
    requestChapters,
    disconnect
  } = useRealtimeTranscription(contentData.type === 'live_recording' ? contentData.id : undefined);

  // Audio chunker for real-time transcription
  const audioChunkerRef = useRef<AudioChunker | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Initialize audio chunking when recording starts
  useEffect(() => {
    if (contentData.type === 'live_recording' && isRecording && !audioChunkerRef.current) {
      const initializeAudioChunking = async () => {
        try {
          const stream = await getOptimalAudioStream();
          audioStreamRef.current = stream;

          const chunker = new AudioChunker(queueAudioChunk, 4000); // 4 second chunks
          audioChunkerRef.current = chunker;
          
          await chunker.startChunking(stream);
          console.log('Real-time audio chunking started');
        } catch (error) {
          console.error('Failed to initialize audio chunking:', error);
        }
      };

      initializeAudioChunking();
    } else if (!isRecording && audioChunkerRef.current) {
      // Stop chunking when recording stops
      audioChunkerRef.current.stopChunking();
      
      // Finalize transcription with remaining audio
      if (audioStreamRef.current) {
        audioChunkerRef.current.getFinalAudio(audioStreamRef.current).then(finalAudio => {
          finalizeTranscription(finalAudio);
        }).catch(console.error);
      }

      // Cleanup
      audioStreamRef.current?.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
      audioChunkerRef.current = null;
    }
  }, [isRecording, contentData.type, queueAudioChunk, finalizeTranscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioChunkerRef.current) {
        audioChunkerRef.current.stopChunking();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach(track => track.stop());
      }
      disconnect();
    };
  }, [disconnect]);
  const handleChapterClick = (timestamp: number) => {
    if (onChapterClick) {
      onChapterClick(timestamp);
    }
  };

  // Check if we should hide tabs (for PDF content or Word documents)
  const shouldHideTabs = contentData.type === 'pdf';

  // Check if it's a Word document
  const isWordDocument = (contentData.type === 'file' || contentData.type === 'upload') && contentData.filename?.match(/\.(doc|docx)$/i);
  const shouldHideTabsForDocument = isWordDocument;
  const renderControls = () => {
    // Show loading state while detecting recording state
    if (contentData.type === 'recording' && isRecordingLoading) {
      return <div className="p-4 flex items-center justify-center bg-dashboard-card dark:bg-dashboard-card">
          <div className="flex items-center gap-2 text-dashboard-text-secondary dark:text-dashboard-text-secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recording...</span>
          </div>
        </div>;
    }

    // Live recording interface - show recording controls with microphone selector below
    if (contentData.type === 'live_recording') {
      return <>
          <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
            <RecordingControls isRecording={isRecording} toggleRecording={toggleRecording} recordingTime={recordingTime} />
          </div>
          <div className="pb-4 shrink-0 bg-background px-[5px] py-[6px]">
            <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>;
    }

    // New recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isNewRecording) {
      return <>
          <div className="p-4 pb-2 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <RecordingControls isRecording={isRecording} toggleRecording={toggleRecording} recordingTime={recordingTime} />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>;
    }

    // Existing recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isExistingRecording && recordingMetadata) {
      return <div className="p-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
          <AudioPlayer metadata={recordingMetadata} onTimeUpdate={time => {
          // Update current playback time for chapter navigation
          console.log('Current time:', time);
        }} />
        </div>;
    }

    // Default content viewer for other types (excluding website)
    if (contentData.type === 'website') {
      return null; // Website content is handled in tabs
    }

    // Show DocumentViewer for Word documents
    if (isWordDocument) {
      return null; // Document viewer will be rendered in the main layout
    }
    return <div className={cn("p-4 shrink-0 bg-background", shouldHideTabs && "flex-1")}>
        <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} onTextAction={onTextAction} currentTimestamp={currentTimestamp} onExpandText={() => setIsTextExpanded(true)} />
      </div>;
  };
  const renderTabContent = () => {
    const hasContent = contentData.type === 'live_recording' ? isRecording : recordingStateInfo?.isNewRecording ? isRecording : recordingStateInfo?.isExistingRecording ? true : !!contentData.url || !!contentData.text;
    return <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {/* Real-time chapters for live recording */}
                {contentData.type === 'live_recording' && (
                  <RealtimeChaptersDisplay
                    chapters={liveChapters}
                    transcriptionStatus={transcriptionStatus}
                    isRecording={isRecording}
                    onRequestChapters={requestChapters}
                    onChapterClick={handleChapterClick}
                  />
                )}
                
                {(contentData.type === 'recording' && recordingStateInfo?.isNewRecording && isRecording) && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-pulse mb-2">
                        <div className="h-3 w-3 bg-primary rounded-full mx-auto mb-1"></div>
                      </div>
                      <p className="text-sm font-medium text-dashboard-text dark:text-dashboard-text mb-1">
                        Recording in progress
                      </p>
                      <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                        Chapters will be generated automatically
                      </p>
                    </div>
                  </div>
                )}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && <div className="grid grid-cols-2 gap-3">
                    {recordingMetadata.chaptersData.map((chapter, index) => <Button key={chapter.id} variant="ghost" className="p-3 h-auto rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleChapterClick(chapter.startTime)}>
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm">
                              {chapter.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-primary dark:text-primary whitespace-nowrap font-medium">
                              {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </Button>)}
                  </div>}
                {contentData.type === 'youtube' && contentData.metadata?.chapters && Array.isArray(contentData.metadata.chapters) && contentData.metadata.chapters.length > 0 && <div className="grid grid-cols-2 gap-3">
                    {contentData.metadata.chapters.map((chapter: any, index: number) => <Button key={index} variant="ghost" className="p-3 h-auto rounded-lg bg-dashboard-bg dark:bg-dashboard-bg border border-dashboard-separator/20 dark:border-white/10 hover:bg-dashboard-separator/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleChapterClick(chapter.startTime)}>
                        <div className="flex items-start justify-between gap-2 w-full">
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-medium text-dashboard-text dark:text-dashboard-text truncate text-sm">
                              {chapter.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-primary dark:text-primary whitespace-nowrap font-medium">
                              {Math.floor(chapter.startTime / 60)}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>
                      </Button>)}
                  </div>}
                {contentData.type === 'website' && contentData.text && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10 relative">
                      <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(!isTextExpanded)} className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-dashboard-separator/20">
                        {isTextExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                      <div>
                        <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 pr-10">
                          Website Content Summary
                        </p>
                        <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed pr-10 line-clamp-6">
                          {contentData.text}
                        </p>
                      </div>
                    </div>
                  </div>}
                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && contentData.type !== 'website' && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Processing content...
                  </div>}
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-sm">
                  {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view chapters' : 'Add content to view chapters'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-4 space-y-4">
                {/* Real-time transcription for live recording */}
                {contentData.type === 'live_recording' && (
                  <RealtimeTranscriptionDisplay
                    transcriptionChunks={transcriptionChunks}
                    fullTranscript={fullTranscript}
                    transcriptionProgress={transcriptionProgress}
                    transcriptionStatus={transcriptionStatus}
                    averageConfidence={averageConfidence}
                    isProcessingAudio={isProcessingAudio}
                    isRecording={isRecording}
                  />
                )}
                
                {(contentData.type === 'recording' && recordingStateInfo?.isNewRecording && isRecording) && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-pulse mb-2">
                        <div className="h-3 w-3 bg-primary rounded-full mx-auto mb-1"></div>
                      </div>
                      <p className="text-sm font-medium text-dashboard-text dark:text-dashboard-text mb-1">
                        Recording in progress
                      </p>
                      <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                        Transcription will be generated automatically
                      </p>
                    </div>
                  </div>
                )}
                {recordingStateInfo?.isExistingRecording && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-4">
                      Full transcript available
                    </p>
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10">
                      <p>This is where the full transcript would appear. The transcript would be searchable and time-synced with the audio playback.</p>
                    </div>
                  </div>}
                {contentData.type === 'youtube' && contentData.text && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10 relative">
                      <Button variant="ghost" size="sm" onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)} className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-dashboard-separator/20">
                        {isTranscriptExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                      {contentData.metadata?.hasRealTranscript ? <div>
                          <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 pr-10">
                            Video Transcript (Auto-generated)
                          </p>
                          <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed pr-10">
                            {contentData.text}
                          </p>
                        </div> : <div>
                          <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 pr-10">
                            Video Description (No transcript available)
                          </p>
                          <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed pr-10">
                            {contentData.text}
                          </p>
                        </div>}
                    </div>
                  </div>}
                {contentData.type === 'website' && contentData.text && <div className="prose prose-sm max-w-none text-dashboard-text dark:text-dashboard-text">
                    <div className="bg-dashboard-bg dark:bg-dashboard-bg p-4 rounded-lg border border-dashboard-separator/20 dark:border-white/10 relative">
                      <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(!isTextExpanded)} className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-dashboard-separator/20">
                        {isTextExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                      <div>
                        <p className="text-xs text-dashboard-text-secondary dark:text-dashboard-text-secondary mb-3 pr-10">
                          Website Full Text Content
                        </p>
                        <p className="text-sm text-dashboard-text dark:text-dashboard-text whitespace-pre-wrap leading-relaxed pr-10">
                          {contentData.text}
                        </p>
                      </div>
                    </div>
                  </div>}
                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && contentData.type !== 'website' && <div className="text-dashboard-text-secondary dark:text-dashboard-text-secondary">
                    Extracting text...
                  </div>}
              </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                
                <p className="text-dashboard-text-secondary dark:text-dashboard-text-secondary text-center text-sm">
                  {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view transcripts' : 'Add content to view transcripts'}
                </p>
              </div>}
          </ScrollArea>
        </TabsContent>
      </>;
  };

  // If it's PDF content, render without tabs
  if (shouldHideTabs) {
    return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg">
        {renderControls()}
      </div>;
  }

  // If it's a Word document, render the DocumentViewer without tabs
  if (shouldHideTabsForDocument) {
    return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg">
        <DocumentViewer contentData={contentData} onUpdateContent={onUpdateContent} />
      </div>;
  }

  // Default layout with tabs for other content types
  return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg relative">
      {/* Full-page transcript overlay */}
      {isTranscriptExpanded && contentData.type === 'youtube' && contentData.text && <div className="absolute inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Full Transcript</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsTranscriptExpanded(false)} className="h-8 w-8 p-0">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {contentData.metadata?.hasRealTranscript ? <div>
                  <p className="text-xs text-muted-foreground mb-4">Video Transcript (Auto-generated)</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {contentData.text}
                  </p>
                </div> : <div>
                  <p className="text-xs text-muted-foreground mb-4">Video Description (No transcript available)</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {contentData.text}
                  </p>
                </div>}
            </div>
          </ScrollArea>
        </div>}
      
      {/* Full-page text content overlay */}
      {isTextExpanded && (contentData.type === 'text' || contentData.type === 'website') && contentData.text && <div className="absolute inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{contentData.title || 'Text Content'}</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(false)} className="h-8 w-8 p-0">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              {contentData.text ? <pre className="whitespace-pre-wrap font-sans text-foreground">{contentData.text}</pre> : <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5" />
                    <span className="font-medium text-foreground">Website Content</span>
                  </div>
                  <a href={contentData.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {contentData.url}
                  </a>
                </div>}
            </div>
          </ScrollArea>
        </div>}

      {renderControls()}
      
      {/* Processing indicator for YouTube content */}
      {contentData.type === 'youtube' && (!contentData.metadata?.chapters || !contentData.text) && (
        <div className="mx-4 mt-2 p-3 bg-primary/5 border-l-4 border-primary rounded-r-lg">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Processing YouTube video...</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Extracting chapters and transcript from video
          </p>
        </div>
      )}
      
      <Tabs defaultValue="chapters" onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden bg-background ">
        <TabsList className={cn("w-fit justify-start gap-1 p-1 h-12 shrink-0 mx-4 my-2", "bg-card dark:bg-card", "transition-colors duration-200", "rounded-xl")}>
          <TabsTrigger value="chapters" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none", "px-6")}>
            <ListTodo className="h-[14px] w-[14px]" />
            <span>Chapters</span>
          </TabsTrigger>
          <TabsTrigger value="transcripts" className={cn("flex-1 h-full rounded-md flex items-center justify-center gap-2", "text-sm font-medium", "text-muted-foreground", "hover:text-foreground", "data-[state=active]:text-primary", "data-[state=active]:bg-primary/10", "data-[state=active]:hover:bg-primary/20", "transition-colors duration-200", "focus-visible:ring-0 focus-visible:ring-offset-0", "focus:ring-0 focus:ring-offset-0", "ring-0 ring-offset-0", "border-0 outline-none", "data-[state=active]:ring-0", "data-[state=active]:ring-offset-0", "data-[state=active]:border-0", "data-[state=active]:outline-none", "px-6")}>
            <AlignLeft className="h-[14px] w-[14px]" />
            <span>Transcripts</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 relative overflow-hidden">
          {renderTabContent()}
        </div>
      </Tabs>
    </div>;
}