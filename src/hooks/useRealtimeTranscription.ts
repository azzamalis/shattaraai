import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TranscriptionChunk {
  chunkIndex: number;
  timestamp: number;
  text: string;
  confidence: number;
  segments: any[];
  duration: number;
}

interface ChapterData {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

export const useRealtimeTranscription = (recordingId?: string) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [transcriptionChunks, setTranscriptionChunks] = useState<TranscriptionChunk[]>([]);
  const [fullTranscript, setFullTranscript] = useState('');
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  const connectWebSocket = useCallback(() => {
    if (!recordingId || !user || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    console.log('Connecting to real-time transcription WebSocket...');

    try {
      const wsUrl = `wss://trvuidenkjqqlwadlosh.functions.supabase.co/functions/v1/real-time-transcription`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected for real-time transcription');
        setIsConnected(true);
        
        // Subscribe to recording updates
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          recordingId,
          userId: user.id
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data.type);

          switch (data.type) {
            case 'initial_transcript':
              setTranscriptionChunks(data.transcript || []);
              setTranscriptionProgress(data.progress || 0);
              setTranscriptionStatus(data.status || 'pending');
              setAverageConfidence(data.confidence || 0);
              updateFullTranscript(data.transcript || []);
              break;

            case 'transcription_update':
              if (data.chunk) {
                setTranscriptionChunks(prev => {
                  const updated = [...prev, data.chunk];
                  updateFullTranscript(updated);
                  return updated;
                });
              }
              if (data.progress !== undefined) setTranscriptionProgress(data.progress);
              if (data.status) setTranscriptionStatus(data.status);
              if (data.confidence !== undefined) setAverageConfidence(data.confidence);
              break;

            case 'chapters_update':
              setChapters(data.chapters || []);
              break;

            case 'error':
              console.error('WebSocket error:', data.message);
              toast.error('Transcription error: ' + data.message);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (recordingId && user) {
            connectWebSocket();
          }
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      setIsConnected(false);
    }
  }, [recordingId, user]);

  const updateFullTranscript = (chunks: TranscriptionChunk[]) => {
    const transcript = chunks
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map(chunk => chunk.text)
      .join(' ')
      .trim();
    setFullTranscript(transcript);
  };

  const processAudioChunk = useCallback(async (audioData: string, chunkIndex: number) => {
    if (!recordingId || !user || processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsProcessingAudio(true);

    try {
      console.log(`Processing audio chunk ${chunkIndex} for recording ${recordingId}`);

      const { data, error } = await supabase.functions.invoke('audio-transcription', {
        body: {
          audioData,
          recordingId,
          chunkIndex,
          isRealTime: true,
          timestamp: Date.now()
        }
      });

      if (error) {
        console.error('Error processing audio chunk:', error);
        toast.error('Failed to process audio chunk');
        return;
      }

      console.log('Audio chunk processed successfully:', data);

    } catch (error) {
      console.error('Error in processAudioChunk:', error);
      toast.error('Failed to process audio for transcription');
    } finally {
      processingRef.current = false;
      setIsProcessingAudio(false);
    }
  }, [recordingId, user]);

  const queueAudioChunk = useCallback((audioData: string) => {
    audioQueueRef.current.push(audioData);
    
    // Process queue if not already processing
    if (!processingRef.current && audioQueueRef.current.length > 0) {
      const nextAudio = audioQueueRef.current.shift();
      if (nextAudio) {
        const chunkIndex = transcriptionChunks.length;
        processAudioChunk(nextAudio, chunkIndex);
      }
    }
  }, [processAudioChunk, transcriptionChunks.length]);

  const requestChapters = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'request_chapters',
        recordingId
      }));
    }
  }, [recordingId]);

  const finalizeTranscription = useCallback(async (finalAudioData?: string) => {
    if (!recordingId || !user) return;

    try {
      if (finalAudioData) {
        // Process final audio chunk
        await supabase.functions.invoke('audio-transcription', {
          body: {
            audioData: finalAudioData,
            recordingId,
            chunkIndex: -1, // Indicates final transcription
            isRealTime: false,
            timestamp: Date.now()
          }
        });
      }

      // Request chapter generation
      requestChapters();
      
      setTranscriptionStatus('completed');
      toast.success('Transcription completed');
      
      console.log('Transcription finalized for recording:', recordingId);
    } catch (error) {
      console.error('Error finalizing transcription:', error);
      setTranscriptionStatus('failed');
      toast.error('Failed to finalize transcription');
    }
  }, [recordingId, user, requestChapters]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        recordingId,
        userId: user?.id
      }));
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [recordingId, user]);

  // Connect WebSocket when component mounts or recordingId changes
  useEffect(() => {
    if (recordingId && user) {
      connectWebSocket();
    }

    return () => {
      disconnect();
    };
  }, [recordingId, user, connectWebSocket, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    transcriptionChunks,
    fullTranscript,
    chapters,
    transcriptionProgress,
    transcriptionStatus,
    averageConfidence,
    isProcessingAudio,
    queueAudioChunk,
    finalizeTranscription,
    requestChapters,
    disconnect
  };
};