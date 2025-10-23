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
    console.log('Generating quiz for content:', contentId, 'with config:', config);

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
      throw new Error('No content available for quiz generation');
    }

    // Build question types list
    const questionTypes = [];
    if (config.questionTypes?.multipleChoice) questionTypes.push('multiple choice');
    if (config.questionTypes?.trueFalse) questionTypes.push('true/false');
    if (config.questionTypes?.shortAnswer) questionTypes.push('short answer');

    const systemPrompt = `You are an expert educator creating quiz questions from educational content.

Create ${config.numberOfQuestions || 15} questions at ${config.difficulty || 'medium'} difficulty level.

Use these question types: ${questionTypes.join(', ')}.

${config.includeExplanations ? 'Include detailed explanations for each correct answer.' : ''}

For multiple choice questions, provide 4 options.
For true/false questions, the answer should be either "true" or "false".
For short answer questions, provide a model answer.

Each question should test understanding and be appropriately challenging.`;

    const userPrompt = `Create quiz questions from the following content:\n\n${contentText.substring(0, 15000)}`;

    // Try models in order
    const models = ['gpt-4.1-2025-04-14', 'gpt-5-chat-latest'];
    let quizData = null;

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
            max_completion_tokens: 4000,
            tools: [{
              type: 'function',
              function: {
                name: 'create_quiz',
                description: 'Create quiz questions from content',
                parameters: {
                  type: 'object',
                  properties: {
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          question: { type: 'string' },
                          type: { type: 'string', enum: ['multiple_choice', 'true_false', 'short_answer'] },
                          options: { type: 'array', items: { type: 'string' } },
                          correctAnswer: { type: 'string' },
                          explanation: { type: 'string' }
                        },
                        required: ['question', 'type', 'correctAnswer']
                      }
                    }
                  },
                  required: ['questions']
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'create_quiz' } }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error with ${model}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        
        if (toolCall && toolCall.function.name === 'create_quiz') {
          quizData = JSON.parse(toolCall.function.arguments);
          console.log(`Successfully generated quiz with ${model}`);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue;
      }
    }

    if (!quizData || !quizData.questions) {
      throw new Error('Failed to generate quiz with all available models');
    }

    // Store quiz in database
    const { data: insertedQuiz, error: insertError } = await supabase
      .from('quizzes')
      .insert({
        content_id: contentId,
        user_id: user.id,
        title: content.title || 'Generated Quiz',
        questions: quizData.questions,
        config: config
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting quiz:', insertError);
      throw insertError;
    }

    // Track AI usage
    await supabase.rpc('check_rate_limit', {
      user_uuid: user.id,
      request_type: 'chat',
      estimated_tokens: 2000
    });

    console.log('Successfully generated and stored quiz');

    return new Response(
      JSON.stringify({ 
        quiz: insertedQuiz,
        questionCount: quizData.questions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-quiz:', error);
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
