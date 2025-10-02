import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationId?: string;
  contextId?: string;
  conversationHistory?: Array<{
    content: string;
    sender_type: 'user' | 'ai';
  }>;
}

serve(async (req) => {
  console.log('Chat content request received');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const requestData: ChatRequest = await req.json();
    const { message, conversationId, contextId, conversationHistory = [] } = requestData;

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API keys and initialize clients
    const openaiApiKey = Deno.env.get('OPENAI_CHAT_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openaiApiKey) {
      console.error('Missing OPENAI_CHAT_API_KEY');
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Database configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    // Check rate limits
    const { data: rateLimitResult, error: rateLimitError } = await supabase.rpc(
      'check_rate_limit',
      {
        user_uuid: user.id,
        request_type: 'chat',
        estimated_tokens: 1000
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitResult && rateLimitResult.length > 0 && !rateLimitResult[0].allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          remaining_requests: rateLimitResult[0].remaining_requests,
          reset_time: rateLimitResult[0].reset_time
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build conversation context for better AI responses
    const conversationContext = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Create optimized system prompt for educational chat
    const systemPrompt = `You are an intelligent AI tutor assistant designed to help students learn effectively. Your role is to:

1. **Educational Support**: Provide clear, helpful explanations on academic topics
2. **Learning Guidance**: Help students understand concepts step-by-step
3. **Study Assistance**: Offer study strategies, tips, and methodologies
4. **Problem Solving**: Guide students through problem-solving processes
5. **Motivation**: Encourage and support students in their learning journey

**Guidelines:**
- Keep responses educational and supportive
- Break down complex concepts into understandable parts
- Ask clarifying questions when needed
- Provide examples and analogies to aid understanding
- Encourage critical thinking and active learning
- Be patient and encouraging
- Focus on helping students learn rather than just giving answers

**Communication Style:**
- Friendly and approachable
- Clear and concise
- Age-appropriate language
- Encouraging and positive tone

**IMPORTANT - File Attachments:**
When users attach files (PDFs, documents, images, etc.), the file content is automatically extracted and included directly in their message. You have direct access to this content - it's already provided to you inline. Analyze the provided content and respond based on what's given. Never say you cannot access attachments.

**IMPORTANT - Response Formatting:**
Please format your responses using proper Markdown syntax:
- Use # for main headings, ## for subheadings, ### for smaller headings
- Use **bold** for emphasis and *italic* for emphasis
- Use bullet points with - or * for lists
- Use 1. 2. 3. for numbered lists
- Use > for blockquotes
- Use \`code\` for inline code and \`\`\`language\ncode\n\`\`\` for code blocks
- Use proper paragraphs separated by line breaks
- Structure your response to be clear, well-organized, and easy to read

Respond to the student's question or message below:`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext,
      { role: 'user', content: message }
    ];

    // Define model hierarchy for chat content
    const models = [
      'gpt-4.1-2025-04-14',      // Primary: Best for complex educational explanations
      'gpt-4.1-mini-2025-04-14', // Secondary: Fast and efficient for most queries
      'gpt-4.1-nano-2025-04-14'  // Fallback: Quick responses for simple questions
    ];

    let aiResponse = '';
    let usedModel = '';
    let lastError = null;

    // Try each model in sequence
    for (const model of models) {
      try {
        console.log(`Attempting to use model: ${model}`);
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            max_completion_tokens: 1000,
            // Note: temperature not included for newer models
          }),
        });

        if (!openaiResponse.ok) {
          const errorText = await openaiResponse.text();
          console.error(`Model ${model} failed:`, errorText);
          lastError = new Error(`OpenAI API error: ${errorText}`);
          continue;
        }

        const data = await openaiResponse.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          aiResponse = data.choices[0].message.content;
          usedModel = model;
          console.log(`AI response generated successfully with model: ${model}`);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        lastError = error;
        continue;
      }
    }

    // If all models failed, provide fallback response
    if (!aiResponse) {
      console.error('All models failed, providing fallback response');
      aiResponse = "I'm sorry, I'm having some technical difficulties right now. Please try asking your question again in a moment, or feel free to rephrase it if you'd like.";
      usedModel = 'fallback';
    }

    // Note: Message storage is handled by the client-side addAIResponse function
    // to prevent duplicate entries. The edge function only generates the AI response.

    // Track AI usage
    try {
      await supabase
        .from('ai_usage_counters')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          chat_requests: 1
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });
    } catch (error) {
      console.error('Error tracking usage:', error);
      // Don't fail the request if usage tracking fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        model_used: usedModel,
        context_id: contextId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat content function:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        success: false,
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});