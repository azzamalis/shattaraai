import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { contentId } = await req.json();

    if (!contentId) {
      throw new Error('Content ID is required');
    }

    console.log(`Fixing status for content ${contentId}`);

    // Check current content status
    const { data: content, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (fetchError) {
      console.error('Error fetching content:', fetchError);
      throw fetchError;
    }

    console.log('Current content status:', {
      id: content.id,
      processing_status: content.processing_status,
      has_text: !!content.text_content,
      has_chapters: !!content.chapters
    });

    // If content has text but status is processing, update to completed
    if (content.text_content && content.text_content.trim() && content.processing_status === 'processing') {
      const { error: updateError } = await supabase
        .from('content')
        .update({ 
          processing_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId);

      if (updateError) {
        console.error('Error updating content status:', updateError);
        throw updateError;
      }

      console.log(`Successfully updated content ${contentId} status to completed`);

      // If no chapters exist, trigger chapter generation
      if (!content.chapters) {
        const { error: chapterError } = await supabase.functions.invoke('generate-chapters', {
          body: { contentId }
        });

        if (chapterError) {
          console.error('Error triggering chapter generation:', chapterError);
        } else {
          console.log(`Chapter generation triggered for content ${contentId}`);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Content status updated to completed',
          contentId,
          triggered_chapters: !content.chapters
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'No status update needed',
          contentId,
          current_status: content.processing_status,
          has_text: !!content.text_content
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in fix-content-status function:', error);
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