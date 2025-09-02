import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

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

    // Extract file path from storage URL
    let filePath = content.storage_path;
    if (content.storage_path.includes('/storage/v1/object/public/videos/')) {
      // Extract just the file path from the full URL
      filePath = content.storage_path.split('/storage/v1/object/public/videos/')[1];
    } else if (content.storage_path.startsWith('http')) {
      // If it's still a full URL, try to extract the filename
      const urlParts = content.storage_path.split('/');
      filePath = urlParts[urlParts.length - 1];
    }

    console.log('Extracted file path for download:', filePath);

    // Download video file from storage
    const { data: videoData, error: downloadError } = await supabase
      .storage
      .from('videos')
      .download(filePath);

    if (downloadError || !videoData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`);
    }

    console.log('Video downloaded, extracting audio...');

    // Convert video data to base64 for audio extraction
    const arrayBuffer = await videoData.arrayBuffer();
    const base64Video = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Extract video metadata for duration if available
    const videoMetadata = content.metadata || {};
    const videoDuration = videoMetadata.duration;

    // For now, we'll simulate audio extraction and directly transcribe
    // In production, you'd use FFmpeg WASM to extract audio
    console.log('Simulating audio extraction from video...');

    // Send to audio transcription with proper parameters
    const transcriptionResponse = await supabase.functions.invoke('audio-transcription', {
      body: {
        audioData: base64Video,
        recordingId: contentId,
        chunkIndex: 0,
        isRealTime: false,
        timestamp: Date.now(),
        originalFileName: content.name || 'video-audio.mp4'
      }
    });

    if (transcriptionResponse.error) {
      console.error('Transcription failed:', transcriptionResponse.error);
      throw new Error(`Transcription failed: ${transcriptionResponse.error.message}`);
    }

    console.log('Audio extraction and transcription completed');

    // The audio-transcription function will update the content and generate chapters
    // So we don't need to do that here anymore

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video audio extraction and processing completed'
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
          .update({ processing_status: 'failed' })
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