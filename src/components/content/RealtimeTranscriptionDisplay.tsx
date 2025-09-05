import React from 'react';
import { WordLevelTranscriptionDisplay } from './WordLevelTranscriptionDisplay';
import { TranscriptionChunk, ContentType } from '@/lib/types';

interface RealtimeTranscriptionDisplayProps {
  transcriptionChunks: TranscriptionChunk[];
  fullTranscript: string;
  transcriptionProgress: number;
  transcriptionStatus: 'ready' | 'pending' | 'processing' | 'completed' | 'failed';
  averageConfidence: number;
  isProcessingAudio: boolean;
  isProcessingFinal?: boolean;
  isRecording?: boolean;
  isLoadingData?: boolean;
  contentType?: ContentType;
  onSeekToTimestamp?: (timestamp: number) => void;
  currentPlaybackTime?: number;
}

export const RealtimeTranscriptionDisplay = ({
  transcriptionChunks,
  fullTranscript,
  transcriptionProgress,
  transcriptionStatus,
  averageConfidence,
  isProcessingAudio,
  isProcessingFinal = false,
  isRecording = false,
  isLoadingData = false,
  contentType = 'audio_file',
  onSeekToTimestamp,
  currentPlaybackTime
}: RealtimeTranscriptionDisplayProps) => {
  // Use the new word-level transcription display component
  return (
    <WordLevelTranscriptionDisplay
      transcriptionChunks={transcriptionChunks}
      fullTranscript={fullTranscript}
      transcriptionProgress={transcriptionProgress}
      transcriptionStatus={transcriptionStatus}
      averageConfidence={averageConfidence}
      isProcessingAudio={isProcessingAudio}
      isProcessingFinal={isProcessingFinal}
      isRecording={isRecording}
      isLoadingData={isLoadingData}
      contentType={contentType}
      onSeekToTimestamp={onSeekToTimestamp}
      currentPlaybackTime={currentPlaybackTime}
    />
  );
};

export default RealtimeTranscriptionDisplay;