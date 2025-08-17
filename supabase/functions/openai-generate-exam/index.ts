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

    console.log('Processing exam generation for user:', user.id);

    // Check rate limits for exam generation
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        user_uuid: user.id,
        request_type: 'exam',
        estimated_tokens: 4000
      });

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
    } else if (rateLimitData && rateLimitData.length > 0) {
      const rateLimit = rateLimitData[0];
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Daily exam generation limit reached. Plan: ${rateLimit.plan_type}. Resets at: ${rateLimit.reset_time}`,
            rateLimitInfo: {
              remaining: rateLimit.remaining_requests,
              resetTime: rateLimit.reset_time,
              planType: rateLimit.plan_type
            }
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Create cache key for exam generation
    const examCacheKey = `exam_${user.id}_${roomId}`;
    const examContentHash = JSON.stringify({ roomContent, additionalResources, examConfig }).substring(0, 100);
    
    // Check cache for exam generation
    const { data: cachedExam, error: examCacheError } = await supabase
      .from('ai_cache')
      .select('response_data, hit_count, id')
      .eq('user_id', user.id)
      .eq('cache_key', examCacheKey)
      .eq('content_hash', examContentHash)
      .gt('expires_at', new Date().toISOString())
      .limit(1);

    if (!examCacheError && cachedExam && cachedExam.length > 0) {
      console.log('Cache hit for exam generation');
      
      // Update hit count
      await supabase
        .from('ai_cache')
        .update({ hit_count: cachedExam[0].hit_count + 1 })
        .eq('id', cachedExam[0].id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          exam: cachedExam[0].response_data.exam,
          cached: true
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build content context ONLY from user-selected materials
    let contentContext = '';
    let allProcessedChunks: any[] = [];
    
    // Process ONLY user-selected content from Step 1
    if (roomContent.length > 0) {
      contentContext += '\n\n## User-Selected Study Materials:\n';
      console.log(`Processing ${roomContent.length} user-selected content items`);
      
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

    // Process additional resources ONLY if user added them in Step 2
    if (additionalResources.length > 0) {
      contentContext += '\n\n## User-Added Additional Resources (Step 2):\n';
      console.log(`Processing ${additionalResources.length} user-added additional resources`);
      
      for (const resource of additionalResources) {
        contentContext += `\n### ${resource.title} (${resource.type})\n`;
        if (resource.content) {
          // Process additional resources with same smart chunking
          const chunks = createExamContentChunks(resource.content, resource.type, 2500);
          const prioritizedContent = prioritizeExamContent(chunks, 1500);
          contentContext += `${prioritizedContent}\n`;
        }
      }
    } else {
      console.log('No additional resources added by user in Step 2');
    }

    // Determine question distribution based on user preferences
    const { numQuestions, questionType } = examConfig;
    let mcqCount = 0;
    let openCount = 0;

    if (questionType === 'Multiple Choice') {
      mcqCount = numQuestions;
      openCount = 0;
    } else if (questionType === 'Free Writing') {
      mcqCount = 0;
      openCount = numQuestions;
    } else { // Both
      mcqCount = Math.ceil(numQuestions / 2); // 50% MCQ
      openCount = Math.floor(numQuestions / 2); // 50% Open-ended
    }
    
    console.log(`User preferences: ${numQuestions} total questions, ${questionType} type, ${mcqCount} MCQ, ${openCount} open-ended`);

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

    // Define model configurations with proper parameter support
    const modelConfigs = [
      {
        name: 'gpt-4.1-2025-04-14',
        supportsTemperature: true,
        maxTokens: 4000,
        description: 'Primary GPT-4.1 model'
      },
      {
        name: 'gpt-4.1-mini-2025-04-14',
        supportsTemperature: true,
        maxTokens: 4000,
        description: 'Fallback GPT-4.1 mini model'
      },
      {
        name: 'gpt-4o-mini',
        supportsTemperature: true,
        maxTokens: 4000,
        description: 'Legacy fallback model'
      }
    ];

    let response;
    let modelUsed = '';
    let aiData;

    // Try each model in sequence with proper error handling
    for (const config of modelConfigs) {
      try {
        console.log(`Attempting exam generation with ${config.name}`);
        
        const requestBody: any = {
          model: config.name,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            }
          ],
          max_completion_tokens: config.maxTokens,
          response_format: { type: "json_object" }
        };

        // Only add temperature for models that support it
        if (config.supportsTemperature) {
          requestBody.temperature = 0.4;
        }

        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          aiData = await response.json();
          modelUsed = config.name;
          console.log(`Successfully generated exam with ${config.name}`);
          break;
        } else {
          const errorData = await response.text();
          console.error(`${config.name} failed:`, response.status, errorData);
          
          // If this is a temperature error, try without temperature
          if (errorData.includes('temperature') && config.supportsTemperature) {
            console.log(`Retrying ${config.name} without temperature parameter`);
            delete requestBody.temperature;
            
            const retryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
            });

            if (retryResponse.ok) {
              aiData = await retryResponse.json();
              modelUsed = config.name;
              console.log(`Successfully generated exam with ${config.name} (no temperature)`);
              response = retryResponse;
              break;
            }
          }
        }
      } catch (error) {
        console.error(`Error with ${config.name}:`, error);
        continue;
      }
    }

    // If all models failed, provide a structured fallback response
    if (!response || !response.ok || !aiData) {
      console.error('All OpenAI models failed, generating fallback exam');
      
      // Create a basic fallback exam structure
      const fallbackExam = {
        examTitle: `Study Review - ${examConfig.selectedTopics.join(', ')}`,
        instructions: `This is a ${examConfig.examLength}-minute exam covering your study materials. Answer all questions to the best of your ability.`,
        questions: []
      };

      // Generate basic questions based on content
      const questionCount = Math.min(examConfig.numQuestions, 10); // Limit fallback questions
      for (let i = 1; i <= questionCount; i++) {
        if (examConfig.questionType === 'MCQ' || (examConfig.questionType === 'Both' && i <= Math.ceil(questionCount * 0.7))) {
          fallbackExam.questions.push({
            id: `q${i}`,
            type: 'mcq',
            question: `Which of the following best describes a key concept from your study materials?`,
            points: 5,
            timeEstimate: 3,
            difficulty: 'medium',
            topic: examConfig.selectedTopics[0] || 'General',
            sourceContent: 'Study materials',
            options: [
              { label: 'A', text: 'Option A', isCorrect: false },
              { label: 'B', text: 'Option B', isCorrect: true },
              { label: 'C', text: 'Option C', isCorrect: false },
              { label: 'D', text: 'Option D', isCorrect: false }
            ]
          });
        } else {
          fallbackExam.questions.push({
            id: `q${i}`,
            type: 'open',
            question: `Explain a key concept from your study materials and provide examples.`,
            points: 10,
            timeEstimate: 8,
            difficulty: 'medium',
            topic: examConfig.selectedTopics[0] || 'General',
            sourceContent: 'Study materials',
            sampleAnswer: 'A comprehensive answer should include key concepts and relevant examples.',
            rubric: ['Clear explanation', 'Relevant examples', 'Proper understanding']
          });
        }
      }

      // Add metadata for fallback
      fallbackExam.metadata = {
        generatedAt: new Date().toISOString(),
        model: 'fallback',
        roomId: roomId,
        userId: user.id,
        config: examConfig,
        tokensUsed: 0,
        cached: false,
        fallback: true
      };

      return new Response(
        JSON.stringify({ 
          success: true, 
          exam: fallbackExam,
          warning: 'Generated using fallback system due to AI service unavailability'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
      model: modelUsed || aiData.model || 'unknown',
      roomId: roomId,
      userId: user.id,
      config: examConfig,
      tokensUsed: aiData.usage?.total_tokens || 0,
      cached: false
    };
    
    // Include original content for AI evaluation
    examData.originalContent = contentContext;

    console.log(`Successfully generated exam with ${examData.questions?.length || 0} questions`);

    // Cache the exam for future requests
    try {
      const { data: planData } = await supabase
        .rpc('get_user_plan_quotas', { user_uuid: user.id });
      
      const cacheHours = planData?.[0]?.cache_duration_hours || 24;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + cacheHours);

      await supabase
        .from('ai_cache')
        .insert({
          user_id: user.id,
          cache_key: examCacheKey,
          response_data: { exam: examData },
          content_hash: examContentHash,
          model_name: modelUsed || aiData.model || 'unknown',
          expires_at: expiresAt.toISOString()
        });
    } catch (cacheInsertError) {
      console.error('Cache insertion error:', cacheInsertError);
    }

    // Update usage tracking for exam generation
    try {
      const tokensUsed = aiData.usage?.total_tokens || 3000;
      const estimatedCost = (tokensUsed / 1000000) * 0.15;

      await supabase
        .from('ai_usage_counters')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          exam_generations: 1,
          total_tokens_used: tokensUsed,
          total_cost_usd: estimatedCost
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });
    } catch (usageError) {
      console.error('Usage tracking error:', usageError);
    }

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