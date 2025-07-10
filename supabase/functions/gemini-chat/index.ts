
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

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
    const { message, conversationId, roomId, roomContent = [], conversationHistory = [] }: ChatRequest = await req.json();

    if (!message || !conversationId || !roomId) {
      throw new Error('Missing required fields: message, conversationId, or roomId');
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build context from room content
    const roomContext = roomContent.map(content => 
      `${content.title} (${content.type}): ${content.text_content || 'No text content available'}`
    ).join('\n\n');

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI Tutor'}: ${msg.content}`)
      .join('\n');

    // Construct the system prompt
    const systemPrompt = `You are Shattara AI Tutor, an intelligent educational assistant helping students learn from their study materials. You are currently in a study room where the student has organized their learning content.

Room Content Available:
${roomContext || 'No content available in this room yet.'}

Recent Conversation:
${conversationContext || 'This is the start of the conversation.'}

Instructions:
- Be helpful, encouraging, and educational
- Reference the room content when relevant to answer questions
- Provide explanations at an appropriate academic level
- Help students understand concepts rather than just giving answers
- If the room has no content, encourage the student to add study materials
- Keep responses concise but informative
- Use a friendly, supportive tone`;

    // Prepare the Gemini API request
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nStudent Question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = geminiData.candidates[0].content.parts[0].text;

    // Store AI response in the database
    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        content: aiResponse,
        sender_type: 'ai',
        message_type: 'ai_response',
        metadata: {
          model: 'gemini-1.5-flash-latest',
          room_id: roomId,
          generated_at: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store AI response');
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    
    // Return a fallback response
    const fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me anything about your study materials!";
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        success: false,
        error: error.message 
      }),
      {
        status: 200, // Return 200 to avoid breaking the chat flow
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
