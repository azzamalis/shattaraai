import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { chunkContent, selectChunksForContext } from '../_shared/contentChunking.ts';

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
    const { contentId, textContent, contentType } = await req.json();
    console.log('Enhancing content with AI for:', contentId, 'Type:', contentType);

    if (!contentId || !textContent) {
      throw new Error('Missing contentId or textContent');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting check
    const { data: content } = await supabase
      .from('content')
      .select('user_id')
      .eq('id', contentId)
      .single();

    if (!content) {
      throw new Error('Content not found');
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

    // Smart chunking for optimal AI context
    console.log('Applying smart chunking for content type:', contentType);
    const chunkedContent = chunkContent(textContent, contentType || 'text', {
      maxChunkSize: 4000,
      overlapSize: 300,
      preserveStructure: true,
      prioritizeRelevance: true,
    });
    
    console.log(`Created ${chunkedContent.chunks.length} chunks, key topics:`, chunkedContent.keyTopics.slice(0, 5));

    // Select optimal chunks for AI context (using 12k tokens for chapter generation)
    const optimizedContent = selectChunksForContext(chunkedContent, 12000, true);
    console.log(`Optimized content length: ${optimizedContent.length} chars (from ${textContent.length} original)`);

    // Determine content-specific prompt
    const getSystemPrompt = (type: string, totalPages?: number) => {
      if (type === 'pdf') {
        const pageInfo = totalPages ? `The document has ${totalPages} pages total.` : '';
        return `You are an AI assistant that analyzes PDF document content and creates structured chapters.
Your task is to break down the content into meaningful chapters with titles, summaries, and page references.

${pageInfo}

CRITICAL REQUIREMENTS:
1. Each chapter MUST cover exactly 1-2 pages (no more, no less)
2. You MUST create enough chapters to cover ALL pages of the document
3. Chapters must be sequential and not skip any pages
4. Every page must belong to exactly one chapter

Create chapters that:
1. Have descriptive titles (3-8 words) that capture the main topic of those pages
2. Include comprehensive summaries (2-4 sentences) of the content on those pages
3. Cover exactly 1-2 consecutive pages each
4. Are organized in page order from start to finish

Return a JSON object with a chapters array in this exact format:
{
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter Title",
      "summary": "Detailed summary of the chapter content...",
      "pageNumber": 1,
      "endPage": 2
    },
    {
      "id": "chapter-2",
      "title": "Next Chapter Title",
      "summary": "Summary of pages 3-4...",
      "pageNumber": 3,
      "endPage": 4
    }
  ]
}

IMPORTANT: 
- pageNumber is the starting page (1-indexed)
- endPage is the ending page (can be same as pageNumber for single-page chapters)
- For single page chapters, set endPage equal to pageNumber
- Ensure the last chapter's endPage equals the total number of pages`;
      }

      const basePrompt = `You are an AI assistant that analyzes content and creates structured chapters. 
Your task is to break down the content into meaningful chapters with titles and summaries.

Create chapters that:
1. Are logical and well-structured
2. Have descriptive titles (3-8 words)
3. Include comprehensive summaries (2-4 sentences)
4. Cover the main topics and key points
5. Are chronologically or thematically organized

Return a JSON object with a chapters array in this exact format:
{
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter Title",
      "summary": "Detailed summary of the chapter content...",
      "startTime": 0,
      "endTime": 300
    }
  ]
}

For non-audio content, use estimated time segments based on reading pace or content length.`;

      switch (type) {
        case 'website':
          return basePrompt + '\n\nAnalyze this website content and create chapters based on main topics and sections.';
        case 'youtube':
          return basePrompt + '\n\nAnalyze this YouTube video transcript and create chapters based on topics discussed.';
        case 'text':
          return basePrompt + '\n\nAnalyze this text content and create chapters based on main themes and topics.';
        case 'file':
          return basePrompt + '\n\nAnalyze this document content and create chapters based on sections and topics.';
        default:
          return basePrompt + '\n\nAnalyze this content and create logical chapters.';
      }
    };

    // Extract total pages from metadata if available (for PDFs)
    const { data: contentMeta } = await supabase
      .from('content')
      .select('metadata')
      .eq('id', contentId)
      .single();
    
    const totalPages = contentMeta?.metadata?.totalPages || contentMeta?.metadata?.pageCount || null;
    console.log('PDF total pages:', totalPages);

    let response;
    let model = 'gpt-4.1-2025-04-14';

    // Build user prompt with optimized chunked content
    const userPrompt = contentType === 'pdf' && totalPages
      ? `This PDF document has ${totalPages} pages. Please analyze the following content (smart-chunked for relevance) and create chapters that cover ALL ${totalPages} pages, with each chapter covering exactly 1-2 pages:\n\n${optimizedContent}`
      : `Please analyze the following content (smart-chunked for relevance):\n\n${optimizedContent}`;

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
              content: getSystemPrompt(contentType || 'text', totalPages)
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_completion_tokens: 4000, // Increased for more chapters
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
              content: getSystemPrompt(contentType || 'text', totalPages)
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          max_completion_tokens: 3000,
          response_format: { type: "json_object" }
        }),
      });

      if (!response.ok) {
        throw new Error(`Fallback OpenAI API error: ${response.status}`);
      }
    }

    const result = await response.json();
    console.log('AI enhancement completed with model:', model);

    if (!result.choices || !result.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const content_text = result.choices[0].message.content;
    let chapters;

    try {
      const parsedContent = JSON.parse(content_text);
      chapters = parsedContent.chapters || parsedContent;
      
      if (!Array.isArray(chapters)) {
        throw new Error('Invalid chapters format');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse AI-generated chapters');
    }

    // Update content with AI enhancements and chunking metadata
    await supabase
      .from('content')
      .update({
        chapters: chapters,
        processing_status: 'completed',
        metadata: {
          chunking: {
            totalChunks: chunkedContent.chunks.length,
            keyTopics: chunkedContent.keyTopics,
            optimalContextWindow: chunkedContent.optimalContextWindow,
          },
        },
        updated_at: new Date().toISOString()
      })
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

    console.log('Content enhanced successfully with', chapters.length, 'chapters');

    return new Response(
      JSON.stringify({ 
        success: true, 
        chapters,
        model_used: model,
        message: 'Content enhancement completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in enhance-content-ai function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'AI content enhancement failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});