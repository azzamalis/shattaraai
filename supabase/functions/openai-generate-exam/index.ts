import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

// Content processing utilities for exam generation
const createExamContentChunks = (content: string, contentType: string, maxChunkSize: number = 3000) => {
  const chunks: any[] = [];
  
  if (contentType === 'pdf' || contentType === 'document') {
    // For PDFs, respect paragraph structure
    const paragraphs = content.split(/\n\s*\n/);
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          type: contentType,
          relevanceScore: calculateExamRelevance(currentChunk, contentType),
          chunkIndex: chunkIndex++
        });
        currentChunk = paragraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        type: contentType,
        relevanceScore: calculateExamRelevance(currentChunk, contentType),
        chunkIndex: chunkIndex
      });
    }
  } else {
    // For other content types, use sentence-based chunking
    const sentences = content.split(/[.!?]+/);
    let currentChunk = '';
    let chunkIndex = 0;
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;
      
      if (currentChunk.length + trimmed.length > maxChunkSize && currentChunk.length > 0) {
        chunks.push({
          content: currentChunk.trim(),
          type: contentType,
          relevanceScore: calculateExamRelevance(currentChunk, contentType),
          chunkIndex: chunkIndex++
        });
        currentChunk = trimmed;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + trimmed;
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        type: contentType,
        relevanceScore: calculateExamRelevance(currentChunk, contentType),
        chunkIndex: chunkIndex
      });
    }
  }
  
  return chunks;
};

const calculateExamRelevance = (content: string, contentType: string): number => {
  let score = 0.5;
  
  // Keywords that indicate testable content
  const examKeywords = [
    'definition', 'formula', 'equation', 'theorem', 'principle', 'concept',
    'law', 'rule', 'method', 'process', 'procedure', 'step', 'calculate',
    'solve', 'example', 'problem', 'question', 'answer', 'solution',
    'theory', 'model', 'framework', 'analysis', 'evaluation', 'comparison'
  ];
  
  const contentLower = content.toLowerCase();
  examKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) score += 0.15;
  });
  
  // Boost numerical content and formulas
  if (content.match(/\d+/) && content.match(/[=+\-*/]/)) score += 0.2;
  
  // Boost structured content (lists, steps)
  if (content.match(/^\d+\./) || content.includes('•') || content.includes('first') || content.includes('second')) {
    score += 0.1;
  }
  
  return Math.max(0, Math.min(1, score));
};

const prioritizeExamContent = (chunks: any[], maxTotalLength: number = 8000): string => {
  const sortedChunks = chunks.sort((a, b) => b.relevanceScore - a.relevanceScore);
  let selectedContent = '';
  
  for (const chunk of sortedChunks) {
    if (selectedContent.length + chunk.content.length < maxTotalLength) {
      selectedContent += (selectedContent ? '\n\n' : '') + chunk.content;
    }
  }
  
  return selectedContent;
};

