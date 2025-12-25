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
  contentData?: {
    id?: string;
    title?: string;
    type?: string;
    text_content?: string;
    chapters?: any[];
  };
  attachments?: Array<{
    name: string;
    type: string;
    content?: string;
  }>;
}

// Smart chunking function to extract relevant content
function createSmartChunks(text: string, contentType: string, maxChunkSize: number = 2500): string[] {
  if (!text || text.length <= maxChunkSize) {
    return text ? [text] : [];
  }

  const chunks: string[] = [];
  
  // For different content types, use different splitting strategies
  if (contentType === 'pdf' || contentType === 'file') {
    // Split by paragraphs or sections
    const sections = text.split(/\n\n+/);
    let currentChunk = '';
    
    for (const section of sections) {
      if ((currentChunk + section).length > maxChunkSize) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        currentChunk += '\n\n' + section;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
  } else {
    // Generic splitting for other content types
    let remaining = text;
    while (remaining.length > maxChunkSize) {
      // Find a good break point (end of sentence, paragraph, etc.)
      let breakPoint = remaining.lastIndexOf('. ', maxChunkSize);
      if (breakPoint === -1 || breakPoint < maxChunkSize * 0.5) {
        breakPoint = remaining.lastIndexOf(' ', maxChunkSize);
      }
      if (breakPoint === -1) {
        breakPoint = maxChunkSize;
      }
      chunks.push(remaining.substring(0, breakPoint + 1).trim());
      remaining = remaining.substring(breakPoint + 1);
    }
    if (remaining.trim()) chunks.push(remaining.trim());
  }
  
  return chunks;
}

// Create a summary of content for the AI context
function createContentSummary(chunks: string[], maxLength: number = 4000): string {
  if (chunks.length === 0) return '';
  
  // Take beginning, middle, and end portions for a representative summary
  const totalChunks = chunks.length;
  const selectedChunks: string[] = [];
  
  // Always include first chunk (intro/overview)
  if (chunks[0]) selectedChunks.push(chunks[0]);
  
  // Add middle chunks if available
  if (totalChunks > 2) {
    const midIndex = Math.floor(totalChunks / 2);
    selectedChunks.push(chunks[midIndex]);
  }
  
  // Add last chunk if different from first
  if (totalChunks > 1) {
    selectedChunks.push(chunks[totalChunks - 1]);
  }
  
  let summary = selectedChunks.join('\n\n---\n\n');
  
  // Truncate if still too long
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength) + '...';
  }
  
  return summary;
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
    const { 
      message, 
      conversationId, 
      contextId, 
      conversationHistory = [],
      contentData,
      attachments = []
    } = requestData;

    console.log('Request data:', { 
      message: message?.substring(0, 100), 
      conversationId, 
      contextId,
      hasContentData: !!contentData,
      attachmentCount: attachments?.length || 0
    });

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

    // Fetch content from database if contextId is provided
    let contentContext = '';
    let contentTitle = '';
    let contentType = '';

    // First, try to use contentData passed directly from client
    if (contentData?.text_content) {
      console.log('Using contentData from request');
      contentTitle = contentData.title || 'Study Material';
      contentType = contentData.type || 'content';
      
      // Apply smart chunking
      const chunks = createSmartChunks(contentData.text_content, contentType, 2500);
      const summary = createContentSummary(chunks, 4000);
      
      contentContext = summary;
      
      // Add chapters if available
      if (contentData.chapters && Array.isArray(contentData.chapters) && contentData.chapters.length > 0) {
        const chaptersText = contentData.chapters
          .map((ch: any, i: number) => `${i + 1}. ${ch.title}${ch.summary ? ': ' + ch.summary : ''}`)
          .join('\n');
        contentContext += `\n\n## Document Structure:\n${chaptersText}`;
      }
    } 
    // Fallback: fetch from database using contextId
    else if (contextId) {
      console.log('Fetching content from database with contextId:', contextId);
      
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('id, title, type, text_content, chapters')
        .eq('id', contextId)
        .single();

      if (contentError) {
        console.error('Error fetching content:', contentError);
      } else if (content) {
        console.log('Found content:', { 
          id: content.id, 
          title: content.title, 
          type: content.type,
          hasTextContent: !!content.text_content,
          textLength: content.text_content?.length || 0
        });
        
        contentTitle = content.title || 'Study Material';
        contentType = content.type || 'content';
        
        if (content.text_content) {
          // Apply smart chunking
          const chunks = createSmartChunks(content.text_content, contentType, 2500);
          const summary = createContentSummary(chunks, 4000);
          
          contentContext = summary;
          
          // Add chapters if available
          if (content.chapters && Array.isArray(content.chapters) && content.chapters.length > 0) {
            const chaptersText = content.chapters
              .map((ch: any, i: number) => `${i + 1}. ${ch.title}${ch.summary ? ': ' + ch.summary : ''}`)
              .join('\n');
            contentContext += `\n\n## Document Structure:\n${chaptersText}`;
          }
        }
      }
    }

    // Process attachments if any
    let attachmentContext = '';
    if (attachments && attachments.length > 0) {
      console.log('Processing attachments:', attachments.length);
      attachmentContext = attachments
        .filter(att => att.content)
        .map(att => `### Attachment: ${att.name}\n${att.content}`)
        .join('\n\n');
    }

    // Build conversation context for better AI responses
    const conversationContext = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // Create optimized system prompt for educational chat with content context
    let systemPrompt = `You are an intelligent AI tutor assistant designed to help students learn effectively. Your role is to:

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
- Encouraging and positive tone`;

    // Add content context if available
    if (contentContext) {
      systemPrompt += `

## Study Material Context: "${contentTitle}" (${contentType})

You have access to the following study material that the student is learning from. Use this content to provide accurate, relevant answers and help the student understand the material better.

<study_material>
${contentContext}
</study_material>

When answering questions:
- Reference specific parts of the study material when relevant
- Help explain concepts from the material in simpler terms
- Connect the student's questions to the material's content
- If the question is outside the material's scope, acknowledge this and still try to help`;
    }

    // Add attachment context if available  
    if (attachmentContext) {
      systemPrompt += `

## Uploaded Files
The student has shared the following files for context:

${attachmentContext}

Analyze these files and use their content to provide relevant assistance.`;
    }

    systemPrompt += `

**IMPORTANT - Response Formatting:**
Please format your responses using proper Markdown syntax:
- Use # for main headings, ## for subheadings, ### for smaller headings
- Use **bold** for emphasis and *italic* for emphasis
- Use bullet points with - or * for lists
- Use 1. 2. 3. for numbered lists
- Use > for blockquotes
- Use \`code\` for inline code and \`\`\`language\\ncode\\n\`\`\` for code blocks
- Use proper paragraphs separated by line breaks
- Structure your response to be clear, well-organized, and easy to read

Respond to the student's question or message below:`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationContext,
      { role: 'user', content: message }
    ];

    console.log('System prompt length:', systemPrompt.length);
    console.log('Content context length:', contentContext.length);

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
            max_completion_tokens: 1500,
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
        context_id: contextId,
        content_used: !!contentContext
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
