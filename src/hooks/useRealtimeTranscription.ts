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
  const [isLoadingData, setIsLoadingData] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  const updateFullTranscript = (chunks: TranscriptionChunk[]) => {
    const transcript = chunks
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map(chunk => chunk.text)
      .join(' ')
      .trim();
    setFullTranscript(transcript);
  };

  const fetchPersistedData = useCallback(async () => {
    if (!recordingId || !user) return;
    
    setIsLoadingData(true);
    try {
      const { data: recording, error } = await supabase
        .from('recordings')
        .select('real_time_transcript, chapters, transcription_progress, transcription_status, transcription_confidence, transcript')
        .eq('content_id', recordingId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && recording) {
        console.log('Loaded persisted transcription data:', recording);
        
        // Set the transcription data from database
        const chunks = (recording.real_time_transcript as unknown as TranscriptionChunk[]) || [];
        setTranscriptionChunks(chunks);
        setChapters((recording.chapters as unknown as ChapterData[]) || []);
        setTranscriptionProgress(recording.transcription_progress || 0);
        setTranscriptionStatus((recording.transcription_status as 'pending' | 'processing' | 'completed' | 'failed') || 'pending');
        setAverageConfidence(recording.transcription_confidence || 0);
        
        // Update full transcript
        updateFullTranscript(chunks);
        
        // Use final transcript if available
        if (recording.transcript && recording.transcript.trim()) {
          setFullTranscript(recording.transcript);
        }
      }
    } catch (error) {
      console.error('Error fetching persisted transcription data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [recordingId, user]);

  const connectWebSocket = useCallback(() => {
    if (!recordingId || !user) {
      return;
    }

    // Don't create new connection if already connecting or connected
    if (wsRef.current && (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)) {
      return;
    }

    console.log('Connecting to real-time transcription WebSocket...');

    try {
      const wsUrl = `wss://trvuidenkjqqlwadlosh.supabase.co/functions/v1/real-time-transcription`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected for real-time transcription');
        setIsConnected(true);
        
        // Subscribe to recording updates - safely check connection state
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'subscribe',
            recordingId,
            userId: user.id
          }));
        }
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

      wsRef.current.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        setIsConnected(false);
        
        // Only attempt to reconnect if it wasn't a manual close (code 1000) and we still have valid params
        if (event.code !== 1000 && recordingId && user && !event.wasClean) {
          console.log('Attempting to reconnect in 3 seconds...');
          setTimeout(() => {
            if (recordingId && user) {
              connectWebSocket();
            }
          }, 3000);
        }
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

  const processAudioChunk = useCallback(async (audioData: string, chunkIndex: number) => {
    if (!recordingId || !user || processingRef.current) {
      return;
    }

    processingRef.current = true;
    setIsProcessingAudio(true);

    try {
      console.log(`Processing audio chunk ${chunkIndex} for recording ${recordingId}`);

      // Ensure recording exists before processing audio
      const { data: recordingCheck, error: checkError } = await supabase
        .from('recordings')
        .select('id')
        .eq('content_id', recordingId)
        .maybeSingle();

      if (checkError || !recordingCheck) {
        console.log('Recording not found, creating it...');
        
        // For live recordings, ensure the content record exists first
        let contentId = recordingId;
        
        // Check if content record exists for this recordingId
        const { data: contentCheck, error: contentCheckError } = await supabase
          .from('content')
          .select('id')
          .eq('id', recordingId)
          .maybeSingle();
          
        if (contentCheckError && contentCheckError.code === 'PGRST116') {
          // Content doesn't exist, create it first
          console.log('Creating content record for live recording...');
          const { data: newContent, error: contentCreateError } = await supabase
            .from('content')
            .insert([{
              id: recordingId,
              title: `Live Recording ${new Date().toLocaleDateString()}`,
              type: 'live_recording',
              user_id: user.id,
              metadata: { startedAt: new Date().toISOString() }
            }])
            .select()
            .single();
            
          if (contentCreateError) {
            console.error('Failed to create content record:', contentCreateError);
            toast.error('Failed to initialize recording content');
            return;
          }
          contentId = newContent.id;
          console.log('Content record created successfully:', contentId);
        }
        
        // Create the recording if it doesn't exist
        const { data: newRecording, error: createError } = await supabase
          .from('recordings')
          .insert([{
            content_id: contentId,
            transcription_status: 'processing',
            real_time_transcript: [],
            audio_chunks_processed: 0,
            transcription_confidence: 0,
            transcription_progress: 0
          }])
          .select()
          .single();

        if (createError) {
          console.error('Failed to create recording:', createError);
          toast.error('Failed to initialize recording');
          return;
        }
        console.log('Recording created successfully:', newRecording.id);
      }

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
    } else {
      console.warn('WebSocket not ready for chapter request');
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

      // Save current state to database if we have local data
      if (transcriptionChunks.length > 0) {
        const { error: saveError } = await supabase
          .from('recordings')
          .update({
            real_time_transcript: transcriptionChunks as any,
            transcript: fullTranscript,
            transcription_status: 'completed',
            transcription_progress: 100,
            transcription_confidence: averageConfidence,
            updated_at: new Date().toISOString()
          })
          .eq('content_id', recordingId);

        if (saveError) {
          console.error('Error saving final transcription state:', saveError);
        } else {
          console.log('Final transcription state saved successfully');
        }
      }

      // Request chapter generation
      requestChapters();
      
      setTranscriptionStatus('completed');
      toast.success('Transcription completed and saved');
      
      console.log('Transcription finalized for recording:', recordingId);
    } catch (error) {
      console.error('Error finalizing transcription:', error);
      setTranscriptionStatus('failed');
      toast.error('Failed to finalize transcription');
    }
  }, [recordingId, user, transcriptionChunks, fullTranscript, averageConfidence, requestChapters]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      // Only send unsubscribe if connection is open
      if (wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({
            type: 'unsubscribe',
            recordingId,
            userId: user?.id
          }));
        } catch (error) {
          console.warn('Failed to send unsubscribe message:', error);
        }
      }
      
      // Close connection if it's open or connecting
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [recordingId, user]);

  // Load persisted data when component mounts and periodically if WebSocket is not connected
  useEffect(() => {
    if (recordingId && user) {
      fetchPersistedData();
      
      // Set up periodic data fetching when WebSocket is not connected
      const interval = setInterval(() => {
        if (!isConnected && recordingId && user) {
          fetchPersistedData();
        }
      }, 5000); // Poll every 5 seconds when not connected
      
      return () => clearInterval(interval);
    }
  }, [recordingId, user, isConnected, fetchPersistedData]);

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
    isLoadingData,
    queueAudioChunk,
    finalizeTranscription,
    requestChapters,
    disconnect,
    fetchPersistedData
  };
};