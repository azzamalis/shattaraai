import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create smart content chunks for context
function createSmartChunks(text: string, maxChunkSize: number = 4000): string[] {
  if (!text || text.length <= maxChunkSize) return text ? [text] : [];
  
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  
  return chunks.slice(0, 3); // Return first 3 chunks for context
}

// Helper to create a summary of content for context
function createContentSummary(content: any): string {
  const parts: string[] = [];
  
  if (content.title) parts.push(`Title: ${content.title}`);
  if (content.type) parts.push(`Type: ${content.type}`);
  
  // Add chapters/sections if available
  if (content.chapters && Array.isArray(content.chapters)) {
    const chapterTitles = content.chapters
      .slice(0, 10)
      .map((ch: any) => ch.title || ch.name)
      .filter(Boolean)
      .join(', ');
    if (chapterTitles) parts.push(`Sections: ${chapterTitles}`);
  }
  
  return parts.join('\n');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      conversationId, 
      contextId,
      conversationHistory = [], 
      contentData,
      attachments = [],
      stream = false 
    } = await req.json();

    console.log('Received request:', { 
      message: message?.slice(0, 100), 
      conversationId, 
      contextId,
      hasContentData: !!contentData,
      historyLength: conversationHistory.length,
      attachmentsCount: attachments.length,
      stream
    });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Build context from content data or fetch from database
    let contextText = '';
    let contentTitle = '';
    let contentType = '';
    
    if (contentData) {
      contentTitle = contentData.title || '';
      contentType = contentData.type || '';
      
      // Use provided content data
      if (contentData.text_content) {
        const chunks = createSmartChunks(contentData.text_content, 6000);
        contextText = chunks.join('\n\n---\n\n');
      }
      
      // Add summary if available
      if (contentData.summary) {
        contextText = `Summary:\n${contentData.summary}\n\n---\n\nContent:\n${contextText}`;
      }
      
      // Add chapter info
      if (contentData.chapters) {
        const chapterInfo = createContentSummary({ chapters: contentData.chapters });
        contextText = `${chapterInfo}\n\n${contextText}`;
      }
    } else if (contextId) {
      // Fetch content from database if not provided
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('title, type, text_content, chapters, ai_summary')
        .eq('id', contextId)
        .single();
      
      if (!contentError && content) {
        contentTitle = content.title || '';
        contentType = content.type || '';
        
        if (content.text_content) {
          const chunks = createSmartChunks(content.text_content, 6000);
          contextText = chunks.join('\n\n---\n\n');
        }
        
        if (content.ai_summary) {
          contextText = `Summary:\n${content.ai_summary}\n\n---\n\nContent:\n${contextText}`;
        }
        
        if (content.chapters) {
          const chapterInfo = createContentSummary({ chapters: content.chapters });
          contextText = `${chapterInfo}\n\n${contextText}`;
        }
      }
    }

    // Add attachment context
    if (attachments.length > 0) {
      const attachmentInfo = attachments
        .map((a: any) => `Attached: ${a.name} (${a.type})${a.content ? `\nContent: ${a.content.slice(0, 2000)}` : ''}`)
        .join('\n\n');
      contextText += `\n\n---\nAttachments:\n${attachmentInfo}`;
    }

    // Build system prompt
    const systemPrompt = `You are Shattara AI, an intelligent study assistant helping users understand their educational content. You have access to the following context:

${contentTitle ? `Document: "${contentTitle}" (${contentType})` : 'General assistance mode'}

${contextText ? `Content Context:\n${contextText.slice(0, 12000)}` : ''}

Guidelines:
- Provide clear, educational responses
- Reference specific parts of the content when relevant
- Help with summarization, explanation, and question answering
- Use markdown formatting for better readability
- Be concise but thorough
- If asked about something not in the context, say so honestly`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-8).map((msg: any) => ({
        role: msg.sender_type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('Sending to OpenAI with streaming:', stream);

    if (stream) {
      // Streaming response
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 2000,
          temperature: 0.7,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      // Return the stream directly
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // Non-streaming response
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

      console.log('Successfully generated response');

      return new Response(JSON.stringify({ response: aiResponse, success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in openai-chat-content:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        response: 'I apologize, but I encountered an error. Please try again.',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});