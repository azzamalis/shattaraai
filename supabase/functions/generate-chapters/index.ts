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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // ========== SECURITY: Check for service role or JWT Authentication ==========
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let isServiceRoleCall = false;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      
      // Check if this is a service role call (from another edge function)
      if (token === supabaseServiceKey) {
        isServiceRoleCall = true;
        console.log('Service role call detected - bypassing JWT validation');
      } else {
        // Validate user JWT
        const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } }
        });
        
        const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
        
        if (claimsError || !claimsData?.claims) {
          console.error('JWT validation failed:', claimsError?.message);
          return new Response(
            JSON.stringify({ error: 'Unauthorized', success: false }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        userId = claimsData.claims.sub as string;
        console.log('Authenticated user:', userId);
      }
    } else {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create service client for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ========== RATE LIMITING (skip for service role calls) ==========
    if (!isServiceRoleCall && userId) {
      const { data: rateCheck, error: rateError } = await supabase.rpc('check_rate_limit', {
        user_uuid: userId,
        request_type: 'chat',
        estimated_tokens: 1000
      });

      if (rateError) {
        console.error('Rate limit check error:', rateError);
      } else if (rateCheck && rateCheck.length > 0 && !rateCheck[0].allowed) {
        console.log('Rate limit exceeded for user:', userId);
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded',
            success: false,
            reset_time: rateCheck[0].reset_time
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // ========== Parse Request ==========
    const { contentId, transcript, duration } = await req.json();

    if (!contentId || !transcript) {
      throw new Error('Missing content ID or transcript');
    }

    // Verify content exists and get metadata
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('metadata, user_id, chapters_attempts')
      .eq('id', contentId)
      .single();

    if (contentError) {
      console.error('Error fetching content data:', contentError);
      throw new Error('Content not found');
    }

    // For non-service-role calls, verify user owns the content
    if (!isServiceRoleCall && contentData.user_id !== userId) {
      console.error('User does not own content:', { userId, contentUserId: contentData.user_id });
      return new Response(
        JSON.stringify({ error: 'Forbidden', success: false }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // For service role calls, set userId from content for logging
    if (isServiceRoleCall) {
      userId = contentData.user_id;
    }

    // Update chapters_status to processing and increment attempt counter
    await supabase
      .from('content')
      .update({
        chapters_status: 'processing',
        last_chapters_attempt: new Date().toISOString(),
        chapters_error: null, // Clear previous error
        chapters_attempts: (contentData.chapters_attempts || 0) + 1
      })
      .eq('id', contentId);

    // Extract duration from metadata if available
    const actualDuration = duration || contentData?.metadata?.duration;
    const durationText = actualDuration ? ` (Total duration: ${Math.floor(actualDuration / 60)}:${String(Math.floor(actualDuration % 60)).padStart(2, '0')})` : '';

    console.log(`Generating chapters for content ${contentId} by user ${userId}`);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured');
    }

    console.log('OpenAI API key found, generating chapters with gpt-4.1-mini');

    // Generate chapters using gpt-4.1-mini for chat completions (consistent with YouTube chapter generation)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
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
      let responseText = result.choices[0].message.content;
      console.log('Raw chapter generation response:', responseText);
      
      // Remove markdown code blocks if present
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*|\s*```/g, '').trim();
      }
      
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

    // Update content with generated chapters and granular status
    const { error: updateError } = await supabase
      .from('content')
      .update({
        chapters: chapters,
        processing_status: 'completed',
        chapters_status: 'completed', // Granular status
        chapters_error: null, // Clear any previous error
        updated_at: new Date().toISOString()
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating content with chapters:', updateError);
      throw new Error('Failed to update content with chapters');
    }

    console.log(`Successfully generated ${chapters.length} chapters for content ${contentId} by user ${userId}`);

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
    
    // Update chapters_status to failed with error details
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { contentId } = await req.clone().json().catch(() => ({}));
      
      if (contentId) {
        await supabase
          .from('content')
          .update({
            chapters_status: 'failed',
            chapters_error: error.message || 'Unknown chapter generation error'
          })
          .eq('id', contentId);
      }
    } catch (updateError) {
      console.error('Failed to update chapters status:', updateError);
    }
    
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
