import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { RecordingControls } from '@/components/recording/RecordingControls';
import { MicrophoneSelector } from '@/components/recording/MicrophoneSelector';
import { WaveformAudioPlayer } from '@/components/content/WaveformAudioPlayer';
import { ContentData } from '@/pages/ContentPage';
import { RecordingStateInfo, RecordingMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRealtimeTranscription } from '@/hooks/useRealtimeTranscription';
import { AudioChunker, getOptimalAudioStream } from '@/utils/audioChunking';

// Import specialized sidebar components
import { WebsiteLeftSidebar } from './WebsiteLeftSidebar';
import { MediaLeftSidebar } from './MediaLeftSidebar';
import { DocumentLeftSidebar } from './DocumentLeftSidebar';

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
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Real-time transcription integration for live recording and recordings with transcription data
  const shouldUseTranscription = contentData.type === 'live_recording' || 
    (contentData.type === 'recording' && (recordingStateInfo?.hasTranscript || recordingStateInfo?.hasChapters));
  
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

  const renderControls = () => {
    // Show loading state while detecting recording state
    if (contentData.type === 'recording' && isRecordingLoading) {
      return (
        <div className="p-4 flex items-center justify-center bg-card">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading recording...</span>
          </div>
        </div>
      );
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
        
        return (
          <>
            <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
              <RecordingControls 
                isRecording={isRecording} 
                isPaused={isPaused}
                isProcessing={isProcessing}
                toggleRecording={toggleRecording}
                onPause={handlePause}
                onStop={handleStop}
                recordingTime={recordingTime} 
              />
            </div>
            <div className="pb-4 shrink-0 bg-background px-[5px] py-[6px]">
              <div className="text-xs text-muted-foreground/70">
                <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
              </div>
            </div>
          </>
        );
      }
      
      // State 2: Currently recording or processing
      if (isRecording || isProcessingFinal || transcriptionStatus === 'processing') {
        const handlePause = () => setIsPaused(!isPaused);
        const handleStop = async () => {
          setIsPaused(false);
          toggleRecording();
        };
        
        return (
          <>
            <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
              <RecordingControls 
                isRecording={isRecording} 
                isPaused={isPaused}
                isProcessing={isProcessing || isProcessingFinal}
                toggleRecording={toggleRecording}
                onPause={handlePause}
                onStop={handleStop}
                recordingTime={recordingTime} 
              />
            </div>
          </>
        );
      }
      
      // State 3: Recording completed - Show Audio Player (when completed OR has substantial data)
      if (!isRecording && (transcriptionStatus === 'completed' || 
           (transcriptionChunks.length > 0 && liveChapters.length > 0 && fullTranscript.length > 100))) {
        // Create audio URL from recording data or content data  
        const audioUrl = contentData.url || '/placeholder-audio.mp3'; // Fallback for testing
        const recordingDuration = transcriptionChunks.length > 0 ? 
          Math.max(...transcriptionChunks.map(chunk => chunk.timestamp + (chunk.duration || 1))) : 120;
        
        const audioMetadata = {
          audioUrl,
          duration: recordingDuration,
          title: contentData.title || 'Live Recording',
          transcript: fullTranscript
        };
        
        return (
          <div className="p-4 shrink-0 bg-background">
            <WaveformAudioPlayer 
              metadata={audioMetadata} 
              onTimeUpdate={time => {
                console.log('Audio playback time:', time);
              }}
              currentTimestamp={currentTimestamp}
            />
          </div>
        );
      }
      
      // Fallback to recording controls if no audio available yet
      return (
        <>
          <div className="p-4 pb-2 shrink-0 bg-background px-0 py-[14px]">
            <div className="text-center text-muted-foreground">
              Recording completed but audio not yet available
            </div>
          </div>
        </>
      );
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
      
      return (
        <>
          <div className="p-4 pb-2 shrink-0 bg-card">
            <RecordingControls 
              isRecording={isRecording} 
              isPaused={isPaused}
              isProcessing={isProcessing}
              toggleRecording={toggleRecording} 
              onPause={handlePause}
              onStop={handleStop}
              recordingTime={recordingTime} 
            />
          </div>
          <div className="px-4 pb-4 shrink-0 bg-card">
            <div className="text-xs text-muted-foreground/70">
              <MicrophoneSelector selected={selectedMicrophone} onSelect={onMicrophoneSelect} onClear={onMicrophoneClear} />
            </div>
          </div>
        </>
      );
    }

    // Existing recording interface
    if (contentData.type === 'recording' && recordingStateInfo?.isExistingRecording && recordingMetadata && recordingMetadata.audioUrl) {
      return (
        <div className="p-4 shrink-0 bg-card">
          <WaveformAudioPlayer 
            metadata={{
              audioUrl: recordingMetadata.audioUrl,
              duration: recordingMetadata.duration,
              title: contentData.title,
              transcript: recordingMetadata.transcript
            }} 
            onTimeUpdate={time => {
              console.log('Current time:', time);
            }}
            currentTimestamp={currentTimestamp} 
          />
        </div>
      );
    }

    return null;
  };

  // Route to appropriate specialized component based on content type
  const renderContentSpecificSidebar = () => {
    // Website content
    if (contentData.type === 'website') {
      return (
        <WebsiteLeftSidebar
          contentData={contentData}
          onUpdateContent={onUpdateContent}
          onTextAction={onTextAction}
        />
      );
    }

    // Media content (audio, video, YouTube)
    if (['youtube', 'video', 'audio_file', 'live_recording', 'recording'].includes(contentData.type)) {
      return (
        <MediaLeftSidebar
          contentData={contentData}
          onUpdateContent={onUpdateContent}
          onTextAction={onTextAction}
          onChapterClick={onChapterClick}
          currentTimestamp={currentTimestamp}
          onSeekToTimestamp={onSeekToTimestamp}
          isRecording={isRecording}
          transcriptionChunks={transcriptionChunks}
          fullTranscript={fullTranscript}
          liveChapters={liveChapters}
          transcriptionStatus={transcriptionStatus}
          isProcessingFinal={isProcessingFinal}
          isLoadingData={isLoadingData}
          requestChapters={requestChapters}
        />
      );
    }

    // Document content (PDF, DOCX, text, upload)
    if (['pdf', 'docx', 'text', 'upload', 'file'].includes(contentData.type)) {
      return (
        <DocumentLeftSidebar
          contentData={contentData}
          onUpdateContent={onUpdateContent}
          onTextAction={onTextAction}
          currentTimestamp={currentTimestamp}
          onSeekToTimestamp={onSeekToTimestamp}
        />
      );
    }

    // Fallback for unknown content types
    return (
      <DocumentLeftSidebar
        contentData={contentData}
        onUpdateContent={onUpdateContent}
        onTextAction={onTextAction}
        currentTimestamp={currentTimestamp}
        onSeekToTimestamp={onSeekToTimestamp}
      />
    );
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Render controls for recording-related content */}
      {(contentData.type === 'live_recording' || contentData.type === 'recording') && renderControls()}
      
      {/* Render content-specific sidebar */}
      <div className="flex-1 min-h-0">
        {renderContentSpecificSidebar()}
      </div>
    </div>
  );
}
