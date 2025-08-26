import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

// Process YouTube content by downloading audio and transcribing
async function processYouTubeContent(youtubeUrl: string, recordingId: string) {
  console.log(`Processing YouTube content: ${youtubeUrl} for recording ${recordingId}`);
  
  try {
    // Call YouTube extractor to get audio data
    const { data: ytData, error: ytError } = await supabase.functions.invoke('youtube-extractor', {
      body: { url: youtubeUrl, contentId: recordingId, extractAudio: true }
    });
    
    if (ytError || !ytData?.audioData) {
      console.error('YouTube extractor failed:', ytError);
      return {
        ok: false,
        stage: 'youtube_extraction',
        code: 'YOUTUBE_EXTRACTION_FAILED',
        message: 'Failed to extract audio from YouTube video',
        details: { 
          error: ytError?.message || 'No audio data returned',
          url: youtubeUrl,
          recordingId 
        }
      };
    }
    
    // Process the extracted audio with Whisper
    const result = await transcribeAudioData(ytData.audioData, recordingId, 'youtube');
    
    if (result.ok === false) {
      return result; // Return error from transcription
    }
    
    // Trigger chapter generation after successful transcription
    try {
      await triggerChapterGeneration(recordingId, 'youtube');
    } catch (chapterError) {
      console.warn('Chapter generation failed but transcription succeeded:', chapterError);
      // Don't fail the entire process if chapter generation fails
    }
    
    return {
      ok: true,
      data: result
    };
  } catch (error) {
    console.error('YouTube processing error:', error);
    return {
      ok: false,
      stage: 'youtube_extraction',
      code: 'YOUTUBE_PROCESSING_ERROR',
      message: 'Unexpected error processing YouTube content',
      details: { 
        error: error.message,
        url: youtubeUrl,
        recordingId 
      }
    };
  }
}

// Process uploaded audio file
async function processAudioFile(storageUrl: string, recordingId: string) {
  console.log(`Processing audio file: ${storageUrl} for recording ${recordingId}`);
  
  try {
    // Download file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(storageUrl.split('/').pop() || '');
    
    if (downloadError || !fileData) {
      console.error('Audio file download failed:', downloadError);
      return {
        ok: false,
        stage: 'audio_download',
        code: 'AUDIO_DOWNLOAD_FAILED',
        message: 'Failed to download audio file from storage',
        details: { 
          error: downloadError?.message || 'No file data returned',
          storageUrl,
          recordingId 
        }
      };
    }
    
    // Convert to base64 for Whisper API
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    
    const result = await transcribeAudioData(base64Audio, recordingId, 'audio_file');
    
    if (result.ok === false) {
      return result; // Return error from transcription
    }
    
    // Trigger chapter generation after successful transcription
    try {
      await triggerChapterGeneration(recordingId, 'audio_file');
    } catch (chapterError) {
      console.warn('Chapter generation failed but transcription succeeded:', chapterError);
    }
    
    return {
      ok: true,
      data: result
    };
  } catch (error) {
    console.error('Audio file processing error:', error);
    return {
      ok: false,
      stage: 'audio_processing',
      code: 'AUDIO_PROCESSING_ERROR',
      message: 'Unexpected error processing audio file',
      details: { 
        error: error.message,
        storageUrl,
        recordingId 
      }
    };
  }
}

