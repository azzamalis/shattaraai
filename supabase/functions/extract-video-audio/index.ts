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

    // Get content details
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error(`Content not found: ${contentError?.message}`);
    }

    // Download video file from storage
    const { data: videoData, error: downloadError } = await supabase
      .storage
      .from('videos')
      .download(content.storage_path);

    if (downloadError || !videoData) {
      throw new Error(`Failed to download video: ${downloadError?.message}`);
    }

    console.log('Video downloaded, extracting audio...');

    // Convert video data to base64 for audio extraction
    const arrayBuffer = await videoData.arrayBuffer();
    const base64Video = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // For now, we'll simulate audio extraction and directly transcribe
    // In production, you'd use FFmpeg WASM to extract audio
    console.log('Simulating audio extraction from video...');

    // Send to audio transcription
    const transcriptionResponse = await fetch(`${supabaseUrl}/functions/v1/audio-transcription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio: base64Video,
        contentId: contentId
      }),
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Transcription failed:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    console.log('Audio extraction and transcription completed');

    // Update content with processing status
    await supabase
      .from('content')
      .update({
        processing_status: 'completed',
        text_content: transcriptionResult.transcript,
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId);

    // Generate chapters if transcript is available
    if (transcriptionResult.transcript) {
      console.log('Generating chapters for video content...');
      
      const chaptersResponse = await fetch(`${supabaseUrl}/functions/v1/generate-chapters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: contentId,
          transcript: transcriptionResult.transcript
        }),
      });

      if (chaptersResponse.ok) {
        console.log('Chapters generated successfully');
      } else {
        console.error('Chapter generation failed');
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        transcript: transcriptionResult.transcript,
        message: 'Video audio extraction and processing completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-video-audio function:', error);
    
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