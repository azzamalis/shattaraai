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
    const { contentId, textContent, title, filename } = await req.json();
    console.log('Enhancing text content for:', contentId);

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

    console.log('Storing text file in Supabase storage...');

    // Generate smart filename from title if not provided
    let smartFilename = filename;
    if (!smartFilename) {
      // Generate smart title first
      let smartTitle = title || 'Text Content';
      
      // Try to extract H1 heading
      const h1Match = textContent.match(/^#\s+(.+)$/m);
      if (h1Match) {
        smartTitle = h1Match[1].trim();
      } else {
        // Try H2 heading
        const h2Match = textContent.match(/^##\s+(.+)$/m);
        if (h2Match) {
          smartTitle = h2Match[1].trim();
        } else {
          // Fallback: first 4-6 words from first sentence
          const firstSentence = textContent.split(/[.!?]/)[0];
          const words = firstSentence.trim().split(/\s+/).filter(word => 
            word.length > 2 && /[a-zA-Z]/.test(word)
          );
          
          if (words.length >= 4) {
            smartTitle = words.slice(0, 6).join(' ');
            if (smartTitle.length > 60) {
              smartTitle = smartTitle.substring(0, 57) + '...';
            }
          }
        }
      }
      
      // Convert to kebab-case filename
      if (smartTitle === 'Text Content') {
        smartFilename = `paste_${Date.now()}.md`;
      } else {
        const kebabTitle = smartTitle
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);
        smartFilename = `${kebabTitle || 'text-content'}.md`;
      }
    }
    
    const fileName = smartFilename;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('text-content')
      .upload(`${content.user_id}/${fileName}`, textContent, {
        contentType: 'text/markdown',
        upsert: true
      });

    if (fileError) {
      console.error('Error uploading text file:', fileError);
      throw new Error('Failed to store text file');
    }

    const storageUrl = `${supabaseUrl}/storage/v1/object/public/text-content/${fileData.path}`;

    // Generate metadata
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);
    
    // Generate summary (first 2-3 sentences)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const summary = sentences.slice(0, 3).join('. ').trim() + (sentences.length > 3 ? '...' : '');
    
    // Extract keywords
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'this', 'that', 'these', 'those']);
    
    const wordFreq = new Map();
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        wordFreq.set(cleanWord, (wordFreq.get(cleanWord) || 0) + 1);
      }
    });
    
    const keywords = Array.from(wordFreq.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);

    // Convert text to clean semantic Markdown
    let markdown = textContent;
    
    // Detect and convert headings based on patterns
    markdown = markdown.replace(/^([A-Z][^.!?\n]{10,60})$/gm, '# $1');
    markdown = markdown.replace(/^([A-Z][^.!?\n]{5,40}):?\s*$/gm, '## $1');
    
    // Convert bullet points and lists
    markdown = markdown.replace(/^[-*•]\s+(.+)$/gm, '- $1');
    markdown = markdown.replace(/^\d+\.\s+(.+)$/gm, '1. $1');
    
    // Convert quotes
    markdown = markdown.replace(/^["'"']\s*(.+)["'"']?\s*$/gm, '> $1');
    markdown = markdown.replace(/^    (.+)$/gm, '> $1');
    
    // Convert URLs to markdown links
    markdown = markdown.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
    
    // Ensure proper paragraph spacing
    markdown = markdown.replace(/\n{3,}/g, '\n\n');

    console.log('Analyzing text content with AI for chapters...');

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

    // Update content with enhanced data
    const updateData: any = {
      title: title,
      filename: fileName,
      storage_path: storageUrl,
      text_content: markdown.trim(),
      chapters: analysis.chapters,
      processing_status: 'completed',
      metadata: {
        ...content.metadata,
        wordCount,
        readingTimeMinutes,
        summary: analysis.summary || summary,
        keywords,
        keyTopics: analysis.keyTopics || [],
        insights: analysis.insights || [],
        aiAnalysis: true,
        enhanced: true,
        extractedAt: new Date().toISOString(),
        storageUrl
      },
      updated_at: new Date().toISOString()
    };

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

    console.log('Text content enhancement completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        title,
        filename: fileName,
        storageUrl,
        metadata: updateData.metadata,
        chapters: analysis.chapters,
        summary: analysis.summary,
        model_used: model,
        message: 'Text content enhancement completed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in enhance-text-content function:', error);
    
    // Update content status to failed
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const requestBody = await req.json().catch(() => ({}));
      if (requestBody.contentId) {
        await supabase
          .from('content')
          .update({
            processing_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', requestBody.contentId);
      }
    } catch (updateError) {
      console.error('Failed to update content status:', updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Text content enhancement failed'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});