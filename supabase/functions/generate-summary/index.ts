import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_GENERATION_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { contentId, config } = await req.json();
    console.log('Generating summary for content:', contentId, 'with config:', config);

    // Fetch content from database
    const { data: content, error: contentError } = await supabase
      .from('content')
      .select('*')
      .eq('id', contentId)
      .eq('user_id', user.id)
      .single();

    if (contentError || !content) {
      throw new Error('Content not found');
    }

    // Prepare content for AI
    let contentText = content.text_content || '';
    if (content.chapters && Array.isArray(content.chapters)) {
      contentText += '\n\n' + content.chapters.map((ch: any) => ch.text || '').join('\n');
    }

    if (!contentText.trim()) {
      throw new Error('No content available for summary generation');
    }

    // Build focus areas
    const focusAreas = [];
    if (config.focusAreas?.keyPoints) focusAreas.push('key points');
    if (config.focusAreas?.mainTopics) focusAreas.push('main topics');
    if (config.focusAreas?.examples) focusAreas.push('examples');
    if (config.focusAreas?.definitions) focusAreas.push('definitions');
    if (config.focusAreas?.all) focusAreas.push('comprehensive coverage');

    // Template-specific prompts for meaningfully different outputs
    const templatePrompts = {
      detailed: `You are an academic content expert creating a comprehensive, in-depth summary.

OUTPUT REQUIREMENTS:
- Write 500-800 words in well-structured paragraphs
- Include an introduction that frames the topic and its importance
- Organize content into logical sections with clear transitions
- Provide context, background information, and nuanced explanations
- Include specific examples, case studies, or illustrations from the content
- Explain relationships between concepts and their broader implications
- Conclude with key takeaways and potential applications
- Use academic language appropriate for deep study

STRUCTURE:
1. Introduction (context and importance)
2. Main concepts (detailed explanations with examples)
3. Supporting details and evidence
4. Connections and implications
5. Conclusion with actionable takeaways`,

      standard: `You are creating a quick-reference cheat sheet for efficient studying.

OUTPUT REQUIREMENTS:
- Create a scannable, bullet-point format summary (200-350 words)
- Use short, punchy bullet points (1-2 sentences max each)
- Group related points under clear category headers
- Highlight key terms in context (mention the term and its meaning together)
- Include memory aids, mnemonics, or quick tips where helpful
- Prioritize the most testable/important information
- Use symbols like → for relationships, = for definitions, ★ for critical points
- Format for rapid review before an exam

STRUCTURE:
★ KEY CONCEPTS
• [Concept]: [One-line definition/explanation]

→ MAIN RELATIONSHIPS
• [How concepts connect]

📝 QUICK FACTS
• [Testable details]

💡 REMEMBER
• [Memory tips or common mistakes to avoid]`,

      brief: `You are creating an executive summary for someone who needs the absolute essentials.

OUTPUT REQUIREMENTS:
- Write exactly 3-5 sentences (75-150 words maximum)
- First sentence: What is the main topic/thesis?
- Middle sentences: What are the 2-3 most critical points?
- Final sentence: What is the key takeaway or action item?
- No bullet points - flowing paragraph format
- Every word must earn its place - remove all filler
- Use clear, direct language anyone can understand
- Think "elevator pitch" - what would you say in 30 seconds?

This should be readable in under 30 seconds and give a complete picture of the essential content.`
    };

    const selectedTemplate = config.length || 'standard';
    const systemPrompt = templatePrompts[selectedTemplate] + `

${focusAreas.length > 0 ? `\nPrioritize these focus areas: ${focusAreas.join(', ')}.` : ''}
${config.format === 'paragraphs' && selectedTemplate === 'standard' ? '\nNote: User prefers paragraph format over bullets.' : ''}`;

    const userPrompt = `Create a summary of the following content:\n\n${contentText.substring(0, 15000)}`;

    // Try models in order
    const models = ['gpt-4.1-2025-04-14', 'gpt-5-chat-latest'];
    let summaryData = null;

    for (const model of models) {
      try {
        console.log(`Attempting with model: ${model}`);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_completion_tokens: 2000,
            tools: [{
              type: 'function',
              function: {
                name: 'create_summary',
                description: 'Create summary from content',
                parameters: {
                  type: 'object',
                  properties: {
                    summary: { type: 'string' },
                    keyPoints: {
                      type: 'array',
                      items: { type: 'string' }
                    }
                  },
                  required: ['summary', 'keyPoints']
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'create_summary' } }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error with ${model}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        
        if (toolCall && toolCall.function.name === 'create_summary') {
          summaryData = JSON.parse(toolCall.function.arguments);
          console.log(`Successfully generated summary with ${model}`);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue;
      }
    }

    if (!summaryData) {
      throw new Error('Failed to generate summary with all available models');
    }

    // Update content with summary
    const { error: updateError } = await supabase
      .from('content')
      .update({
        ai_summary: summaryData.summary,
        summary_key_points: summaryData.keyPoints,
        summary_generated_at: new Date().toISOString()
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('Error updating content with summary:', updateError);
      throw updateError;
    }

    // Track AI usage
    await supabase.rpc('check_rate_limit', {
      user_uuid: user.id,
      request_type: 'chat',
      estimated_tokens: 1000
    });

    console.log('Successfully generated and stored summary');

    return new Response(
      JSON.stringify({ 
        summary: summaryData.summary,
        keyPoints: summaryData.keyPoints
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-summary:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
