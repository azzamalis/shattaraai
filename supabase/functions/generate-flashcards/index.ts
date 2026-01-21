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

// Helper to update progress in content metadata
async function updateProgress(supabase: any, contentId: string, step: string, progress: number, status: string = 'processing') {
  try {
    const { data: current } = await supabase
      .from('content')
      .select('metadata')
      .eq('id', contentId)
      .single();
    
    const existingMetadata = (current?.metadata || {}) as Record<string, any>;
    
    await supabase
      .from('content')
      .update({
        processing_status: status,
        metadata: {
          ...existingMetadata,
          generationProgress: {
            type: 'flashcards',
            step,
            progress,
            updatedAt: new Date().toISOString()
          }
        }
      })
      .eq('id', contentId);
    
    console.log(`Progress update: ${step} (${progress}%)`);
  } catch (error) {
    console.error('Error updating progress:', error);
  }
}

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
    console.log('Generating flashcards for content:', contentId, 'with config:', config);

    // Step 1: Analyzing content
    await updateProgress(supabase, contentId, 'analyzing', 10);

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
    
    // Step 2: Extracting data
    await updateProgress(supabase, contentId, 'extracting', 25);

    // Prepare content for AI - try multiple sources
    let contentText = content.text_content || '';
    
    // Add chapter text if available
    if (content.chapters && Array.isArray(content.chapters)) {
      const chapterText = content.chapters
        .map((ch: any) => ch.text || ch.content || '')
        .filter((t: string) => t.trim())
        .join('\n\n');
      if (chapterText) {
        contentText += (contentText ? '\n\n' : '') + chapterText;
      }
    }

    // If still no content, try fetching from storage for PDFs
    if (!contentText.trim() && content.storage_path) {
      console.log('No text_content found, attempting to fetch from storage...');
      
      try {
        // For PDFs stored in Supabase, the storage_path might be a signed URL or a path
        // We need to check if content was processed - if not, inform user
        if (content.processing_status === 'pending' || content.processing_status === 'processing') {
          throw new Error('Content is still being processed. Please wait for processing to complete before generating flashcards.');
        }
        
        // Check metadata for any extracted text
        const metadata = content.metadata as Record<string, any> | null;
        if (metadata?.extractedText) {
          contentText = metadata.extractedText;
        } else if (metadata?.summary) {
          // Use summary as fallback
          contentText = metadata.summary;
        }
      } catch (storageError) {
        console.error('Error fetching content from storage:', storageError);
        if (storageError instanceof Error && storageError.message.includes('still being processed')) {
          throw storageError;
        }
      }
    }

    if (!contentText.trim()) {
      // Provide more helpful error message
      const status = content.processing_status;
      if (status === 'pending' || status === 'processing') {
        throw new Error('Content is still being processed. Please wait for processing to complete before generating flashcards.');
      } else if (status === 'failed') {
        throw new Error('Content processing failed. Please try re-uploading the content or retry processing.');
      }
      throw new Error('No text content available for flashcard generation. Please ensure the content has been fully processed.');
    }

    // Build system prompt based on config
    const difficultyInstructions = {
      easy: 'Create simple, straightforward flashcards suitable for beginners.',
      medium: 'Create moderately challenging flashcards with some depth.',
      hard: 'Create advanced, complex flashcards that test deep understanding.'
    };

    let systemPrompt = `You are an expert educator creating flashcards from educational content.

${difficultyInstructions[config.difficulty || 'medium']}

${config.focusOnKeyConcepts ? 'Focus on the most important concepts and key takeaways.' : 'Cover a broad range of topics from the content.'}

Generate exactly ${config.numberOfCards || 10} flashcards.

${config.includeHints ? 'Include helpful hints for each flashcard.' : ''}
${config.includeExplanations ? 'Include detailed explanations for each answer.' : ''}`;

    // Add topic-specific instructions if topics are selected
    if (config.selectedTopics && config.selectedTopics.length > 0) {
      systemPrompt += `\n\nFocus specifically on these topics: ${config.selectedTopics.join(', ')}`;
    }

    // Add custom focus instructions if provided
    if (config.focusInstructions && config.focusInstructions.trim()) {
      systemPrompt += `\n\nAdditional focus: ${config.focusInstructions}`;
    }

    systemPrompt += `\n\nEach flashcard should:
- Have a clear, concise question
- Provide an accurate, complete answer
- Identify the main concept being tested
- Be appropriately challenging for the ${config.difficulty || 'medium'} difficulty level`;

    const userPrompt = `Create flashcards from the following content:\n\n${contentText.substring(0, 15000)}`;

    // Step 3: Generating flashcards
    await updateProgress(supabase, contentId, 'generating', 50);

    // Try models in order
    const models = ['gpt-4.1-2025-04-14', 'gpt-5-chat-latest'];
    let flashcardsData = null;

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
                name: 'create_flashcards',
                description: 'Create flashcard set from content',
                parameters: {
                  type: 'object',
                  properties: {
                    flashcards: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          question: { type: 'string' },
                          answer: { type: 'string' },
                          hint: { type: 'string' },
                          explanation: { type: 'string' },
                          concept: { type: 'string' },
                          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] }
                        },
                        required: ['question', 'answer', 'concept', 'difficulty']
                      }
                    }
                  },
                  required: ['flashcards']
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'create_flashcards' } }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error with ${model}:`, response.status, errorText);
          continue;
        }

        const data = await response.json();
        const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
        
        if (toolCall && toolCall.function.name === 'create_flashcards') {
          flashcardsData = JSON.parse(toolCall.function.arguments);
          console.log(`Successfully generated flashcards with ${model}`);
          break;
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue;
      }
    }

    if (!flashcardsData || !flashcardsData.flashcards) {
      await updateProgress(supabase, contentId, 'failed', 0, 'failed');
      throw new Error('Failed to generate flashcards with all available models');
    }

    // Step 4: Saving
    await updateProgress(supabase, contentId, 'saving', 85);

    // Store flashcards in database
    const flashcardsToInsert = flashcardsData.flashcards.map((card: any) => ({
      content_id: contentId,
      user_id: user.id,
      question: card.question,
      answer: card.answer,
      hint: card.hint || null,
      explanation: card.explanation || null,
      concept: card.concept,
      difficulty: card.difficulty
    }));

    const { data: insertedFlashcards, error: insertError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting flashcards:', insertError);
      throw insertError;
    }

    // Update progress to completed
    await updateProgress(supabase, contentId, 'completed', 100, 'completed');

    // Track AI usage
    await supabase.rpc('check_rate_limit', {
      user_uuid: user.id,
      request_type: 'chat',
      estimated_tokens: 2000
    });

    console.log('Successfully generated and stored flashcards:', insertedFlashcards?.length);

    return new Response(
      JSON.stringify({ 
        flashcards: insertedFlashcards,
        count: insertedFlashcards?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-flashcards:', error);
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
