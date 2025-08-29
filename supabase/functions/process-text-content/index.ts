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
    const { contentId, textContent } = await req.json();
    console.log('Processing text content for:', contentId);

    if (!contentId || !textContent) {
      throw new Error('Missing contentId or textContent');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get content details and user
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error(`Content not found: ${contentError?.message}`);
    }

    // Check rate limits
    const { data: rateLimitData } = await supabase
      .rpc('check_rate_limit', {
        user_uuid: content.user_id,
        request_type: 'chat',
        estimated_tokens: 2000
      });

    if (rateLimitData && !rateLimitData[0]?.allowed) {
      throw new Error('Rate limit exceeded');
    }

    console.log('Analyzing text content with AI...');

    const systemPrompt = `You are an AI assistant that analyzes text content and creates structured chapters and summaries.

For the given text content, perform the following analysis:

1. Create logical chapters with titles and summaries
2. Generate an overall summary of the content
3. Identify key themes and topics
4. Extract important insights

Return a JSON object in this exact format:
{
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter Title",
      "summary": "Detailed summary of the chapter content...",
      "startTime": 0,
      "endTime": 300
    }
  ],
  "summary": "Overall summary of the entire content...",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "insights": ["insight1", "insight2"]
}

Create meaningful chapters that break down the content logically. Use estimated reading time for startTime and endTime.`;

    let response;
    let model = 'gpt-4.1-2025-04-14';

    try {
      // Primary attempt with GPT-4.1
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Please analyze the following text content:\n\n${textContent.slice(0, 12000)}`
            }
          ],
          max_completion_tokens: 2500,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

    } catch (error) {
      console.log('Primary model failed, trying fallback model...', error.message);
      
      // Fallback to GPT-4.1-mini
      model = 'gpt-4.1-mini-2025-04-14';
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `Please analyze the following text content:\n\n${textContent.slice(0, 8000)}`
            }
          ],
          max_completion_tokens: 2000,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`Fallback OpenAI API error: ${response.status}`);
      }
    }

    const result = await response.json();
    console.log('Text content analysis completed with model:', model);

    if (!result.choices || !result.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const analysisContent = result.choices[0].message.content;
    let analysis;

    try {
      analysis = JSON.parse(analysisContent);
      
      if (!analysis.chapters || !Array.isArray(analysis.chapters)) {
        throw new Error('Invalid analysis format');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI analysis');
    }

    // Update content with analysis results
    const updateData: any = {
      chapters: analysis.chapters,
      processing_status: 'completed',
      updated_at: new Date().toISOString()
    };

    // Add metadata if available
    if (analysis.summary || analysis.keyTopics || analysis.insights) {
      updateData.metadata = {
        ...content.metadata,
        summary: analysis.summary,
        keyTopics: analysis.keyTopics,
        insights: analysis.insights,
        aiAnalysis: true
      };
    }

    await supabase
      .from('content')
      .update(updateData)
      .eq('id', contentId);

    // Update usage tracking
    await supabase
      .from('ai_usage_counters')
      .upsert({
        user_id: content.user_id,
        date: new Date().toISOString().split('T')[0],
        chat_requests: 1
      }, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    console.log('Text content processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        chapters: analysis.chapters,
        summary: analysis.summary,
        keyTopics: analysis.keyTopics,
        insights: analysis.insights,
        model_used: model,
        message: 'Text content processing completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-text-content function:', error);
    
    // Update content status to failed
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase
        .from('content')
        .update({
          processing_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', req.json().then(body => body.contentId).catch(() => null));
    } catch (updateError) {
      console.error('Failed to update content status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Text content processing failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});