// Process uploaded video file (extract audio first)
async function processVideoFile(storageUrl: string, recordingId: string) {
  console.log(`Processing video file: ${storageUrl} for recording ${recordingId}`);
  
  try {
    // For now, we'll treat it like an audio file - in production you'd extract audio from video
    // This is a simplified implementation - you'd need FFmpeg or similar for proper video processing
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('videos')
      .download(storageUrl.split('/').pop() || '');
    
    if (downloadError || !fileData) {
      console.error('Video file download failed:', downloadError);
      return {
        ok: false,
        stage: 'video_download',
        code: 'VIDEO_DOWNLOAD_FAILED',
        message: 'Failed to download video file from storage',
        details: { 
          error: downloadError?.message || 'No file data returned',
          storageUrl,
          recordingId 
        }
      };
    }
    
    // In a real implementation, you'd extract audio track here
    // For now, we'll assume the file contains audio that can be processed
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    
    const result = await transcribeAudioData(base64Audio, recordingId, 'video');
    
    if (result.ok === false) {
      return result; // Return error from transcription
    }
    
    // Trigger chapter generation after successful transcription
    try {
      await triggerChapterGeneration(recordingId, 'video');
    } catch (chapterError) {
      console.warn('Chapter generation failed but transcription succeeded:', chapterError);
    }
    
    return {
      ok: true,
      data: result
    };
  } catch (error) {
    console.error('Video file processing error:', error);
    return {
      ok: false,
      stage: 'video_processing',
      code: 'VIDEO_PROCESSING_ERROR',
      message: 'Unexpected error processing video file',
      details: { 
        error: error.message,
        storageUrl,
        recordingId 
      }
    };
  }
}

