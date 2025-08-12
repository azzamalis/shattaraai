import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExamGenerationRequest {
  roomId: string;
  roomContent: Array<{
    id: string;
    title: string;
    type: string;
    text_content?: string;
  }>;
  additionalResources?: Array<{
    id: string;
    title: string;
    type: 'file' | 'url' | 'text';
    content?: string;
  }>;
  examConfig: {
    numQuestions: number;
    questionType: 'MCQ' | 'Open Source' | 'Both';
    examLength: number;
    selectedTopics: string[];
  };
}

interface MCQOption {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface ExamQuestion {
  id: string;
  type: 'mcq' | 'open';
  question: string;
  points: number;
  timeEstimate: number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  options?: MCQOption[];
  sampleAnswer?: string;
  rubric?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      roomId,
      roomContent = [],
      additionalResources = [],
      examConfig
    }: ExamGenerationRequest = await req.json();

    // Validate required fields
    if (!roomId || !examConfig) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: roomId or examConfig' 
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
          error: 'OpenAI API key not configured'
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

    // Build content context for exam generation
    let contentContext = '';
    
    if (roomContent.length > 0) {
      contentContext += '\n\n## Room Study Materials:\n';
      for (const content of roomContent) {
        contentContext += `\n### ${content.title} (${content.type})\n`;
        if (content.text_content) {
          // Chunk large content to fit context window
          const maxChunkSize = 3000;
          const textContent = content.text_content.substring(0, maxChunkSize);
          contentContext += `${textContent}${content.text_content.length > maxChunkSize ? '...' : ''}\n`;
        }
      }
    }

    if (additionalResources.length > 0) {
      contentContext += '\n\n## Additional Reference Materials:\n';
      for (const resource of additionalResources) {
        contentContext += `\n### ${resource.title} (${resource.type})\n`;
        if (resource.content) {
          const maxChunkSize = 2000;
          const textContent = resource.content.substring(0, maxChunkSize);
          contentContext += `${textContent}${resource.content.length > maxChunkSize ? '...' : ''}\n`;
        }
      }
    }

    // Determine question distribution
    const { numQuestions, questionType } = examConfig;
    let mcqCount = 0;
    let openCount = 0;

    if (questionType === 'MCQ') {
      mcqCount = numQuestions;
    } else if (questionType === 'Open Source') {
      openCount = numQuestions;
    } else { // Both
      mcqCount = Math.ceil(numQuestions * 0.7); // 70% MCQ
      openCount = numQuestions - mcqCount; // 30% Open-ended
    }

    // Create system prompt for exam generation
    const systemPrompt = `You are an expert educational assessment creator. Generate a comprehensive exam based on the provided study materials.

## EXAM REQUIREMENTS:
- Total Questions: ${numQuestions}
- MCQ Questions: ${mcqCount}
- Open-ended Questions: ${openCount}
- Duration: ${examConfig.examLength} minutes
- Topics: ${examConfig.selectedTopics.join(', ')}

## RESPONSE FORMAT:
Return a valid JSON object with this exact structure:
{
  "examTitle": "Generated Exam Title",
  "instructions": "Clear exam instructions for students",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text here",
      "points": 5,
      "timeEstimate": 3,
      "difficulty": "medium",
      "topic": "Topic name",
      "options": [
        {"label": "A", "text": "Option A text", "isCorrect": false},
        {"label": "B", "text": "Option B text", "isCorrect": true},
        {"label": "C", "text": "Option C text", "isCorrect": false},
        {"label": "D", "text": "Option D text", "isCorrect": false}
      ]
    },
    {
      "id": "q2",
      "type": "open",
      "question": "Open-ended question text",
      "points": 10,
      "timeEstimate": 8,
      "difficulty": "hard",
      "topic": "Topic name",
      "sampleAnswer": "Sample expected answer",
      "rubric": ["Criterion 1", "Criterion 2", "Criterion 3"]
    }
  ]
}

## QUALITY GUIDELINES:
1. Questions should directly relate to the provided study materials
2. Include a mix of difficulty levels (easy: 30%, medium: 50%, hard: 20%)
3. MCQ options should be plausible and avoid obvious wrong answers
4. Open-ended questions should require critical thinking and application
5. Time estimates should be realistic (MCQ: 2-4 min, Open: 5-15 min)
6. Point distribution should reflect question complexity

${contentContext}

Generate an exam that thoroughly tests understanding of the above materials.`;

    console.log('Generating exam with OpenAI o4-mini-2025-04-16');

    // Call OpenAI API
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
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_completion_tokens: 4000,
          temperature: 0.4,
          response_format: { type: "json_object" }
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
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_completion_tokens: 4000,
          temperature: 0.4,
          response_format: { type: "json_object" }
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to generate exam'
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
          error: 'No exam generated'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the JSON response
    let examData;
    try {
      examData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse exam JSON:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid exam format generated'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add metadata to the exam
    examData.metadata = {
      generatedAt: new Date().toISOString(),
      model: aiData.model || 'o4-mini-2025-04-16',
      roomId: roomId,
      userId: user.id,
      config: examConfig
    };

    console.log(`Successfully generated exam with ${examData.questions?.length || 0} questions`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        exam: examData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in openai-generate-exam:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});