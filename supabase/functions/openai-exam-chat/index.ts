import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExamChatRequest {
  message: string;
  examId?: string;
  questionId?: number;
  contentId?: string;
  roomId?: string;
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
      examId,
      questionId,
      contentId,
      roomId,
      conversationHistory = []
    }: ExamChatRequest = await req.json();

    // Validate required fields
    if (!message) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required field: message' 
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

    console.log('Processing exam chat request for user:', user.id);
    console.log('Request context:', { examId, contentId, roomId, questionId });

    // Check rate limits before processing
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        user_uuid: user.id,
        request_type: 'chat',
        estimated_tokens: 1000
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitData && rateLimitData.length > 0) {
      const rateLimit = rateLimitData[0];
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Daily chat limit reached. Plan: ${rateLimit.plan_type}. Resets at: ${rateLimit.reset_time}`,
            rateLimitInfo: {
              remaining: rateLimit.remaining_requests,
              resetTime: rateLimit.reset_time,
              planType: rateLimit.plan_type
            }
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Try to get context from multiple sources - exam, content, or room
    let examData = null;
    let questionsData = null;
    let contentData = null;
    let roomData = null;
    let contextSource = 'none';

    // 1. Try to get exam data if examId is provided
    if (examId) {
      console.log('Looking for exam with ID:', examId);
      
      const { data: examResult, error: examError } = await supabase
        .from('exams')
        .select(`
          id,
          title,
          room_id,
          content_metadata,
          rooms:room_id (
            id,
            name,
            content (
              id,
              title,
              type,
              text_content
            )
          )
        `)
        .eq('id', examId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!examError && examResult) {
        examData = examResult;
        contextSource = 'exam';
        console.log('Found exam data:', examData.title);

        // Get exam questions
        const { data: questionsResult, error: questionsError } = await supabase
          .from('exam_questions')
          .select('*')
          .eq('exam_id', examId)
          .order('order_index');

        if (!questionsError && questionsResult) {
          questionsData = questionsResult;
        }
      } else {
        console.log('Exam not found, trying fallback methods');
      }
    }

    // 2. If no exam data, try to get content data
    if (!examData && contentId) {
      console.log('Looking for content with ID:', contentId);
      
      const { data: contentResult, error: contentError } = await supabase
        .from('content')
        .select(`
          id,
          title,
          type,
          text_content,
          room_id,
          rooms:room_id (
            id,
            name
          )
        `)
        .eq('id', contentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!contentError && contentResult) {
        contentData = contentResult;
        contextSource = 'content';
        console.log('Found content data:', contentData.title);
      }
    }

    // 3. If no exam or content data, try to get room data
    if (!examData && !contentData && roomId) {
      console.log('Looking for room with ID:', roomId);
      
      const { data: roomResult, error: roomError } = await supabase
        .from('rooms')
        .select(`
          id,
          name,
          content (
            id,
            title,
            type,
            text_content
          )
        `)
        .eq('id', roomId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!roomError && roomResult) {
        roomData = roomResult;
        contextSource = 'room';
        console.log('Found room data:', roomData.name);
      }
    }

    console.log('Context source determined:', contextSource);

    // If we still have no context, return an error
    if (contextSource === 'none') {
      console.error('No context found for chat');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No accessible context found',
          debug: {
            examId,
            contentId,
            roomId,
            userId: user.id
          }
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build context based on what we found

    // Build context based on available data
    let contextInfo = '';
    
    if (contextSource === 'exam' && examData) {
      contextInfo = `## Exam Information:
**Exam Title:** ${examData.title}
**Room:** ${examData.rooms?.name || 'Unknown Room'}
**Total Questions:** ${questionsData?.length || 0}
`;
    } else if (contextSource === 'content' && contentData) {
      contextInfo = `## Content Information:
**Content Title:** ${contentData.title}
**Content Type:** ${contentData.type}
**Room:** ${contentData.rooms?.name || 'Unknown Room'}
`;
    } else if (contextSource === 'room' && roomData) {
      contextInfo = `## Room Information:
**Room Name:** ${roomData.name}
**Available Content Items:** ${roomData.content?.length || 0}
`;
    }

    // Add specific question context if questionId is provided and we have questions
    if (questionId && questionsData && questionsData.length > 0) {
      const specificQuestion = questionsData.find(q => q.order_index === questionId - 1); // Convert 1-based to 0-based index
      if (specificQuestion) {
        contextInfo += `

## Current Question Context:
**Question ${questionId}:** ${specificQuestion.question_text}
`;
        if (specificQuestion.question_type === 'multiple_choice' && specificQuestion.options) {
          contextInfo += `**Options:**
${specificQuestion.options.map((opt: string, idx: number) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}
`;
        }
        if (specificQuestion.correct_answer !== null) {
          contextInfo += `**Correct Answer:** ${specificQuestion.correct_answer}
`;
        }
        if (specificQuestion.explanation) {
          contextInfo += `**Explanation:** ${specificQuestion.explanation}
`;
        }
      }
    }

    // Add source material context
    let sourceContext = '';
    
    if (contextSource === 'content' && contentData?.text_content) {
      sourceContext = `

## Source Material:
**Content Title:** ${contentData.title} (${contentData.type})
**Content:**
${contentData.text_content.length > 3000 
  ? contentData.text_content.substring(0, 3000) + '...' 
  : contentData.text_content}
`;
    } else if (contextSource === 'exam' && examData?.rooms?.content && examData.rooms.content.length > 0) {
      sourceContext = `

## Available Study Materials:
`;
      for (const content of examData.rooms.content) {
        sourceContext += `**${content.title}** (${content.type})
`;
        if (content.text_content) {
          sourceContext += `${content.text_content.length > 1500 
            ? content.text_content.substring(0, 1500) + '...' 
            : content.text_content}

`;
        }
      }
    } else if (contextSource === 'room' && roomData?.content && roomData.content.length > 0) {
      sourceContext = `

## Available Study Materials:
`;
      for (const content of roomData.content) {
        sourceContext += `**${content.title}** (${content.type})
`;
        if (content.text_content) {
          sourceContext += `${content.text_content.length > 1500 
            ? content.text_content.substring(0, 1500) + '...' 
            : content.text_content}

`;
        }
      }
    }

    // Build conversation context
    let conversationContext = '';
    if (conversationHistory.length > 0) {
      conversationContext = `

## Previous Conversation:
`;
      // Take last 8 messages to stay within context limits
      const recentHistory = conversationHistory.slice(-8);
      
      for (const msg of recentHistory) {
        const role = msg.sender_type === 'user' ? 'Student' : 'AI Tutor';
        conversationContext += `${role}: ${msg.content}
`;
      }
    }

    // Create system prompt based on available context
    const systemPrompt = `You are an AI tutor helping students learn and understand their study materials. You have access to ${contextSource === 'exam' ? 'exam questions, answers, and' : ''} study materials.

## Your Role:
- Help students understand ${contextSource === 'exam' ? 'exam questions and their correct answers' : 'concepts from their study materials'}
- Explain concepts clearly and provide additional context
- Answer follow-up questions about the material
- Be encouraging and supportive while being educational
- Provide examples and analogies when helpful

## Instructions:
- Reference the available material when explaining concepts
${contextSource === 'exam' ? '- If discussing a specific question, explain why the correct answer is right and why wrong answers are incorrect' : ''}
- Ask clarifying questions if you need to understand what the student wants to learn
- Keep explanations clear and at an appropriate educational level
- When referencing content, mention the source material by title

${contextInfo}${sourceContext}${conversationContext}

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

    console.log(`Calling OpenAI for ${contextSource} chat with model: o4-mini-2025-04-16`);

    let aiResponse: string | null = null;
    let modelUsed = 'o4-mini-2025-04-16';

    // Try multiple models with fallback - Updated for correct parameter handling
    const models = [
      { name: 'o4-mini-2025-04-16', useMaxCompletionTokens: true, maxTokens: 2000, useTemperature: false },
      { name: 'o3-2025-04-16', useMaxCompletionTokens: true, maxTokens: 3000, useTemperature: false },
      { name: 'gpt-4.1-2025-04-14', useMaxCompletionTokens: true, maxTokens: 3000, useTemperature: false },
      { name: 'gpt-4o-mini', useMaxCompletionTokens: false, maxTokens: 3000, useTemperature: true }
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model.name}`);
        
        const requestBody: any = {
          model: model.name,
          messages,
        };

        // Use correct token parameter based on model
        if (model.useMaxCompletionTokens) {
          requestBody.max_completion_tokens = model.maxTokens;
        } else {
          requestBody.max_tokens = model.maxTokens;
        }

        // Only add temperature for models that support it
        if (model.useTemperature) {
          requestBody.temperature = 0.7;
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Model ${model.name} failed with status ${response.status}:`, errorData);
          continue;
        }

        const aiData = await response.json();
        const responseContent = aiData.choices?.[0]?.message?.content;

        if (responseContent && responseContent.trim().length > 0) {
          aiResponse = responseContent.trim();
          modelUsed = model.name;
          console.log(`Successfully got response from model: ${model.name}`);
          break;
        } else {
          console.error(`Model ${model.name} returned empty content:`, aiData);
          continue;
        }

      } catch (error) {
        console.error(`Error with model ${model.name}:`, error);
        continue;
      }
    }

    // Fallback response if all models fail
    if (!aiResponse) {
      console.error('All models failed to provide a response');
      
      let fallbackTitle = 'your study materials';
      if (contextSource === 'exam' && examData) {
        fallbackTitle = `your exam: ${examData.title}`;
      } else if (contextSource === 'content' && contentData) {
        fallbackTitle = `the content: ${contentData.title}`;
      } else if (contextSource === 'room' && roomData) {
        fallbackTitle = `the room: ${roomData.name}`;
      }
      
      aiResponse = `I apologize, but I'm having technical difficulties right now. Here's what I can help you with regarding ${fallbackTitle}:

${questionsData && questionId ? `**Current Question:** Question ${questionId}` : ''}

**I can help you:**
${contextSource === 'exam' ? '• Understand exam questions and their correct answers' : ''}
• Explain concepts from your study materials
• Provide additional context and examples
• Answer follow-up questions about the material

Please try asking your question again!`;
      modelUsed = 'fallback';
    }

    console.log(`Successfully generated exam chat response using ${modelUsed}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        response: aiResponse,
        model: modelUsed
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in openai-exam-chat:', error);
    
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