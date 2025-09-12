import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ListTodo, AlignLeft, ClipboardList, FileText, Loader2, ChevronDown, Expand, Minimize2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextShimmer } from '@/components/ui/text-shimmer';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { ContentViewer } from '@/components/content/ContentViewer';
import { DocumentViewer } from '@/components/content/DocumentViewer/DocumentViewer';
import { WaveformAudioPlayer } from '@/components/content/WaveformAudioPlayer';
import { ContentData } from '@/pages/ContentPage';
import { RecordingStateInfo, RecordingMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRealtimeTranscription } from '@/hooks/useRealtimeTranscription';
import RealtimeTranscriptionDisplay from './RealtimeTranscriptionDisplay';
import RealtimeChaptersDisplay from './RealtimeChaptersDisplay';
import { AudioChunker, getOptimalAudioStream } from '@/utils/audioChunking';
import { useContent } from '@/hooks/useContent';
import { RefreshCw } from 'lucide-react';
import { WebsiteContentTabs } from './website/WebsiteContentTabs';
import { EnhancedWebsiteProcessing } from './website/EnhancedWebsiteProcessing';
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
  onSeekToTimestamp?: (timestamp: number) => void;
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
  currentTimestamp,
  onSeekToTimestamp
}: ContentLeftSidebarProps) {
  const [activeTab, setActiveTab] = useState("chapters");
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use content hook for triggering processing
  const {
    triggerProcessing,
    retryProcessing
  } = useContent();

  // Real-time transcription integration for live recording and recordings with transcription data
  const shouldUseTranscription = contentData.type === 'live_recording' || contentData.type === 'recording' && (recordingStateInfo?.hasTranscript || recordingStateInfo?.hasChapters);
  const {
    isConnected,
    transcriptionChunks,
    fullTranscript,
    chapters: liveChapters,
    transcriptionProgress,
    transcriptionStatus,
    averageConfidence,
    isProcessingAudio,
    isProcessingFinal,
    isLoadingData,
    queueAudioChunk,
    finalizeTranscription,
    requestChapters,
    disconnect
  } = useRealtimeTranscription(shouldUseTranscription ? contentData.id : undefined);

  // Audio chunker for real-time transcription
  const audioChunkerRef = useRef<AudioChunker | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Initialize audio chunking when recording starts
  useEffect(() => {
    if (contentData.type === 'live_recording' && isRecording && !isPaused && !audioChunkerRef.current) {
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
      setIsProcessing(false); // Reset UI processing state since transcription hook will handle it
      audioChunkerRef.current.stopChunking();

      // Finalize transcription with remaining audio
      if (audioStreamRef.current) {
        audioChunkerRef.current.getFinalAudio(audioStreamRef.current).then(finalAudio => {
          finalizeTranscription(finalAudio);
        }).catch(error => {
          console.error('Error finalizing transcription:', error);
        });
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

    // Live recording interface - show recording controls with conditional microphone selector
    if (contentData.type === 'live_recording') {
      // State 1: Before recording or ready to record
      if (!isRecording && (transcriptionStatus === 'pending' || transcriptionStatus === 'ready')) {
        const handlePause = () => setIsPaused(!isPaused);
        const handleStop = async () => {
          setIsPaused(false);
          toggleRecording();
        };
        return <>
            <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[8px]">
              <RecordingControls isRecording={isRecording} isPaused={isPaused} isProcessing={isProcessing} toggleRecording={toggleRecording} onPause={handlePause} onStop={handleStop} recordingTime={recordingTime} />
            </div>
            <div className="pb-4 shrink-0 bg-background px-[5px] py-[6px]">
              <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
                <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
              </div>
            </div>
          </>;
      }

      // State 2: Currently recording or processing
      if (isRecording || isProcessingFinal || transcriptionStatus === 'processing') {
        const handlePause = () => setIsPaused(!isPaused);
        const handleStop = async () => {
          setIsPaused(false);
          toggleRecording();
        };
        return <>
            <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
              <RecordingControls isRecording={isRecording} isPaused={isPaused} isProcessing={isProcessing || isProcessingFinal} toggleRecording={toggleRecording} onPause={handlePause} onStop={handleStop} recordingTime={recordingTime} />
            </div>
          </>;
      }

      // State 3: Recording completed - Show Audio Player (when completed OR has substantial data)
      if (!isRecording && (transcriptionStatus === 'completed' || transcriptionChunks.length > 0 && liveChapters.length > 0 && fullTranscript.length > 100)) {
        // Create audio URL from recording data or content data  
        const audioUrl = contentData.url || '/placeholder-audio.mp3'; // Fallback for testing
        const recordingDuration = transcriptionChunks.length > 0 ? Math.max(...transcriptionChunks.map(chunk => chunk.timestamp + (chunk.duration || 1))) : 120;
        console.log('Showing audio player for completed recording:', {
          audioUrl,
          recordingDuration,
          transcriptionStatus,
          chunksCount: transcriptionChunks.length,
          chaptersCount: liveChapters.length
        });
        const audioMetadata = {
          audioUrl,
          duration: recordingDuration,
          title: contentData.title || 'Live Recording',
          transcript: fullTranscript
        };
        return <div className="p-4 shrink-0 bg-background">
            <WaveformAudioPlayer metadata={audioMetadata} onTimeUpdate={time => {
            console.log('Audio playback time:', time);
          }} currentTimestamp={currentTimestamp} />
          </div>;
      }

      // Fallback to recording controls if no audio available yet
      return <>
          <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
            <div className="text-center text-muted-foreground">
              Recording completed but audio not yet available
            </div>
          </div>
        </>;
    }

    // New recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isNewRecording) {
      const handlePause = () => setIsPaused(!isPaused);
      const handleStop = async () => {
        setIsPaused(false);
        setIsProcessing(true);
        try {
          // Stop the recording and wait for processing
          toggleRecording();

          // Simulate processing time (you can integrate with actual processing logic)
          setTimeout(() => {
            setIsProcessing(false);
          }, 3000); // Adjust timing based on your actual processing needs
        } catch (error) {
          console.error('Error processing recording:', error);
          setIsProcessing(false);
        }
      };
      return <>
          <div className="p-4 pb-2 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <RecordingControls isRecording={isRecording} isPaused={isPaused} isProcessing={isProcessing} toggleRecording={toggleRecording} onPause={handlePause} onStop={handleStop} recordingTime={recordingTime} />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
            <div className="text-xs text-dashboard-text-secondary/70 dark:text-dashboard-text-secondary/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>;
    }

    // Existing recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isExistingRecording && recordingMetadata && recordingMetadata.audioUrl) {
      return <div className="p-4 shrink-0 bg-dashboard-card dark:bg-dashboard-card">
          <WaveformAudioPlayer metadata={{
          audioUrl: recordingMetadata.audioUrl,
          duration: recordingMetadata.duration,
          title: contentData.title,
          transcript: recordingMetadata.transcript
        }} onTimeUpdate={time => {
          // Update current playback time for chapter navigation
          console.log('Current time:', time);
        }} currentTimestamp={currentTimestamp} />
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
      <ContentViewer contentData={contentData} onUpdateContent={onUpdateContent} onTextAction={onTextAction} currentTimestamp={currentTimestamp} onExpandText={() => setIsTextExpanded(true)} onSeekToTimestamp={onSeekToTimestamp} />
      </div>;
  };
  const renderTabContent = () => {
    // Check if we have real-time transcription data available
    const hasRealtimeData = shouldUseTranscription && (transcriptionChunks.length > 0 || fullTranscript.length > 0 || liveChapters.length > 0 || isLoadingData || transcriptionStatus === 'processing' || transcriptionStatus === 'completed');
    const hasContent = contentData.type === 'live_recording' ? isRecording || hasRealtimeData : recordingStateInfo?.isNewRecording ? isRecording : recordingStateInfo?.isExistingRecording ? true : hasRealtimeData || !!contentData.url || !!contentData.text;
    console.log('ContentLeftSidebar - hasContent check:', {
      contentType: contentData.type,
      isRecording,
      hasRealtimeData,
      transcriptionChunks: transcriptionChunks.length,
      fullTranscript: fullTranscript.length,
      liveChapters: liveChapters.length,
      transcriptionStatus,
      shouldUseTranscription,
      hasContent
    });
    return <>
        <TabsContent value="chapters" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-6 space-y-8">
                {/* Real-time chapters for live recording and recordings with transcription */}
                 {(contentData.type === 'live_recording' || contentData.type === 'recording' && shouldUseTranscription) && <RealtimeChaptersDisplay chapters={liveChapters} transcriptionStatus={transcriptionStatus} isRecording={isRecording && contentData.type === 'live_recording'} isProcessingFinal={isProcessingFinal} onRequestChapters={requestChapters} onChapterClick={handleChapterClick} onSeekToTimestamp={onSeekToTimestamp} isLoadingData={isLoadingData || false} />}
                
                {/* Audio/Video file chapters */}
                {(contentData.type === 'audio_file' || contentData.type === 'video') && <RealtimeChaptersDisplay chapters={contentData.chapters ? contentData.chapters.map((chapter: any) => ({
              title: chapter.title,
              summary: chapter.summary || '',
              startTime: chapter.startTime,
              endTime: chapter.endTime || chapter.startTime + 60
            })) : []} transcriptionStatus={contentData.text_content ? 'completed' : 'pending'} processingStatus={contentData.processing_status as 'pending' | 'processing' | 'completed' | 'failed'} contentType={contentData.type} onChapterClick={handleChapterClick} onSeekToTimestamp={onSeekToTimestamp} onRetryProcessing={() => contentData.id && retryProcessing(contentData.id)} />}

                {/* YouTube chapters */}
                {contentData.type === 'youtube' && <RealtimeChaptersDisplay chapters={contentData.chapters ? contentData.chapters.map((chapter: any) => ({
              title: chapter.title,
              summary: chapter.summary || '',
              startTime: chapter.startTime,
              endTime: chapter.endTime || chapter.startTime + 60
            })) : []} transcriptionStatus={contentData.text_content ? 'completed' : 'pending'} processingStatus={contentData.processing_status as 'pending' | 'processing' | 'completed' | 'failed'} contentType={contentData.type} onChapterClick={handleChapterClick} onSeekToTimestamp={onSeekToTimestamp} onRetryProcessing={() => contentData.id && retryProcessing(contentData.id)} />}
                
                {contentData.type === 'recording' && recordingStateInfo?.isNewRecording && isRecording && <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-pulse mb-2">
                        <div className="h-3 w-3 bg-primary rounded-full mx-auto mb-1"></div>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Recording in progress
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Chapters will be generated automatically
                      </p>
                    </div>
                  </div>}
                {recordingStateInfo?.isExistingRecording && recordingMetadata?.chaptersData && <div className="space-y-8">
                    {recordingMetadata.chaptersData.map((chapter, index) => <div key={chapter.id} className="group cursor-pointer" onClick={() => handleChapterClick(chapter.startTime)}>
                        {/* Timestamp */}
                        <div className="text-xs text-muted-foreground mb-2 font-mono">
                          {Math.floor(chapter.startTime / 60).toString().padStart(2, '0')}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                          {chapter.title}
                        </h3>
                        
                        {/* Summary if available */}
                        {chapter.summary && <p className="text-sm text-muted-foreground leading-relaxed">
                            {chapter.summary}
                          </p>}
                      </div>)}
                  </div>}
                {contentData.type === 'youtube' && contentData.metadata?.chapters && Array.isArray(contentData.metadata.chapters) && contentData.metadata.chapters.length > 0 && <div className="space-y-8">
                    {contentData.metadata.chapters.map((chapter: any, index: number) => <div key={index} className="group cursor-pointer" onClick={() => handleChapterClick(chapter.startTime)}>
                        {/* Timestamp */}
                        <div className="text-xs text-muted-foreground mb-2 font-mono">
                          {Math.floor(chapter.startTime / 60).toString().padStart(2, '0')}:{(chapter.startTime % 60).toString().padStart(2, '0')}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                          {chapter.title}
                        </h3>
                        
                        {/* Summary if available */}
                        {chapter.summary && <p className="text-sm text-muted-foreground leading-relaxed">
                            {chapter.summary}
                          </p>}
                      </div>)}
                  </div>}
                {contentData.type === 'website' && contentData.text && <div className="prose prose-sm max-w-none text-foreground">
                    <div className="bg-card p-4 rounded-lg border border-border relative">
                      <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(!isTextExpanded)} className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted">
                        {isTextExpanded ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                      </Button>
                      <div>
                        <p className="text-xs text-muted-foreground mb-3 pr-10">
                          Website Content Summary
                        </p>
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pr-10 line-clamp-6">
                          {contentData.text}
                        </p>
                      </div>
                    </div>
                  </div>}
                  
                {/* Empty state for audio/video files without chapters */}
                {(contentData.type === 'audio_file' || contentData.type === 'video') && (!contentData.chapters || contentData.chapters.length === 0) && contentData.processing_status !== 'processing' && contentData.processing_status !== 'failed' && <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Chapters will be generated automatically when processing completes
                      </p>
                    </div>
                  </div>}
                
                {contentData.type !== 'recording' && contentData.type !== 'live_recording' && contentData.type !== 'youtube' && contentData.type !== 'website' && contentData.type !== 'audio_file' && contentData.type !== 'video' && <div className="text-muted-foreground">
                    Processing content...
                  </div>}
              </div> :
          // Show shimmer loading for live recording in processing state
          contentData.type === 'live_recording' && isProcessingFinal ? <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => <div key={i} className="animate-pulse">
                          <div className="h-3 bg-muted rounded w-16 mb-2"></div>
                          <div className="h-5 bg-muted rounded w-3/4 mb-3"></div>
                          <div className="h-4 bg-muted rounded w-full mb-1"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </div>)}
                    </div>
                  </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                    <p className="text-muted-foreground text-center text-sm">
                      {contentData.type === 'recording' || contentData.type === 'live_recording' ? 'Start recording to view chapters' : 'Add content to view chapters'}
                    </p>
                  </div>}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="transcripts" className="absolute inset-0">
          <ScrollArea className="h-full">
            {hasContent ? <div className="p-6 space-y-8">
                {/* Real-time transcription for live recording and recordings with transcription */}
                 {(contentData.type === 'live_recording' || contentData.type === 'recording' && shouldUseTranscription) && <RealtimeTranscriptionDisplay transcriptionChunks={transcriptionChunks} fullTranscript={fullTranscript} transcriptionProgress={transcriptionProgress} transcriptionStatus={transcriptionStatus} averageConfidence={averageConfidence} isProcessingAudio={isProcessingAudio} isProcessingFinal={isProcessingFinal} isRecording={isRecording && !isPaused && contentData.type === 'live_recording'} isLoadingData={isLoadingData || false} />}
                
                {/* Audio/Video file transcripts */}
                {(contentData.type === 'audio_file' || contentData.type === 'video') && (contentData.processing_status === 'processing' ? <div className="space-y-6">
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="animate-pulse mb-2">
                            <div className="h-3 w-3 bg-primary rounded-full mx-auto mb-1"></div>
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">
                            Processing audio/video
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generating transcript automatically...
                          </p>
                        </div>
                      </div>
                      {/* Shimmer loading placeholders */}
                      {[1, 2, 3, 4].map(i => <div key={i} className="space-y-3">
                          <div className="h-3 w-16 bg-muted animate-pulse rounded font-mono"></div>
                          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-4/5 bg-muted animate-pulse rounded"></div>
                          <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                        </div>)}
                    </div> : contentData.text_content ? <div className="space-y-8">
                      {/* Parse and display transcript in segments like chapters */}
                      {contentData.text_content.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, index) => <div key={index} className="group cursor-pointer hover:bg-muted/20 rounded-lg p-3 transition-colors">
                          {/* Timestamp placeholder - could be enhanced with actual timestamps if available */}
                          <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
                            {Math.floor(index * 30 / 60)}:{(index * 30 % 60).toString().padStart(2, '0')}
                          </div>
                          
                          {/* Transcript text */}
                          <div className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
                            <p className="leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          </div>
                        </div>)}
                    </div> : contentData.processing_status === 'failed' ? <div className="text-center py-8">
                      <p className="text-sm text-destructive mb-2">Processing failed</p>
                      <p className="text-xs text-muted-foreground">{contentData.text_content || 'Unable to process audio/video file'}</p>
                    </div> : !contentData.text_content && contentData.processing_status !== 'processing' && contentData.processing_status !== 'failed' ? <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground text-center">
                        Transcript will be generated automatically when processing completes
                      </p>
                    </div> : null)}

                {/* YouTube transcripts */}
                {contentData.type === 'youtube' && (contentData.processing_status === 'processing' ? <div className="flex items-center justify-center h-full py-16">
                      <TextShimmer className="text-base font-semibold" duration={1.5}>
                        Processing YouTube video...
                      </TextShimmer>
                    </div> : contentData.text_content ? <div className="space-y-8">
                      {/* Parse and display transcript in segments */}
                      {contentData.text_content.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, index) => <div key={index} className="group cursor-pointer hover:bg-muted/20 rounded-lg p-3 transition-colors">
                          {/* Timestamp placeholder */}
                          <div className="inline-flex items-center px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground font-mono mb-2">
                            {Math.floor(index * 30 / 60)}:{(index * 30 % 60).toString().padStart(2, '0')}
                          </div>
                          
                          {/* Transcript text */}
                          <div className="text-sm text-foreground leading-relaxed group-hover:text-primary transition-colors">
                            <p className="leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          </div>
                        </div>)}
                    </div> : contentData.processing_status === 'failed' ? <div className="text-center py-8">
                      <p className="text-sm text-destructive mb-2">Processing failed</p>
                      <p className="text-xs text-muted-foreground">Unable to process YouTube video</p>
                    </div> : <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground text-center">
                        Transcript will be generated automatically when processing completes
                      </p>
                    </div>)}
                
                {contentData.type === 'recording' && recordingStateInfo?.isNewRecording && isRecording && <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-pulse mb-2">
                        <div className="h-3 w-3 bg-primary rounded-full mx-auto mb-1"></div>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Recording in progress
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Transcription will be generated automatically
                      </p>
                    </div>
                  </div>}
                {recordingStateInfo?.isExistingRecording && <div className="space-y-8">
                    <div className="text-xs text-muted-foreground mb-2 font-mono">
                      00:00
                    </div>
                    <div className="space-y-6">
                      <p className="text-sm text-foreground leading-relaxed">
                        Full transcript available. The transcript would be searchable and time-synced with the audio playback for precise navigation and reference.
                      </p>
                    </div>
                  </div>}
                
              </div> :
          // Show shimmer loading for live recording in processing state
          contentData.type === 'live_recording' && isProcessingFinal ? <div className="p-6 space-y-6">
                    <div className="space-y-6">
                      {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse">
                          <div className="h-3 bg-muted rounded w-16 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-full mb-1"></div>
                          <div className="h-4 bg-muted rounded w-4/5 mb-1"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>)}
                    </div>
                  </div> : <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                    <p className="text-muted-foreground text-center text-sm">
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

  // Website content gets special treatment with enhanced tabs
  if (contentData.type === 'website' || contentData.url && contentData.url.startsWith('http')) {
    return <div className="h-full flex flex-col min-h-0 bg-dashboard-bg dark:bg-dashboard-bg relative">
        {/* Full-page text content overlay */}
        {isTextExpanded && contentData.text && <div className="absolute inset-0 z-50 bg-background flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{contentData.title || 'Website Content'}</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsTextExpanded(false)} className="h-8 w-8 p-0">
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <pre className="whitespace-pre-wrap font-sans text-foreground">{contentData.text}</pre>
              </div>
            </ScrollArea>
          </div>}

        {renderControls()}
        
        {/* Enhanced website processing indicator */}
        {(contentData.type === 'website' || contentData.url && contentData.url.startsWith('http')) && contentData.processing_status === 'processing' && <EnhancedWebsiteProcessing url={contentData.url || ''} processingStatus={contentData.processing_status} />}
        
        <WebsiteContentTabs contentData={contentData} onTextExpand={() => setIsTextExpanded(true)} isProcessing={contentData.processing_status === 'processing'} />
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
      {isTextExpanded && (contentData.type === 'text' || contentData.url?.startsWith('http')) && contentData.text && <div className="absolute inset-0 z-50 bg-background flex flex-col">
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
      
      {/* Processing indicators */}
      {contentData.type === 'youtube' && contentData.processing_status === 'processing' && <div className="mx-4 mt-2 p-4 flex items-center justify-center">
          <TextShimmer className="text-base font-semibold" duration={1.5}>
            Processing YouTube video...
          </TextShimmer>
        </div>}
      
      {contentData.url?.startsWith('http') && contentData.processing_status === 'processing' && <EnhancedWebsiteProcessing url={contentData.url || ''} processingStatus={contentData.processing_status} />}
      
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