// Trigger chapter generation via WebSocket
async function triggerChapterGeneration(recordingId: string, contentType: string) {
  console.log(`Triggering chapter generation for ${contentType} recording: ${recordingId}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('real-time-transcription', {
      body: {
        type: 'request_chapters',
        recordingId,
        contentType
      }
    });
    
    if (error) {
      console.error('Failed to trigger chapter generation:', error);
      throw new Error('Failed to trigger chapter generation');
    }
    
    console.log('Chapter generation triggered successfully');
  } catch (error) {
    console.error('Error triggering chapter generation:', error);
    throw error;
  }
}

// Unified transcription function
async function transcribeAudioData(base64Audio: string, recordingId: string, contentType: string) {
  const openAIApiKey = Deno.env.get('OPENAI_WHISPER_API_KEY');
  if (!openAIApiKey) {
    return {
      ok: false,
      stage: 'transcription',
      code: 'OPENAI_API_KEY_MISSING',
      message: 'OpenAI Whisper API key not configured',
      details: { contentType, recordingId }
    };
  }

  try {
    // Process audio in chunks to prevent memory issues
    const binaryAudio = processBase64Chunks(base64Audio);
    
    // Prepare form data for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, `${contentType}_audio.webm`);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Whisper API error:', errorText);
      return {
        ok: false,
        stage: 'transcription',
        code: 'WHISPER_API_ERROR',
        message: 'OpenAI Whisper transcription failed',
        details: { 
          status: response.status,
          error: errorText,
          contentType,
          recordingId 
        }
      };
    }

    const result = await response.json();
    console.log(`Whisper API response for ${contentType}:`, { text: result.text?.substring(0, 100), segments: result.segments?.length });

    // Update recording with full transcript
    const { error: updateError } = await supabase
      .from('recordings')
      .update({
        transcript: result.text || '',
        transcription_confidence: result.segments ? 
          result.segments.reduce((acc: number, seg: any) => acc + (seg.avg_logprob || 0), 0) / result.segments.length : 0,
        transcription_status: 'completed',
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('content_id', recordingId);

    if (updateError) {
      console.error('Error updating recording:', updateError);
      return {
        ok: false,
        stage: 'database_update',
        code: 'DATABASE_UPDATE_FAILED',
        message: 'Failed to save transcription to database',
        details: { 
          error: updateError.message,
          contentType,
          recordingId 
        }
      };
    }

    console.log(`Updated recording ${recordingId} with ${contentType} transcript`);
    
    return {
      ok: true,
      data: {
        success: true,
        transcript: result.text,
        contentType,
        recordingId
      }
    };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      ok: false,
      stage: 'transcription',
      code: 'TRANSCRIPTION_ERROR',
      message: 'Unexpected error during transcription',
      details: { 
        error: error.message,
        contentType,
        recordingId 
      }
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      audioData, 
      recordingId, 
      chunkIndex = 0, 
      isRealTime = false,
      timestamp = Date.now(),
      contentType = 'live_recording', // New: track content type for different processing
      storageUrl = null, // New: for processing uploaded files
      youtubeUrl = null // New: for YouTube processing
    } = await req.json();

    // Handle different content types with structured error responses
    if (contentType === 'youtube' && youtubeUrl) {
      const result = await processYouTubeContent(youtubeUrl, recordingId);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (contentType === 'audio_file' && storageUrl) {
      const result = await processAudioFile(storageUrl, recordingId);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (contentType === 'video' && storageUrl) {
      const result = await processVideoFile(storageUrl, recordingId);
      return new Response(JSON.stringify(result), {
        status: result.ok ? 200 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Original live recording logic
    if (!audioData || !recordingId) {
      throw new Error('Missing audio data or recording ID');
    }

    console.log(`Processing ${contentType} transcription for recording ${recordingId}, chunk ${chunkIndex}`);

    const openAIApiKey = Deno.env.get('OPENAI_WHISPER_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI Whisper API key not configured');
    }

    // Process audio in chunks to prevent memory issues
    const binaryAudio = processBase64Chunks(audioData);
    
    // Prepare form data for Whisper API
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, `audio_chunk_${chunkIndex}.webm`);
    formData.append('model', 'whisper-1');
    // No language parameter - let Whisper auto-detect the language
    formData.append('response_format', 'verbose_json');

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Whisper API error:', errorText);
      throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Whisper API response:', { text: result.text?.substring(0, 100), segments: result.segments?.length });

    // Create transcription chunk object
    const transcriptionChunk = {
      chunkIndex,
      timestamp,
      text: result.text || '',
      confidence: result.segments ? 
        result.segments.reduce((acc: number, seg: any) => acc + (seg.avg_logprob || 0), 0) / result.segments.length : 0,
      segments: result.segments || [],
      duration: result.duration || 0
    };

    // Update recording with new transcription chunk
    if (isRealTime) {
      // For real-time transcription, append to real_time_transcript array
      const { data: currentRecording, error: fetchError } = await supabase
        .from('recordings')
        .select('real_time_transcript, audio_chunks_processed, transcription_confidence')
        .eq('content_id', recordingId)
        .single();

      if (fetchError) {
        console.error('Error fetching current recording:', fetchError);
        throw new Error('Failed to fetch current recording');
      }

      const currentTranscript = currentRecording.real_time_transcript || [];
      const updatedTranscript = [...currentTranscript, transcriptionChunk];
      const chunksProcessed = (currentRecording.audio_chunks_processed || 0) + 1;
      
      // Calculate average confidence
      const avgConfidence = updatedTranscript.reduce((acc, chunk) => acc + chunk.confidence, 0) / updatedTranscript.length;

      const { error: updateError } = await supabase
        .from('recordings')
        .update({
          real_time_transcript: updatedTranscript,
          audio_chunks_processed: chunksProcessed,
          transcription_confidence: Math.max(0, Math.min(1, avgConfidence)),
          transcription_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('content_id', recordingId);

      if (updateError) {
        console.error('Error updating recording:', updateError);
        throw new Error('Failed to update recording with transcription');
      }

      console.log(`Updated recording ${recordingId} with chunk ${chunkIndex}, total chunks: ${chunksProcessed}`);
    } else {
      // For final transcription, update the main transcript field
      const fullTranscript = result.text || '';
      const confidence = transcriptionChunk.confidence;

      const { error: updateError } = await supabase
        .from('recordings')
        .update({
          transcript: fullTranscript,
          transcription_confidence: Math.max(0, Math.min(1, confidence)),
          transcription_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('content_id', recordingId);

      if (updateError) {
        console.error('Error updating final transcript:', updateError);
        throw new Error('Failed to update final transcript');
      }

      console.log(`Updated recording ${recordingId} with final transcript`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        transcription: transcriptionChunk,
        recordingId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in audio-transcription function:', error);
    
    // Return structured error response
    const errorResponse = {
      ok: false,
      stage: 'unknown',
      code: 'AUDIO_TRANSCRIPTION_ERROR',
      message: 'Unexpected error in audio transcription function',
      details: { 
        error: error.message,
        timestamp: new Date().toISOString()
      }
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});