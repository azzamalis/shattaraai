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
      throw new Error('Failed to extract YouTube audio');
    }
    
    // Process the extracted audio with Whisper
    return await transcribeAudioData(ytData.audioData, recordingId, 'youtube');
  } catch (error) {
    console.error('YouTube processing error:', error);
    throw error;
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
      throw new Error('Failed to download audio file');
    }
    
    // Convert to base64 for Whisper API
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    
    return await transcribeAudioData(base64Audio, recordingId, 'audio_file');
  } catch (error) {
    console.error('Audio file processing error:', error);
    throw error;
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
      throw new Error('Failed to download video file');
    }
    
    // In a real implementation, you'd extract audio track here
    // For now, we'll assume the file contains audio that can be processed
    const buffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const base64Audio = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
    
    return await transcribeAudioData(base64Audio, recordingId, 'video');
  } catch (error) {
    console.error('Video file processing error:', error);
    throw error;
  }
}

// Unified transcription function
async function transcribeAudioData(base64Audio: string, recordingId: string, contentType: string) {
  const openAIApiKey = Deno.env.get('OPENAI_WHISPER_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI Whisper API key not configured');
  }

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
    throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
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
      processing_status: 'ready_for_chapters',
      updated_at: new Date().toISOString()
    })
    .eq('content_id', recordingId);

  if (updateError) {
    console.error('Error updating recording:', updateError);
    throw new Error('Failed to update recording with transcription');
  }

  console.log(`Updated recording ${recordingId} with ${contentType} transcript`);
  
  return {
    success: true,
    transcript: result.text,
    contentType,
    recordingId
  };
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

    // Handle different content types
    if (contentType === 'youtube' && youtubeUrl) {
      return await processYouTubeContent(youtubeUrl, recordingId);
    }
    
    if (contentType === 'audio_file' && storageUrl) {
      return await processAudioFile(storageUrl, recordingId);
    }
    
    if (contentType === 'video' && storageUrl) {
      return await processVideoFile(storageUrl, recordingId);
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
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});