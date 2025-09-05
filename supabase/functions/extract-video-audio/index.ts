import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { FFmpeg } from 'https://esm.sh/@ffmpeg/ffmpeg@0.12.10';
import { fetchFile, toBlobURL } from 'https://esm.sh/@ffmpeg/util@0.12.1';

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

    // Extract audio using FFmpeg WASM
    try {
      console.log('Initializing FFmpeg for audio extraction...');
      
      // Initialize FFmpeg
      const ffmpeg = new FFmpeg();
      
      // Load FFmpeg with proper WASM and worker URLs
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });
      
      console.log('FFmpeg loaded successfully');
      
      // Write input video file to FFmpeg filesystem
      const inputFileName = 'input_video.mp4';
      const outputFileName = 'output_audio.wav';
      
      await ffmpeg.writeFile(inputFileName, await fetchFile(new Blob([videoBuffer])));
      console.log('Video file written to FFmpeg filesystem');
      
      // Extract audio from video with optimized settings for Whisper
      // WAV format, 16kHz sample rate, mono channel for best Whisper compatibility
      await ffmpeg.exec([
        '-i', inputFileName,
        '-vn', // No video
        '-acodec', 'pcm_s16le', // 16-bit PCM
        '-ar', '16000', // 16kHz sample rate (Whisper optimal)
        '-ac', '1', // Mono channel
        '-f', 'wav', // WAV format
        outputFileName
      ]);
      
      console.log('Audio extraction completed');
      
      // Read the extracted audio file
      const audioData = await ffmpeg.readFile(outputFileName);
      const audioUint8Array = new Uint8Array(audioData as ArrayBuffer);
      
      // Convert to base64 for transmission
      let base64Audio = '';
      const chunkSize = 0x8000; // 32KB chunks
      
      for (let i = 0; i < audioUint8Array.length; i += chunkSize) {
        const chunk = audioUint8Array.slice(i, i + chunkSize);
        let chunkString = '';
        for (let j = 0; j < chunk.length; j++) {
          chunkString += String.fromCharCode(chunk[j]);
        }
        base64Audio += btoa(chunkString);
      }
      
      // Get video duration from FFmpeg metadata
      let videoDuration = content.metadata?.duration || 0;
      
      // Clean up FFmpeg instance
      ffmpeg.terminate();
      
      console.log('Audio extraction completed, size:', audioUint8Array.length, 'bytes');
      
      // Update the content with extraction metadata
      const videoMetadata = {
        ...(content.metadata || {}),
        audioExtracted: true,
        extractedAt: new Date().toISOString(),
        processingMethod: 'ffmpeg_wasm',
        audioFormat: 'wav_16khz_mono',
        duration: videoDuration,
        originalFileSize: videoBuffer.byteLength,
        extractedAudioSize: audioUint8Array.length
      };

      await supabase
        .from('content')
        .update({ 
          metadata: videoMetadata,
          processing_status: 'processing'
        })
        .eq('id', contentId);

      console.log('Starting real audio transcription for video content...');

      // Send the actual extracted audio data to transcription
      const transcriptionResponse = await supabase.functions.invoke('audio-transcription', {
        body: {
          audioData: base64Audio,
          recordingId: contentId,
          chunkIndex: 0,
          isRealTime: false,
          timestamp: Date.now(),
          originalFileName: content.filename || 'video-audio.mp4',
          isVideoContent: true,
          videoDuration: videoDuration,
          requestWordTimestamps: true // Request word-level timestamps
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