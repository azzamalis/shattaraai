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
    
    if (!contentId) {
      throw new Error('Missing contentId');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the content with transcript
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('text_content, metadata')
      .eq('id', contentId)
      .single();
    
    if (contentError || !content) {
      throw new Error(`Content not found: ${contentError?.message}`);
    }
    
    if (!content.text_content) {
      throw new Error('No transcript found for this content');
    }
    
    console.log('Manually triggering chapter generation for content:', contentId);
    console.log('Transcript length:', content.text_content.length);
    
    // Trigger chapter generation
    const chapterResponse = await supabase.functions.invoke('generate-chapters', {
      body: {
        contentId: contentId,
        transcript: content.text_content,
        duration: content.metadata?.duration || 0
      }
    });
    
    console.log('Chapter generation response:', chapterResponse);
    
    if (chapterResponse.error) {
      console.error('Chapter generation failed:', chapterResponse.error);
      throw new Error(`Chapter generation failed: ${chapterResponse.error.message}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Chapter generation triggered successfully',
        contentId: contentId,
        transcriptLength: content.text_content.length,
        response: chapterResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in test-chapters function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Chapter generation test failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});