
import { useState, useEffect } from 'react';
import { RecordingStateInfo, RecordingMetadata } from '@/lib/types';

interface Chapter {
  id: string;
  title: string;
  summary: string;
  startTime: number;
  endTime?: number;
}

export const useRecordingState = () => {
  const [state, setState] = useState<RecordingStateInfo>({
    state: 'idle',
    isRecording: false,
    isPaused: false,
    duration: 0,
    transcript: '',
    isNewRecording: false,
    isExistingRecording: false,
    hasAudioFile: false,
    hasTranscript: false,
    hasChapters: false
  });

  const [metadata, setMetadata] = useState<RecordingMetadata>({
    duration: 0,
    size: 0,
    format: 'mp3',
    sampleRate: 44100,
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    transcript: '',
    audioUrl: '',
    transcriptUrl: '',
    chaptersData: []
  });

  const mockChapters: Chapter[] = [
    {
      id: '1',
      title: 'Introduction',
      summary: 'Overview of the main topics covered in this recording',
      startTime: 0,
      endTime: 120
    },
    {
      id: '2',
      title: 'Key Concepts',
      summary: 'Detailed explanation of the core concepts and principles',
      startTime: 120,
      endTime: 300
    },
    {
      id: '3',
      title: 'Practical Applications',
      summary: 'Real-world examples and use cases',
      startTime: 300,
      endTime: 480
    }
  ];

  const getRecordingState = (isNewRecording = false, isExistingRecording = false) => {
    return {
      state: isNewRecording ? 'new' : isExistingRecording ? 'existing' : 'idle',
      isRecording: false,
      isPaused: false,
      duration: 0,
      transcript: '',
      isNewRecording,
      isExistingRecording,
      hasAudioFile: isExistingRecording,
      hasTranscript: isExistingRecording,
      hasChapters: isExistingRecording
    };
  };

  const analyzeRecording = (recordingMetadata?: RecordingMetadata) => {
    if (!recordingMetadata) return getRecordingState();

    const hasTranscript = Boolean(recordingMetadata.transcript);
    const hasChapters = Boolean(recordingMetadata.chaptersData && recordingMetadata.chaptersData.length > 0);
    const hasAudioFile = Boolean(recordingMetadata.audioUrl);

    return {
      state: 'existing',
      isRecording: false,
      isPaused: false,
      duration: recordingMetadata.duration || 0,
      transcript: recordingMetadata.transcript || '',
      isNewRecording: false,
      isExistingRecording: true,
      hasAudioFile,
      hasTranscript,
      hasChapters
    };
  };

  return {
    state,
    setState,
    metadata,
    setMetadata,
    mockChapters,
    getRecordingState,
    analyzeRecording
  };
};
