import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Simple audio extraction using Web Audio API approach for Deno
async function extractAudioFromVideo(videoBuffer: ArrayBuffer, filename: string) {
  try {
    console.log('Starting audio extraction from video buffer...');
    
    // For now, we'll use a hybrid approach:
    // 1. For small videos, extract audio using native Deno APIs
    // 2. For large videos, use external service or direct Whisper processing
    
    // Check video size - if over 50MB, use direct video processing
    if (videoBuffer.byteLength > 50 * 1024 * 1024) {
      console.log('Large video detected, using direct video processing');
      return { useDirectVideo: true, buffer: videoBuffer };
    }
    
    // For smaller videos, we'll simulate audio extraction
    // In a real implementation, this would use FFmpeg WASM or external service
    console.log('Extracting audio from video...');
    
    // Return the video buffer for now - Whisper can handle video files directly
    return { useDirectVideo: true, buffer: videoBuffer };
    
  } catch (error) {
    console.error('Audio extraction failed:', error);
    throw new Error(`Audio extraction failed: ${error.message}`);
  }
}

async function uploadAudioToStorage(audioBuffer: ArrayBuffer, contentId: string, originalFilename: string) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Generate audio filename
  const timestamp = Date.now();
  const audioFilename = `${timestamp}_${originalFilename.replace(/\.[^/.]+$/, '')}_audio.wav`;
  const audioPath = `${contentId}/${audioFilename}`;
  
  console.log('Uploading audio to storage:', audioPath);
  
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(audioPath, audioBuffer, {
      contentType: 'audio/wav',
      upsert: true
    });
  
  if (error) {
    throw new Error(`Failed to upload audio: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('audio-files')
    .getPublicUrl(audioPath);
  
  return {
    storagePath: audioPath,
    publicUrl: urlData.publicUrl
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentId } = await req.json();
    console.log('Processing video audio extraction for content:', contentId);

    if (!contentId) {
      throw new Error('Missing contentId');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update processing status to 'processing'
    await supabase
      .from('content')
      .update({ processing_status: 'processing' })
      .eq('id', contentId);

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error(`Content not found: ${contentError?.message}`);
    }

    console.log('Content found:', {
      id: content.id,
      type: content.type,
      storage_path: content.storage_path,
      metadata: content.metadata
    });

    // Get the video file from storage
    const videoUrl = content.storage_path;
    if (!videoUrl) {
      throw new Error('No video file path found');
    }

    // Download the video file
    console.log('Downloading video file from:', videoUrl);
    const videoResponse = await fetch(videoUrl);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    console.log('Video downloaded, size:', videoBuffer.byteLength, 'bytes');

    // Extract audio from video
    const audioResult = await extractAudioFromVideo(videoBuffer, content.filename || 'video.mp4');
    
    let recordingData;
    let audioUrl;
    
    if (audioResult.useDirectVideo) {
      // Use direct video processing - don't upload separate audio file
      console.log('Using direct video processing approach');
      audioUrl = videoUrl; // Use original video URL for Whisper
      
      // Create or get recording entry
      const { data: existingRecording } = await supabase
        .from('recordings')
        .select('*')
        .eq('content_id', contentId)
        .single();
      
      if (existingRecording) {
        recordingData = existingRecording;
      } else {
        const { data: newRecording, error: recordingError } = await supabase
          .from('recordings')
          .insert({
            content_id: contentId,
            audio_file_path: videoUrl, // Store video URL as audio path for now
            processing_status: 'processing',
            transcription_status: 'pending'
          })
          .select()
          .single();
        
        if (recordingError) {
          throw new Error(`Failed to create recording: ${recordingError.message}`);
        }
        recordingData = newRecording;
      }
    } else {
      // Upload extracted audio to storage
      const uploadResult = await uploadAudioToStorage(
        audioResult.buffer,
        contentId,
        content.filename || 'video.mp4'
      );
      
      audioUrl = uploadResult.publicUrl;
      
      // Create or update recording entry
      const { data: newRecording, error: recordingError } = await supabase
        .from('recordings')
        .upsert({
          content_id: contentId,
          audio_file_path: uploadResult.publicUrl,
          processing_status: 'processing',
          transcription_status: 'pending'
        })
        .select()
        .single();
      
      if (recordingError) {
        throw new Error(`Failed to create/update recording: ${recordingError.message}`);
      }
      recordingData = newRecording;
    }

    console.log('Starting audio transcription...');
    
    // Send audio file to transcription service
    const transcriptionResponse = await supabase.functions.invoke('audio-transcription', {
      body: {
        audioFileUrl: audioUrl,
        recordingId: recordingData.id,
        contentId: contentId,
        isRealTime: false,
        originalFileName: content.filename || 'video.mp4',
        isVideoContent: audioResult.useDirectVideo
      }
    });

    if (transcriptionResponse.error) {
      console.error('Transcription request failed:', transcriptionResponse.error);
      
      // Update status to failed
      await supabase
        .from('content')
        .update({ processing_status: 'failed' })
        .eq('id', contentId);
      
      await supabase
        .from('recordings')
        .update({ 
          processing_status: 'failed',
          transcription_status: 'failed'
        })
        .eq('id', recordingData.id);
        
      throw new Error(`Audio transcription failed: ${transcriptionResponse.error.message}`);
    }

    console.log('Video processing pipeline initiated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processing pipeline started successfully',
        contentId: contentId,
        recordingId: recordingData.id,
        audioUrl: audioUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-video-audio function:', error);
    
    // Update processing status to failed
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { contentId } = await req.json().catch(() => ({}));
      
      if (contentId) {
        await supabase
          .from('content')
          .update({ 
            processing_status: 'failed',
            text_content: `Video processing failed: ${error.message}`
          })
          .eq('id', contentId);
      }
    } catch (updateError) {
      console.error('Failed to update processing status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Video audio extraction failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});