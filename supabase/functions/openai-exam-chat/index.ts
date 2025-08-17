import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExamChatRequest {
  message: string;
  examId: string;
  questionId?: number;
  contentId?: string;
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
      conversationHistory = []
    }: ExamChatRequest = await req.json();

    // Validate required fields
    if (!message || !examId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: message or examId' 
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

    // Get exam data with questions
    console.log('Looking for exam with ID:', examId);
    console.log('User ID:', user.id);
    
    const { data: examData, error: examError } = await supabase
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

    console.log('Exam query result:', { examData, examError });

    if (examError || !examData) {
      console.error('Error fetching exam data:', examError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Exam not found or access denied',
          debug: {
            examId,
            userId: user.id,
            examError: examError?.message,
            foundData: !!examData
          }
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get exam questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('exam_questions')
      .select('*')
      .eq('exam_id', examId)
      .order('order_index');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
    }

    // Get content data if contentId is provided
    let contentData = null;
    if (contentId) {
      const { data, error } = await supabase
        .from('content')
        .select('id, title, type, text_content')
        .eq('id', contentId)
        .single();
      
      if (!error && data) {
        contentData = data;
      }
    }

    // Build context from exam and content
    let examContext = `## Exam Information:
**Exam Title:** ${examData.title}
**Room:** ${examData.rooms?.name || 'Unknown Room'}
**Total Questions:** ${questionsData?.length || 0}
`;

    // Add specific question context if questionId is provided
    if (questionId && questionsData) {
      const specificQuestion = questionsData.find(q => q.order_index === questionId - 1); // Convert 1-based to 0-based index
      if (specificQuestion) {
        examContext += `

## Current Question Context:
**Question ${questionId}:** ${specificQuestion.question_text}
`;
        if (specificQuestion.question_type === 'multiple_choice' && specificQuestion.options) {
          examContext += `**Options:**
${specificQuestion.options.map((opt: string, idx: number) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n')}
`;
        }
        if (specificQuestion.correct_answer !== null) {
          examContext += `**Correct Answer:** ${specificQuestion.correct_answer}
`;
        }
        if (specificQuestion.explanation) {
          examContext += `**Explanation:** ${specificQuestion.explanation}
`;
        }
      }
    }

    // Add content context from the source material
    let contentContext = '';
    if (contentData && contentData.text_content) {
      contentContext = `

## Source Material:
**Content Title:** ${contentData.title} (${contentData.type})
**Content:**
${contentData.text_content.length > 3000 
  ? contentData.text_content.substring(0, 3000) + '...' 
  : contentData.text_content}
`;
    } else if (examData.rooms?.content && examData.rooms.content.length > 0) {
      contentContext = `

## Available Study Materials:
`;
      for (const content of examData.rooms.content) {
        contentContext += `**${content.title}** (${content.type})
`;
        if (content.text_content) {
          contentContext += `${content.text_content.length > 1500 
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

    // Create system prompt for exam-specific tutoring
    const systemPrompt = `You are an AI tutor specialized in helping students understand exam questions and the source material they were based on. You have access to the exam questions, correct answers, explanations, and the original study materials.

## Your Role:
- Help students understand exam questions and their correct answers
- Explain concepts from the source material that relate to the questions
- Provide additional context and examples to reinforce learning
- Answer follow-up questions about the material
- Be encouraging and supportive while being educational

## Instructions:
- Reference the source material when explaining concepts
- If discussing a specific question, explain why the correct answer is right and why wrong answers are incorrect
- Provide additional examples or analogies when helpful
- Ask clarifying questions if you need to understand what the student wants to learn
- Keep explanations clear and at an appropriate educational level
- When referencing content, mention the source material by title

${examContext}${contentContext}${conversationContext}

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

    console.log('Calling OpenAI for exam chat with model: o4-mini-2025-04-16');

    let aiResponse: string | null = null;
    let modelUsed = 'o4-mini-2025-04-16';

    // Try multiple models with fallback - Using o4-mini and o3-mini as requested
    const models = [
      { name: 'o4-mini-2025-04-16', maxTokens: 2000, useTemperature: false },
      { name: 'o3-2025-04-16', maxTokens: 3000, useTemperature: false },
      { name: 'gpt-4.1-2025-04-14', maxTokens: 3000, useTemperature: false },
      { name: 'gpt-4o-mini', maxTokens: 3000, useTemperature: true }
    ];

    for (const model of models) {
      try {
        console.log(`Trying model: ${model.name}`);
        
        const requestBody: any = {
          model: model.name,
          messages,
          max_completion_tokens: model.maxTokens,
        };

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
      aiResponse = `I apologize, but I'm having technical difficulties right now. Here's what I can help you with regarding your exam:

**Exam:** ${examData.title}
${questionsData && questionId ? `**Current Question:** Question ${questionId}` : ''}

**I can help you:**
• Understand exam questions and their correct answers
• Explain concepts from your study materials
• Provide additional context and examples
• Answer follow-up questions about the material

Please try asking your question again, or feel free to ask about any specific question from your exam!`;
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