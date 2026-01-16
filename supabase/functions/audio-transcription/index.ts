import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  try {
    // For base64 decoding, we need to ensure the string is valid first
    // Base64 strings should be divisible by 4, so we pad if necessary
    let paddedBase64 = base64String;
    while (paddedBase64.length % 4 !== 0) {
      paddedBase64 += '=';
    }
    
    console.log('Processing base64 string of length:', paddedBase64.length);
    
    // Decode the entire base64 string at once for audio files
    // Chunking base64 can break the encoding, so we decode it all at once
    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('Successfully decoded base64 to', bytes.length, 'bytes');
    return bytes;
  } catch (error) {
    console.error('Failed to decode base64:', error);
    throw new Error('Failed to decode base64: ' + error.message);
  }
}

// New function to process audio files from URL (improved pipeline)
async function processAudioFileFromUrl(
  audioFileUrl: string,
  recordingId: string,
  contentId: string,
  originalFileName: string,
  isVideoContent: boolean
): Promise<void> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('Background processing started for audio file:', audioFileUrl);
    
    // Download audio file
    console.log('Downloading audio file from URL:', audioFileUrl);
    const audioResponse = await fetch(audioFileUrl);
    if (!audioResponse.ok) {
      throw new Error(`Failed to download audio file: ${audioResponse.statusText}`);
    }
    
    const audioBuffer = await audioResponse.arrayBuffer();
    console.log('Audio file downloaded, size:', audioBuffer.byteLength, 'bytes');
    
    // Update recording status
    if (recordingId) {
      await supabase
        .from('recordings')
        .update({ 
          processing_status: 'processing',
          transcription_status: 'processing'
        })
        .eq('id', recordingId);
    }
    
    // Update content status with progress
    if (contentId) {
      await supabase
        .from('content')
        .update({ 
          processing_status: 'processing',
          metadata: {
            currentStep: 'transcribing',
            progress: 35
          }
        })
        .eq('id', contentId);
    }
    
    // Determine file type and MIME type
    const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || 'wav';
    let mimeType = 'audio/wav';
    let fileName = `audio_file.${fileExtension}`;
    
    if (isVideoContent) {
      mimeType = fileExtension === 'mp4' ? 'video/mp4' : 'video/quicktime';
      fileName = `video_file.${fileExtension}`;
    } else {
      switch (fileExtension) {
        case 'mp3':
          mimeType = 'audio/mpeg';
          break;
        case 'm4a':
          mimeType = 'audio/mp4';
          break;
        case 'wav':
          mimeType = 'audio/wav';
          break;
        case 'flac':
          mimeType = 'audio/flac';
          break;
      }
    }
    
    console.log(`Processing ${isVideoContent ? 'video' : 'audio'} file: ${fileName} with MIME type: ${mimeType}`);
    
    // Call OpenAI Whisper API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }
    
    console.log('OpenAI API key found, proceeding with transcription');
    
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: mimeType }), fileName);
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'word');
    formData.append('timestamp_granularities[]', 'segment');
    
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });
    
    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorText}`);
    }
    
    const transcriptionResult = await whisperResponse.json();
    console.log('Whisper API response:', {
      text: transcriptionResult.text,
      segments: transcriptionResult.segments ? 'segments included' : 'no segments'
    });
    
    const transcriptionText = transcriptionResult.text || '';
    const segments = transcriptionResult.segments || [];
    const words = transcriptionResult.words || [];
    
    // Update recording with transcript and word-level data
    if (recordingId) {
      const updateData: any = {
        transcript: transcriptionText,
        processing_status: 'completed',
        transcription_status: 'completed',
        transcription_confidence: 0.95,
        updated_at: new Date().toISOString()
      };
      
      // Add word-level transcript data
      if (segments.length > 0 || words.length > 0) {
        updateData.real_time_transcript = [{
          chunkIndex: 0,
          timestamp: Date.now(),
          text: transcriptionText,
          confidence: 0.95,
          segments: segments,
          words: words,
          duration: segments.length > 0 ? segments[segments.length - 1]?.end || 0 : 0
        }];
      }
      
      await supabase
        .from('recordings')
        .update(updateData)
        .eq('id', recordingId);
      
      console.log('Updated recording with transcript');
    }
    
    // Update content with final transcript and trigger chapter generation
    if (contentId) {
      await supabase
        .from('content')
        .update({
          text_content: transcriptionText,
          processing_status: 'completed',
          transcription_confidence: 0.95,
          updated_at: new Date().toISOString(),
          metadata: {
            currentStep: 'completed',
            progress: 100
          }
        })
        .eq('id', contentId);
      
      console.log('Updated content with final transcript, triggering chapter generation');
      
      // Trigger chapter generation
      const chapterResponse = await supabase.functions.invoke('generate-chapters', {
        body: { 
          contentId: contentId,
          transcript: transcriptionText
        }
      });
      
      if (chapterResponse.error) {
        console.error('Chapter generation failed:', chapterResponse.error);
      } else {
        console.log('Chapter generation triggered successfully for content', contentId);
      }
    }
    
    console.log('Background processing completed for audio file');
    
  } catch (error) {
    console.error('Background processing failed for audio file:', error);
    
    // Update status to failed
    if (recordingId) {
      await supabase
        .from('recordings')
        .update({ 
          processing_status: 'failed',
          transcription_status: 'failed',
          transcript: `Transcription failed: ${error.message}`
        })
        .eq('id', recordingId);
    }
    
    if (contentId) {
      await supabase
        .from('content')
        .update({ 
          processing_status: 'failed',
          text_content: `Transcription failed: ${error.message}`
        })
        .eq('id', contentId);
    }
    
    throw error;
  }
}

// Background task for processing after response (legacy approach)
async function processInBackground(
  recordingId: string,
  audioData: string,
  chunkIndex: number,
  isRealTime: boolean,
  timestamp: number,
  originalFileName?: string,
  isVideoContent?: boolean,
  videoDuration?: number
) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    console.log(`Background processing started for recording ${recordingId}`, { isVideoContent, videoDuration });

    // Handle video content - process real audio data instead of placeholder
    if (isVideoContent) {
      console.log('Processing real video audio data for transcription');
      
      // Continue with normal audio transcription process using the extracted audio data
      // The audio data is now real extracted audio from the video, not a placeholder
    }

    const openAIApiKey = Deno.env.get('OPENAI_TRANSCRIPTION_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI Transcription API key not found in environment');
      throw new Error('OpenAI Transcription API key not configured');
    }
    
    console.log('OpenAI API key found, proceeding with transcription');

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
    formData.append('timestamp_granularities[]', 'word'); // Request word-level timestamps

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

    // Create transcription chunk object with word-level data
    const transcriptionChunk = {
      chunkIndex,
      timestamp,
      text: result.text || '',
      confidence: result.segments ? 
        result.segments.reduce((acc: number, seg: any) => acc + (seg.avg_logprob || 0), 0) / result.segments.length : 0,
      segments: result.segments || [],
      duration: result.duration || 0,
      words: result.words || [] // Include word-level timestamps
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
          processing_status: 'completed',
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
            transcript: fullTranscript,
            duration: result.duration || 0
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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Update processing status to failed with error details
    await supabase
      .from('content')
      .update({
        processing_status: 'failed',
        text_content: `Processing error: ${error.message || 'Unknown error'}`,
        updated_at: new Date().toISOString()
      })
      .eq('id', recordingId);
  }
}

// Synchronous transcription for exam resources (no database updates)
async function transcribeSynchronously(
  audioFileUrl: string,
  originalFileName: string,
  isVideoContent: boolean
): Promise<{ text: string; duration?: number }> {
  console.log('Synchronous transcription for exam resource:', audioFileUrl);
  
  // Download audio file
  const audioResponse = await fetch(audioFileUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to download audio file: ${audioResponse.statusText}`);
  }
  
  const audioBuffer = await audioResponse.arrayBuffer();
  console.log('Audio file downloaded, size:', audioBuffer.byteLength, 'bytes');
  
  // Determine file type and MIME type
  const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || 'wav';
  let mimeType = 'audio/wav';
  let fileName = `audio_file.${fileExtension}`;
  
  if (isVideoContent) {
    mimeType = fileExtension === 'mp4' ? 'video/mp4' : 'video/quicktime';
    fileName = `video_file.${fileExtension}`;
  } else {
    switch (fileExtension) {
      case 'mp3':
        mimeType = 'audio/mpeg';
        break;
      case 'm4a':
        mimeType = 'audio/mp4';
        break;
      case 'wav':
        mimeType = 'audio/wav';
        break;
      case 'flac':
        mimeType = 'audio/flac';
        break;
      case 'webm':
        mimeType = 'audio/webm';
        break;
      case 'ogg':
        mimeType = 'audio/ogg';
        break;
    }
  }
  
  console.log(`Processing ${isVideoContent ? 'video' : 'audio'} file: ${fileName} with MIME type: ${mimeType}`);
  
  // Call OpenAI Whisper API
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not found');
  }
  
  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: mimeType }), fileName);
  formData.append('model', 'whisper-1');
  formData.append('response_format', 'verbose_json');
  
  const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
    },
    body: formData,
  });
  
  if (!whisperResponse.ok) {
    const errorText = await whisperResponse.text();
    throw new Error(`Whisper API error: ${whisperResponse.status} - ${errorText}`);
  }
  
  const transcriptionResult = await whisperResponse.json();
  console.log('Synchronous transcription completed, text length:', transcriptionResult.text?.length || 0);
  
  return {
    text: transcriptionResult.text || '',
    duration: transcriptionResult.duration
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ========== IP-BASED RATE LIMITING ==========
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    console.log('Audio transcription request from IP:', clientIP);

    const { data: rateCheck, error: rateError } = await supabase.rpc('check_ip_rate_limit', {
      p_ip_address: clientIP,
      p_endpoint: 'audio-transcription',
      p_max_requests: 30,  // 30 requests per hour
      p_window_minutes: 60
    });

    if (rateError) {
      console.error('Rate limit check error:', rateError);
      // Continue anyway - don't block on rate limit errors
    } else if (rateCheck && rateCheck.length > 0 && !rateCheck[0].allowed) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again later.',
          reset_time: rateCheck[0].reset_time
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '3600'
          } 
        }
      );
    }

    const { 
      audioData, 
      audioFileUrl,
      recordingId, 
      contentId,
      chunkIndex = 0, 
      isRealTime = false, 
      timestamp = Date.now(),
      originalFileName = 'audio_chunk_0.wav',
      isVideoContent = false,
      videoDuration = 0,
      requestWordTimestamps = false,
      synchronous = false  // New flag for exam resource transcription
    } = await req.json();

    console.log('Processing audio transcription', { recordingId, contentId, synchronous, isVideoContent, originalFileName });

    if (!audioData && !audioFileUrl) {
      throw new Error('Missing required parameter: audioData or audioFileUrl');
    }

    // Synchronous mode for exam resources - transcribe and return immediately
    if (synchronous && audioFileUrl) {
      console.log('Using synchronous transcription mode for exam resource');
      const result = await transcribeSynchronously(audioFileUrl, originalFileName, isVideoContent);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          text: result.text,
          duration: result.duration,
          message: 'Audio transcription completed'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Require recordingId or contentId for background processing
    if (!recordingId && !contentId) {
      throw new Error('Missing required parameter: recordingId or contentId (or use synchronous=true)');
    }

    // Handle new improved pipeline with audio file URL
    if (audioFileUrl) {
      console.log('Processing audio file from URL:', audioFileUrl);
      const backgroundProcessing = processAudioFileFromUrl(audioFileUrl, recordingId, contentId, originalFileName, isVideoContent);
      
      // Use waitUntil to ensure background task completes
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(backgroundProcessing);
      } else {
        backgroundProcessing.catch(error => {
          console.error('Background processing failed:', error);
        });
      }
    } else {
      // Legacy approach with base64 data
      console.log('Processing base64 audio data');
      const backgroundProcessing = processInBackground(recordingId, audioData, chunkIndex, isRealTime, timestamp, originalFileName, isVideoContent, videoDuration);
      
      // Use waitUntil to ensure background task completes
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        EdgeRuntime.waitUntil(backgroundProcessing);
      } else {
        backgroundProcessing.catch(error => {
          console.error('Background processing failed:', error);
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Audio transcription started',
        recordingId,
        contentId,
        chunkIndex,
        timestamp 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in audio-transcription function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});