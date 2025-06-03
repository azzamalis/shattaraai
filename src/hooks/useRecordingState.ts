
import { useState, useEffect, useMemo } from 'react';
import { RecordingState, RecordingStateInfo, RecordingMetadata } from '@/lib/types';

interface UseRecordingStateProps {
  contentId: string;
  contentType: string;
}

export function useRecordingState({ contentId, contentType }: UseRecordingStateProps) {
  const [recordingMetadata, setRecordingMetadata] = useState<RecordingMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine if this is a new recording based on URL pattern
  const isNewRecording = useMemo(() => {
    return contentId === 'new' || !contentId;
  }, [contentId]);

  // Simulate fetching recording metadata for existing recordings
  useEffect(() => {
    if (contentType === 'recording' && !isNewRecording) {
      setIsLoading(true);
      
      // Check localStorage first for any cached data
      const cachedData = localStorage.getItem(`recording_${contentId}`);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          setRecordingMetadata(parsed);
        } catch (error) {
          console.error('Error parsing cached recording data:', error);
        }
      }

      // Simulate API call to fetch recording metadata
      const timer = setTimeout(() => {
        // Mock existing recording data
        const mockMetadata: RecordingMetadata = {
          duration: 1847, // 30:47 in seconds
          fileSize: 15728640, // ~15MB
          format: 'mp3',
          sampleRate: 44100,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          lastModified: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          audioUrl: `/recordings/${contentId}.mp3`,
          transcriptUrl: `/transcripts/${contentId}.txt`,
          chaptersData: [
            {
              id: '1',
              title: 'Introduction',
              startTime: 0,
              endTime: 180,
              summary: 'Course introduction and overview'
            },
            {
              id: '2', 
              title: 'Main Topic',
              startTime: 180,
              endTime: 1200,
              summary: 'Deep dive into the main subject'
            },
            {
              id: '3',
              title: 'Conclusion',
              startTime: 1200,
              endTime: 1847,
              summary: 'Summary and key takeaways'
            }
          ]
        };

        setRecordingMetadata(mockMetadata);
        
        // Cache the data
        localStorage.setItem(`recording_${contentId}`, JSON.stringify(mockMetadata));
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [contentId, contentType, isNewRecording]);

  const recordingStateInfo: RecordingStateInfo = useMemo(() => {
    const isExistingRecording = !isNewRecording && contentType === 'recording';
    
    return {
      state: isNewRecording ? 'new' : 'existing',
      isNewRecording,
      isExistingRecording,
      hasAudioFile: !!recordingMetadata?.audioUrl,
      hasTranscript: !!recordingMetadata?.transcriptUrl,
      hasChapters: !!recordingMetadata?.chaptersData?.length
    };
  }, [isNewRecording, contentType, recordingMetadata]);

  const updateRecordingMetadata = (updates: Partial<RecordingMetadata>) => {
    setRecordingMetadata(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(`recording_${contentId}`, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    recordingStateInfo,
    recordingMetadata,
    isLoading,
    updateRecordingMetadata
  };
}