const generateContentTypeExamPrompt = (contentType: string): string => {
  const prompts = {
    pdf: 'Generate questions that test understanding of structured content, formulas, key concepts, and document organization.',
    youtube: 'Create questions about main concepts, examples shown, and sequential learning from video content.',
    audio: 'Focus on spoken concepts, repeated ideas, and key takeaways from audio lectures or discussions.',
    website: 'Test comprehension of web-based information, navigation concepts, and linked ideas.',
    text: 'Generate questions that assess reading comprehension and concept understanding.'
  };
  return prompts[contentType.toLowerCase()] || prompts.text;
};

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

    // Build enhanced content context with smart processing
    let contentContext = '';
    let allProcessedChunks: any[] = [];
    
    if (roomContent.length > 0) {
      contentContext += '\n\n## Room Study Materials (Processed for Exam Generation):\n';
      for (const content of roomContent) {
        contentContext += `\n### ${content.title} (${content.type})\n`;
        
        if (content.text_content) {
          // Apply exam-focused content processing
          const chunks = createExamContentChunks(content.text_content, content.type, 3500);
          allProcessedChunks.push(...chunks.map(chunk => ({ ...chunk, sourceTitle: content.title })));
          
          // Add content type specific exam guidance
          const examPrompt = generateContentTypeExamPrompt(content.type);
          contentContext += `**Exam Focus:** ${examPrompt}\n`;
          
          // Include processed content with relevance priority
          const prioritizedContent = prioritizeExamContent(chunks, 2500);
          contentContext += `**Content:** ${prioritizedContent}\n`;
          
          if (content.text_content.length > 3500) {
            contentContext += `*Note: Content has been prioritized for exam relevance. ${chunks.length} sections processed.*\n`;
          }
        }
      }
    }

    if (additionalResources.length > 0) {
      contentContext += '\n\n## Additional Reference Materials:\n';
      for (const resource of additionalResources) {
        contentContext += `\n### ${resource.title} (${resource.type})\n`;
        if (resource.content) {
          // Process additional resources with same smart chunking
          const chunks = createExamContentChunks(resource.content, resource.type, 2500);
          const prioritizedContent = prioritizeExamContent(chunks, 1500);
          contentContext += `${prioritizedContent}\n`;
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

    // Create enhanced system prompt for intelligent exam generation
    const systemPrompt = `You are an expert educational assessment creator with advanced content processing capabilities. Generate a comprehensive exam based on the intelligently processed study materials.

## EXAM REQUIREMENTS:
- Total Questions: ${numQuestions}
- MCQ Questions: ${mcqCount}
- Open-ended Questions: ${openCount}
- Duration: ${examConfig.examLength} minutes
- Topics: ${examConfig.selectedTopics.join(', ')}

## ENHANCED CONTENT PROCESSING:
The provided content has been processed using:
- Smart chunking based on content format (PDF, video, audio, website, text)
- Relevance scoring to prioritize testable material
- Content type-specific analysis for optimal question generation
- Multi-modal content consideration

## QUESTION GENERATION STRATEGY:
- **MCQ Questions**: Test specific knowledge, definitions, calculations, and concept application
- **Open-ended Questions**: Assess critical thinking, problem-solving, and comprehensive understanding
- **Difficulty Distribution**: Easy 30%, Medium 50%, Hard 20%
- **Content Coverage**: Ensure questions span all major topics and content sources

## RESPONSE FORMAT:
Return a valid JSON object with this exact structure:
{
  "examTitle": "Intelligent Generated Exam - [Main Topic]",
  "instructions": "Clear exam instructions including time management tips",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": "Question text that tests specific concept understanding",
      "points": 5,
      "timeEstimate": 3,
      "difficulty": "medium",
      "topic": "Specific topic name",
      "sourceContent": "Brief reference to source material",
      "options": [
        {"label": "A", "text": "Plausible option A", "isCorrect": false},
        {"label": "B", "text": "Correct answer", "isCorrect": true},
        {"label": "C", "text": "Plausible option C", "isCorrect": false},
        {"label": "D", "text": "Plausible option D", "isCorrect": false}
      ]
    },
    {
      "id": "q2",
      "type": "open",
      "question": "Open-ended question requiring analysis/application",
      "points": 10,
      "timeEstimate": 8,
      "difficulty": "hard",
      "topic": "Topic name",
      "sourceContent": "Reference to relevant source material",
      "sampleAnswer": "Comprehensive sample answer with key points",
      "rubric": ["Key criterion 1", "Key criterion 2", "Application of concepts", "Clear explanation"]
    }
  ]
}

## QUALITY GUIDELINES:
1. Questions must directly relate to and test understanding of the processed content
2. Use content-type specific question styles (formula-based for PDFs, sequential for videos, etc.)
3. MCQ distractors should be plausible and test common misconceptions
4. Open-ended questions should require synthesis and application of multiple concepts
5. Time estimates should reflect question complexity and expected answer depth
6. Include source references to help students understand question context

${contentContext}

Generate an intelligent, comprehensive exam that thoroughly assesses student understanding of the above materials.`;

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