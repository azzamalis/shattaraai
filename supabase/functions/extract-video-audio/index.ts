import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    console.log('Starting real video audio extraction...');
    
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

    // Use a simpler approach - send video file directly to transcription service
    // This approach works in Deno environment without requiring Web Workers
    try {
      console.log('Processing video file for transcription...');
      
      // Convert video buffer to base64 for transmission
      const videoData = new Uint8Array(videoBuffer);
      
      // Convert to base64 in chunks to avoid memory issues
      let base64Video = '';
      const chunkSize = 0x8000; // 32KB chunks
      
      for (let i = 0; i < videoData.length; i += chunkSize) {
        const chunk = videoData.slice(i, i + chunkSize);
        let chunkString = '';
        for (let j = 0; j < chunk.length; j++) {
          chunkString += String.fromCharCode(chunk[j]);
        }
        base64Video += btoa(chunkString);
      }
      
      console.log('Video data prepared for transcription, size:', videoData.length, 'bytes');
      
      // Get video duration from metadata
      let videoDuration = content.metadata?.duration || 0;
      
      // Update the content with processing metadata
      const videoMetadata = {
        ...(content.metadata || {}),
        videoProcessing: true,
        processedAt: new Date().toISOString(),
        processingMethod: 'direct_video_transcription',
        originalFileSize: videoBuffer.byteLength
      };

      await supabase
        .from('content')
        .update({ 
          metadata: videoMetadata,
          processing_status: 'processing'
        })
        .eq('id', contentId);

      console.log('Starting video transcription...');

      // Send the video data directly to transcription service
      const transcriptionResponse = await supabase.functions.invoke('audio-transcription', {
        body: {
          audioData: base64Video,
          recordingId: contentId,
          chunkIndex: 0,
          isRealTime: false,
          timestamp: Date.now(),
          originalFileName: content.filename || 'video.mp4',
          isVideoContent: true,
          videoDuration: videoDuration,
          requestWordTimestamps: true
        }
      });

      if (transcriptionResponse.error) {
        console.error('Transcription request failed:', transcriptionResponse.error);
        
        // Update status to failed
        await supabase
          .from('content')
          .update({ processing_status: 'failed' })
          .eq('id', contentId);
          
        throw new Error(`Audio transcription failed: ${transcriptionResponse.error.message}`);
      }

      console.log('Video processing pipeline initiated successfully');
    } catch (processingError) {
      console.error('Error during video processing:', processingError);
      
      // Update status to failed
      await supabase
        .from('content')
        .update({ 
          processing_status: 'failed',
          text_content: `Video processing error: ${processingError.message}`
        })
        .eq('id', contentId);
        
      throw processingError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Video processing pipeline started successfully',
        contentId: contentId
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