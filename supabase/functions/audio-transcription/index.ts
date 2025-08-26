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

// Background task for processing after response
async function processInBackground(
  recordingId: string,
  audioData: string,
  chunkIndex: number,
  isRealTime: boolean,
  timestamp: number,
  originalFileName?: string
) {
  try {
    console.log(`Background processing started for recording ${recordingId}`);

    const openAIApiKey = Deno.env.get('OPENAI_TRANSCRIPTION_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI Transcription API key not configured');
    }

    // Process audio in chunks to prevent memory issues
    const binaryAudio = processBase64Chunks(audioData);
    
    // Determine file extension and MIME type from original filename or default to MP3
    let fileExtension = 'mp3';
    let mimeType = 'audio/mpeg';
    let fileName = `audio_chunk_${chunkIndex}.mp3`;
    
    if (originalFileName) {
      const ext = originalFileName.split('.').pop()?.toLowerCase();
      if (ext) {
        fileExtension = ext;
        fileName = `audio_chunk_${chunkIndex}.${ext}`;
        
        // Map common audio extensions to MIME types
        switch (ext) {
          case 'mp3':
            mimeType = 'audio/mpeg';
            break;
          case 'wav':
            mimeType = 'audio/wav';
            break;
          case 'webm':
            mimeType = 'audio/webm';
            break;
          case 'ogg':
            mimeType = 'audio/ogg';
            break;
          case 'm4a':
            mimeType = 'audio/mp4';
            break;
          case 'aac':
            mimeType = 'audio/aac';
            break;
          default:
            mimeType = 'audio/mpeg'; // Default to MP3
        }
      }
    }
    
    console.log(`Processing audio file: ${fileName} with MIME type: ${mimeType}`);
    
    // Prepare form data for OpenAI Whisper API
    // Support for multiple audio formats: mp3, mp4, mpeg, mpga, m4a, wav, and webm
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: mimeType });
    formData.append('file', blob, fileName);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('language', 'en'); // Can be made dynamic if needed

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

    // Update recording/content with new transcription chunk
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
        .from('content')
        .update({
          text_content: fullTranscript,
          transcription_confidence: Math.max(0, Math.min(1, confidence)),
          processing_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', recordingId);

      if (updateError) {
        console.error('Error updating final transcript:', updateError);
        throw new Error('Failed to update final transcript');
      }

      console.log(`Updated content ${recordingId} with final transcript, triggering chapter generation`);
      
      // Trigger chapter generation after successful transcription
      try {
        const chapterResponse = await supabase.functions.invoke('generate-chapters', {
          body: {
            contentId: recordingId,
            transcript: fullTranscript
          }
        });
        
        if (chapterResponse.error) {
          console.error('Error in chapter generation response:', chapterResponse.error);
        } else {
          console.log(`Chapter generation triggered successfully for content ${recordingId}`);
        }
      } catch (chapterError) {
        console.error('Error triggering chapter generation:', chapterError);
        
        // Update processing status to completed since transcription worked
        await supabase
          .from('content')
          .update({
            processing_status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', recordingId);
      }
    }

    console.log(`Background processing completed for recording ${recordingId}`);
  } catch (error) {
    console.error(`Background processing failed for recording ${recordingId}:`, error);
    
    // Update processing status to failed
    await supabase
      .from('content')
      .update({
        processing_status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', recordingId);
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
      originalFileName
    } = await req.json();

    if (!audioData || !recordingId) {
      throw new Error('Missing audio data or recording ID');
    }

    console.log(`Processing audio transcription for recording ${recordingId}, chunk ${chunkIndex}, file: ${originalFileName || 'unknown'}`);

    // Start background processing
    const backgroundProcessing = processInBackground(
      recordingId,
      audioData,
      chunkIndex,
      isRealTime,
      timestamp,
      originalFileName
    );

    // Use waitUntil to ensure background task completes
    if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
      EdgeRuntime.waitUntil(backgroundProcessing);
    } else {
      // Fallback for environments without EdgeRuntime
      backgroundProcessing.catch(error => {
        console.error('Background processing failed:', error);
      });
    }

    // Return immediate response
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Transcription started',
        recordingId,
        chunkIndex
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