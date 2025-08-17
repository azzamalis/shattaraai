import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { questions, answers, originalContent } = await req.json();
    
    console.log(`Evaluating exam with ${questions.length} questions`);
    
    const evaluatedQuestions = [];
    
    for (const question of questions) {
      const userAnswer = answers[question.id];
      let evaluatedQuestion = { ...question };
      
      if (question.type === 'multiple-choice') {
        // For MCQ, determine correctness and generate explanation
        const isCorrect = userAnswer === question.correctAnswer;
        
        const explanationPrompt = `
Based on the following study material and question, provide a detailed explanation for ${isCorrect ? 'why this answer is correct' : 'why the user\'s answer is incorrect and what the correct answer should be'}:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}
Options: ${question.options?.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n') || ''}
Correct Answer: ${String.fromCharCode(65 + (question.correctAnswer || 0))}. ${question.options?.[question.correctAnswer || 0] || ''}
User's Answer: ${userAnswer !== undefined ? `${String.fromCharCode(65 + userAnswer)}. ${question.options?.[userAnswer] || ''}` : 'No answer provided'}

Provide a clear, educational explanation that helps the student understand the concept. Reference the study material when relevant.
`;

        evaluatedQuestion.explanation = await generateExplanation(explanationPrompt);
        
      } else if (question.type === 'free-text') {
        // For free-text, evaluate the answer quality and provide feedback
        if (question.isSkipped) {
          const sampleAnswerPrompt = `
Based on the following study material, provide a comprehensive sample answer for this question:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}

Provide a detailed, well-structured answer that demonstrates mastery of the topic. This will help the student understand what a complete answer should include.
`;
          
          evaluatedQuestion.feedback = await generateExplanation(sampleAnswerPrompt);
          
        } else {
          const evaluationPrompt = `
Based on the following study material, evaluate the student's answer to this question:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}
Student's Answer: ${userAnswer || 'No answer provided'}

Provide constructive feedback that:
1. Acknowledges what the student got right (if anything)
2. Points out key concepts that were missed or incorrectly explained
3. Provides the correct or more complete information
4. References specific parts of the study material when relevant

Be encouraging but honest about the quality of the answer.
`;

          evaluatedQuestion.feedback = await generateExplanation(evaluationPrompt);
        }
      }
      
      evaluatedQuestions.push(evaluatedQuestion);
    }

    console.log(`Successfully evaluated ${evaluatedQuestions.length} questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        evaluatedQuestions,
        message: `Evaluated ${evaluatedQuestions.length} questions successfully`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in exam evaluation:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to evaluate exam',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateExplanation(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Using same model as exam generation
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational evaluator. Provide clear, constructive, and educational explanations and feedback. Keep responses focused and helpful for student learning.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 500,
        // Note: temperature not supported for this model
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('Error generating explanation:', error);
    return 'Unable to generate explanation at this time. Please review the study material for more information.';
  }
}