import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationId: string;
  roomId: string;
  roomContent?: Array<{
    id: string;
    title: string;
    type: string;
    text_content?: string;
  }>;
  conversationHistory?: Array<{
    content: string;
    sender_type: 'user' | 'ai';
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      message,
      conversationId,
      roomId,
      roomContent = [],
      conversationHistory = []
    }: ChatRequest = await req.json();

    // Validate required fields
    if (!message || !conversationId || !roomId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: message, conversationId, or roomId' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get API keys from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API key not configured',
          response: "I'm having trouble connecting to the AI service. Please contact support."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No authorization header' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authentication failed' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build room context from available content
    let roomContext = '';
    if (roomContent.length > 0) {
      roomContext = '\n\n## Available Study Materials:\n';
      
      for (const content of roomContent) {
        roomContext += `\n### ${content.title} (${content.type})\n`;
        
        if (content.text_content) {
          // Chunk large content to fit context window
          const maxChunkSize = 2000;
          const textContent = content.text_content.substring(0, maxChunkSize);
          roomContext += `${textContent}${content.text_content.length > maxChunkSize ? '...' : ''}\n`;
        }
      }
    }

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = '\n\n## Recent Conversation:\n';
      // Take last 10 messages to stay within context limits
      const recentHistory = conversationHistory.slice(-10);
      
      for (const msg of recentHistory) {
        const role = msg.sender_type === 'user' ? 'Student' : 'AI Tutor';
        conversationContext += `${role}: ${msg.content}\n`;
      }
    }

    // Create system prompt
    const systemPrompt = `You are an AI tutor helping students learn from their study materials. You have access to the student's room content and should use it to provide accurate, helpful responses.

## Instructions:
- Answer questions based on the provided study materials when relevant
- If asked about content not in the materials, politely explain what you can help with
- Provide clear, educational explanations
- Ask clarifying questions when needed
- Be encouraging and supportive
- Keep responses concise but thorough

${roomContext}${conversationContext}

Current student question: ${message}`;

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      {
        role: 'user' as const,
        content: message
      }
    ];

    console.log('Calling OpenAI with model: o4-mini-2025-04-16');

    // Call OpenAI API with primary model
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o4-mini-2025-04-16',
          messages,
          max_completion_tokens: 1000,
          temperature: 0.3,
        }),
      });
    } catch (error) {
      console.error('Primary model failed, trying fallback:', error);
      
      // Fallback to o3-mini for complex reasoning
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'o3-2025-04-16',
          messages,
          max_completion_tokens: 1000,
          temperature: 0.3,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OpenAI API error',
          response: "I'm having trouble processing your request right now. Please try again in a moment."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('No response from OpenAI:', aiData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No response from AI',
          response: "I'm sorry, I didn't receive a proper response. Please try asking your question again."
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Store AI response in database
    try {
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          content: aiResponse,
          sender_type: 'ai',
          metadata: {
            model: aiData.model || 'o4-mini-2025-04-16',
            room_id: roomId,
            generated_at: new Date().toISOString()
          }
        });

      if (insertError) {
        console.error('Error storing AI response:', insertError);
        // Don't fail the request, just log the error
      }
    } catch (dbError) {
      console.error('Database storage error:', dbError);
      // Continue with response even if storage fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in openai-room-chat:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        response: "I'm sorry, something went wrong. Please try again, and if the problem persists, contact support."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});