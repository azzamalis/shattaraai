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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentId, transcript, duration } = await req.json();

    if (!contentId || !transcript) {
      throw new Error('Missing content ID or transcript');
    }

    // Get content data to check for duration if not provided
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('metadata')
      .eq('id', contentId)
      .single();

    if (contentError) {
      console.error('Error fetching content data:', contentError);
    }

    // Extract duration from metadata if available
    const actualDuration = duration || contentData?.metadata?.duration;
    const durationText = actualDuration ? ` (Total duration: ${Math.floor(actualDuration / 60)}:${String(Math.floor(actualDuration % 60)).padStart(2, '0')})` : '';

    console.log(`Generating chapters for content ${contentId}`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    console.log('OpenAI API key found, generating chapters with gpt-4o-mini');

    // Generate chapters using gpt-4o-mini for chat completions
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert content analyzer. Generate meaningful chapters for the provided transcript${durationText}. 
            Return a JSON array of chapters with this exact structure:
            [
              {
                "id": "chapter-1",
                "title": "Chapter Title",
                "startTime": 0,
                "endTime": 120,
                "summary": "Brief summary of this chapter content"
              }
            ]
            
            Guidelines:
            - Create 3-8 chapters depending on content length
            - Use descriptive titles that capture the main topic
            - Ensure chapters don't overlap
            - Provide meaningful summaries
            - IMPORTANT: All timestamps must be within the actual duration${actualDuration ? ` (${actualDuration} seconds max)` : ''}
            - Chapters should cover the entire content duration proportionally
            - Return only the JSON array, no additional text`
          },
          {
            role: 'user',
            content: `Please analyze this transcript and create chapters${durationText}:\n\n${transcript}`
          }
        ],
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('OpenAI chapter generation response received');

    let chapters;
    try {
      // Parse the response - it should be a JSON array of chapters
      const responseText = result.choices[0].message.content;
      console.log('Raw chapter generation response:', responseText);
      
      // Try to parse as JSON array directly first
      try {
        chapters = JSON.parse(responseText);
      } catch (directParseError) {
        // If direct parsing fails, try to extract from a JSON object
        const parsedObject = JSON.parse(responseText);
        chapters = parsedObject.chapters || parsedObject;
      }
      
      // Ensure we have an array
      if (!Array.isArray(chapters)) {
        throw new Error('Generated chapters is not an array');
      }
    } catch (parseError) {
      console.error('Error parsing chapters JSON:', parseError);
      throw new Error('Failed to parse generated chapters');
      }

      // Validate and fix timestamps to ensure they don't exceed the actual duration
      if (actualDuration) {
        chapters = chapters.map((chapter, index) => {
          const maxEndTime = actualDuration;
          const adjustedStartTime = Math.min(chapter.startTime || 0, maxEndTime);
          const adjustedEndTime = Math.min(chapter.endTime || maxEndTime, maxEndTime);
          
          return {
            ...chapter,
            startTime: adjustedStartTime,
            endTime: adjustedEndTime > adjustedStartTime ? adjustedEndTime : maxEndTime
          };
        });
      }

    // Update content with generated chapters
    const { error: updateError } = await supabase
      .from('content')
      .update({
        chapters: chapters,
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating content with chapters:', updateError);
      throw new Error('Failed to update content with chapters');
    }

    console.log(`Successfully generated ${chapters.length} chapters for content ${contentId}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        chapters,
        contentId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-chapters function:', error);
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