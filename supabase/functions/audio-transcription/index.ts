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
      timestamp = Date.now()
    } = await req.json();

    if (!audioData || !recordingId) {
      throw new Error('Missing audio data or recording ID');
    }

    console.log(`Processing audio transcription for recording ${recordingId}, chunk ${chunkIndex}`);

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