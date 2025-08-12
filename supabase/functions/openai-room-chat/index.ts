import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

// Import content processing utilities (inline implementation)
const createSmartChunks = (content: string, contentType: string, maxChunkSize: number = 2000) => {
  const chunks: any[] = [];
  
  // Basic chunking with sentence boundaries
  const sentences = content.split(/[.!?]+/);
  let currentChunk = '';
  let chunkIndex = 0;
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk_${chunkIndex}`,
        content: currentChunk.trim(),
        type: 'text',
        relevanceScore: calculateRelevanceScore(currentChunk, contentType),
        sourceType: contentType,
        chunkIndex,
        totalChunks: 0
      });
      currentChunk = trimmedSentence;
      chunkIndex++;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push({
      id: `chunk_${chunkIndex}`,
      content: currentChunk.trim(),
      type: 'text',
      relevanceScore: calculateRelevanceScore(currentChunk, contentType),
      sourceType: contentType,
      chunkIndex,
      totalChunks: 0
    });
  }
  
  chunks.forEach(chunk => chunk.totalChunks = chunks.length);
  return chunks;
};

const calculateRelevanceScore = (content: string, contentType: string): number => {
  let score = 0.5;
  const importantKeywords = [
    'definition', 'formula', 'equation', 'theorem', 'principle', 'concept',
    'example', 'solution', 'answer', 'conclusion', 'summary', 'key point',
    'important', 'note', 'remember', 'crucial', 'essential', 'fundamental'
  ];
  
  const contentLower = content.toLowerCase();
  importantKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) score += 0.1;
  });
  
  return Math.max(0, Math.min(1, score));
};

const createContentSummary = (chunks: any[], maxSummaryLength: number = 800): string => {
  const sortedChunks = chunks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  let summary = '';
  
  for (const chunk of sortedChunks) {
    if (summary.length + chunk.content.length < maxSummaryLength) {
      summary += (summary ? '\n\n' : '') + chunk.content;
    }
  }
  
  if (!summary && chunks.length > 0) {
    summary = chunks[0].content.substring(0, maxSummaryLength - 3) + '...';
  }
  
  return summary;
};

const generateContentTypePrompt = (contentType: string): string => {
  const prompts = {
    pdf: 'Focus on structured content, formulas, and key terms that may be highlighted.',
    youtube: 'Pay attention to timestamps, speaker transitions, and repeated key concepts.',
    audio: 'Consider speaker emphasis, repeated concepts, and topic transitions.',
    website: 'Look for headlines, navigation structure, and organized information.',
    text: 'Focus on paragraph structure, key terms, and logical flow.'
  };
  return prompts[contentType.toLowerCase()] || prompts.text;
};

const getMultiModalHints = (contentType: string): string => {
  const hints = {
    pdf: 'This PDF may contain images, diagrams, tables, and visual elements not captured in text.',
    youtube: 'This video may include visual demonstrations, charts, or slides shown on screen.',
    audio: 'This audio may feature tone, emphasis, and context from multiple speakers.'
  };
  return hints[contentType.toLowerCase()] || '';
};

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

    console.log('Processing chat request for user:', user.id);

    // Check rate limits before processing
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        user_uuid: user.id,
        request_type: 'chat',
        estimated_tokens: 1500
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

    // Create more specific cache key for this request
    const messageHash = message.substring(0, 20).replace(/[^a-zA-Z0-9]/g, ''); // Clean message for uniqueness
    const cacheKey = `chat_${user.id}_${roomId}_${messageHash}`;
    const contentHash = JSON.stringify({ roomContent, conversationHistory, message });
    
    // Check cache first
    const { data: cachedResponse, error: cacheError } = await supabase
      .from('ai_cache')
      .select('response_data, hit_count, id')
      .eq('user_id', user.id)
      .eq('cache_key', cacheKey)
      .eq('content_hash', contentHash)
      .gt('expires_at', new Date().toISOString())
      .limit(1);

    if (!cacheError && cachedResponse && cachedResponse.length > 0) {
      console.log('Cache hit for chat request');
      
      // Update hit count
      await supabase
        .from('ai_cache')
        .update({ hit_count: cachedResponse[0].hit_count + 1 })
        .eq('id', cachedResponse[0].id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          response: cachedResponse[0].response_data.response,
          cached: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build enhanced room context with smart chunking
    let roomContext = '';
    let allChunks: any[] = [];
    
    if (roomContent.length > 0) {
      roomContext = '\n\n## Available Study Materials:\n';
      
      for (const content of roomContent) {
        roomContext += `\n### ${content.title} (${content.type})\n`;
        
        if (content.text_content) {
          // Apply smart chunking based on content type
          const chunks = createSmartChunks(content.text_content, content.type, 2500);
          allChunks.push(...chunks);
          
          // Create content summary for large files
          if (content.text_content.length > 3000) {
            const summary = createContentSummary(chunks, 1000);
            roomContext += `**Summary:** ${summary}\n`;
            
            // Add content type specific processing hints
            const typePrompt = generateContentTypePrompt(content.type);
            if (typePrompt) {
              roomContext += `**Analysis Notes:** ${typePrompt}\n`;
            }
            
            // Add multi-modal hints
            const modalHints = getMultiModalHints(content.type);
            if (modalHints) {
              roomContext += `**Content Notes:** ${modalHints}\n`;
            }
          } else {
            // For smaller content, include full text
            roomContext += `${content.text_content}\n`;
          }
        }
      }
      
      // If we have many chunks, prioritize the most relevant ones
      if (allChunks.length > 0) {
        const topChunks = allChunks
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 8); // Limit to top 8 chunks to manage context
          
        if (topChunks.length < allChunks.length) {
          roomContext += `\n**Note:** Showing most relevant content sections (${topChunks.length} of ${allChunks.length} sections). Ask for specific topics if you need more details.\n`;
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

    // Create enhanced system prompt with content understanding
    const systemPrompt = `You are an AI tutor helping students learn from their study materials. You have access to processed content with smart chunking and format-specific analysis.

## Instructions:
- Answer questions based on the provided study materials when relevant
- Use the content summaries and analysis notes to provide comprehensive responses
- If content is truncated or summarized, mention that you can discuss specific sections in more detail
- Consider the multi-modal nature of content (PDFs may have images, videos may have visual elements)
- Provide clear, educational explanations with examples when possible
- Ask clarifying questions when needed to better understand what the student wants to learn
- Be encouraging and supportive
- When referencing content, mention the source material by title

## Content Analysis Capabilities:
- Smart content chunking based on format (PDF, video, audio, website, text)
- Relevance scoring to prioritize important sections
- Content type-specific processing for better understanding
- Multi-modal content awareness

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
            generated_at: new Date().toISOString(),
            tokens_used: aiData.usage?.total_tokens || 0,
            cached: false
          }
        });

      if (insertError) {
        console.error('Error storing AI response:', insertError);
      }
    } catch (dbError) {
      console.error('Database storage error:', dbError);
    }

    // Cache the response for future requests
    try {
      const { data: planData } = await supabase
        .rpc('get_user_plan_quotas', { user_uuid: user.id });
      
      const cacheHours = planData?.[0]?.cache_duration_hours || 24;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + cacheHours);

      await supabase
        .from('ai_cache')
        .insert({
          user_id: user.id,
          cache_key: cacheKey,
          response_data: { response: aiResponse, model: aiData.model },
          content_hash: contentHash,
          model_name: aiData.model || 'o4-mini-2025-04-16',
          expires_at: expiresAt.toISOString()
        });
    } catch (cacheInsertError) {
      console.error('Cache insertion error:', cacheInsertError);
    }

    // Update usage tracking
    try {
      const tokensUsed = aiData.usage?.total_tokens || 1000;
      const estimatedCost = (tokensUsed / 1000000) * 0.15; // Rough estimate for o4-mini

      await supabase
        .from('ai_usage_counters')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          chat_requests: 1,
          total_tokens_used: tokensUsed,
          total_cost_usd: estimatedCost
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });
    } catch (usageError) {
      console.error('Usage tracking error:', usageError);
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