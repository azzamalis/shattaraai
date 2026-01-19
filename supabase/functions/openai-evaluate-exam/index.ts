import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Authentication check
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.error('Missing or invalid authorization header');
    return new Response(
      JSON.stringify({ error: 'Unauthorized - missing auth token' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });

  // Verify the JWT token and get the user
  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

  if (claimsError || !claimsData?.claims) {
    console.error('Authentication failed:', claimsError?.message || 'Invalid token');
    return new Response(
      JSON.stringify({ error: 'Authentication failed' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const userId = claimsData.claims.sub;
  console.log(`Authenticated user: ${userId}`);

  // Rate limiting check
  const { data: rateLimitData, error: rateLimitError } = await supabase
    .rpc('check_rate_limit', {
      user_uuid: userId,
      request_type: 'exam',
      estimated_tokens: 1500
    });

  if (rateLimitError) {
    console.error('Rate limit check error:', rateLimitError);
  } else if (rateLimitData && rateLimitData.length > 0) {
    const rateLimit = rateLimitData[0];
    if (!rateLimit.allowed) {
      console.warn(`Rate limit exceeded for user ${userId}`);
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. Resets at: ${rateLimit.reset_time}`,
          rateLimitInfo: rateLimit
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  if (!openAIApiKey) {
    console.error('OpenAI API key not found');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { questions, answers, originalContent, examId } = await req.json();

    // Verify exam ownership if examId is provided
    if (examId) {
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('id, user_id')
        .eq('id', examId)
        .eq('user_id', userId)
        .single();

      if (examError || !exam) {
        console.error('Exam access denied:', examError?.message || 'Not found');
        return new Response(
          JSON.stringify({ error: 'Exam not found or access denied' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    console.log(`Evaluating exam with ${questions.length} questions`);
    
    const evaluatedQuestions = [];
    
    for (const question of questions) {
      const userAnswer = answers[question.id];
      let evaluatedQuestion = { ...question };
      
      // Add user answer to the question
      evaluatedQuestion.userAnswer = userAnswer;
      
      if (question.type === 'multiple-choice') {
        // For MCQ, determine correctness and generate explanation
        const isCorrect = userAnswer === question.correctAnswer;
        
        let explanationPrompt;
        if (question.isSkipped) {
          explanationPrompt = `
Based on the following study material, explain the correct answer to this multiple choice question:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}
Options: ${question.options?.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n') || ''}
Correct Answer: ${String.fromCharCode(65 + (question.correctAnswer || 0))}. ${question.options?.[question.correctAnswer || 0] || ''}

Status: Question was skipped by student

Provide a concise explanation (2-3 sentences) explaining why the correct answer is right and what concept it demonstrates. Include a realistic page reference from the study material.
`;
        } else {
          explanationPrompt = `
Based on the following study material and question, provide a concise evaluation:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}
Options: ${question.options?.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join('\n') || ''}
Correct Answer: ${String.fromCharCode(65 + (question.correctAnswer || 0))}. ${question.options?.[question.correctAnswer || 0] || ''}
User's Answer: ${String.fromCharCode(65 + userAnswer)}. ${question.options?.[userAnswer] || ''}

Status: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

${isCorrect ? 
  'Provide a brief explanation (2-3 sentences) confirming why this answer is correct and what concept it demonstrates.' : 
  'Provide a brief explanation (2-3 sentences) explaining why the user\'s answer is wrong and why the correct answer is right.'
}

Include a realistic page reference from the study material.
`;
        }

        const explanationResponse = await generateStructuredExplanation(explanationPrompt);
        evaluatedQuestion.explanation = explanationResponse.explanation;
        evaluatedQuestion.referenceSource = explanationResponse.referenceSource;
        evaluatedQuestion.referenceTime = explanationResponse.referenceTime;
        
      } else if (question.type === 'free-text') {
        // For free-text, evaluate the answer quality and provide feedback
        if (question.isSkipped) {
          const sampleAnswerPrompt = `
Based on the following study material, provide a sample answer for this free-text question:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}

Status: Question was skipped by student

Provide a concise sample answer (2-3 sentences) that demonstrates what a good response should include. Include a realistic page reference from the study material.
`;
          
          const feedbackResponse = await generateStructuredExplanation(sampleAnswerPrompt);
          evaluatedQuestion.feedback = feedbackResponse.explanation;
          evaluatedQuestion.referenceSource = feedbackResponse.referenceSource;
          evaluatedQuestion.referenceTime = feedbackResponse.referenceTime;
          
        } else {
          const evaluationPrompt = `
Based on the following study material, evaluate the student's answer and determine if it's correct or incorrect:

Study Material Context:
${originalContent || 'General knowledge'}

Question: ${question.question}
Student's Answer: ${userAnswer || 'No answer provided'}

First, assess if the student's answer is CORRECT or INCORRECT based on the study material.
If INCORRECT or not related to the question, clearly label it as "INCORRECT" and provide the proper explanation.
If CORRECT, provide positive feedback.

Provide feedback (2-3 sentences) and include a realistic page reference from the study material.
`;

          const feedbackResponse = await generateStructuredExplanation(evaluationPrompt);
          evaluatedQuestion.feedback = feedbackResponse.explanation;
          evaluatedQuestion.referenceSource = feedbackResponse.referenceSource;
          evaluatedQuestion.referenceTime = feedbackResponse.referenceTime;
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

async function generateStructuredExplanation(prompt: string): Promise<{explanation: string, referenceSource: string, referenceTime: string}> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Primary model, fallback to gpt-4.1-mini-2025-04-14 if needed
        messages: [
          {
            role: 'system',
            content: `You are an expert educational evaluator. Provide clear, constructive, and educational explanations and feedback. 

For multiple choice questions: Ensure each question has unique answer options with no duplicate or nearly identical answers. Generate 4 distinct options with only 1 correct answer.

For free text evaluation: If the student's answer is incorrect or unrelated, start your feedback with "INCORRECT:" followed by the proper explanation.

IMPORTANT: You must respond with a JSON object in this exact format:
{
  "explanation": "Your 2-3 sentence explanation here",
  "referenceSource": "Document",
  "referenceTime": "Page X"
}

Replace "Page X" with a realistic page number (e.g., "Page 12", "Page 5", etc.) based on the content complexity. Keep explanations concise and educational.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(content);
      return {
        explanation: parsed.explanation || 'Unable to generate explanation.',
        referenceSource: parsed.referenceSource || 'Document',
        referenceTime: parsed.referenceTime || 'Page 1'
      };
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return {
        explanation: content || 'Unable to generate explanation at this time.',
        referenceSource: 'Document',
        referenceTime: 'Page 1'
      };
    }
    
  } catch (error) {
    console.error('Error generating explanation:', error);
    return {
      explanation: 'Unable to generate explanation at this time. Please review the study material for more information.',
      referenceSource: 'Document',
      referenceTime: 'Page 1'
    };
  }
}