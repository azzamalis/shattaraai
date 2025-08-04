
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  message: string;
  conversationId: string;
  roomId: string;
  roomContent?: Array<{
    id: string;
    title: string;
    type: string;
    text_content?: string;
    metadata?: any;
  }>;
  conversationHistory?: Array<{
    content: string;
    sender_type: 'user' | 'ai';
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, roomId, roomContent = [], conversationHistory = [] }: ChatRequest = await req.json();

    if (!message || !conversationId || !roomId) {
      throw new Error('Missing required fields: message, conversationId, or roomId');
    }

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Enhanced content context building with chunking for large content
    const roomContext = roomContent.map(content => {
      let contextText = `📄 ${content.title} (${content.type}):`;
      
      // Handle different content types with specialized processing
      switch (content.type) {
        case 'youtube':
          if (content.text_content) {
            // Chunk large YouTube transcripts
            const transcript = content.text_content.length > 3000 
              ? content.text_content.substring(0, 3000) + '... [transcript continues]'
              : content.text_content;
            contextText += `\n📝 Transcript: ${transcript}`;
          }
          
          // Include chapters for YouTube videos  
          if (content.metadata?.chapters && Array.isArray(content.metadata.chapters)) {
            const chapters = content.metadata.chapters.slice(0, 10).map((chapter: any) => 
              `${Math.floor(chapter.startTime / 60)}:${(chapter.startTime % 60).toString().padStart(2, '0')} - ${chapter.title}`
            ).join('\n');
            contextText += `\n📋 Chapters:\n${chapters}`;
            if (content.metadata.chapters.length > 10) {
              contextText += `\n... and ${content.metadata.chapters.length - 10} more chapters`;
            }
          }
          
          // Include video metadata
          if (content.metadata?.channelTitle) {
            contextText += `\n👤 Channel: ${content.metadata.channelTitle}`;
            if (content.metadata.publishedAt) {
              contextText += `\n📅 Published: ${new Date(content.metadata.publishedAt).toLocaleDateString()}`;
            }
            if (content.metadata.duration) {
              const minutes = Math.floor(content.metadata.duration / 60);
              const seconds = content.metadata.duration % 60;
              contextText += `\n⏱️ Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
          }
          break;

        case 'pdf':
          if (content.text_content) {
            // Chunk large PDF content and provide summary
            const pdfText = content.text_content.length > 4000 
              ? content.text_content.substring(0, 4000) + '... [document continues]'
              : content.text_content;
            contextText += `\n📖 Content: ${pdfText}`;
            
            if (content.text_content.length > 4000) {
              const wordCount = content.text_content.split(' ').length;
              contextText += `\n📊 Document stats: ~${wordCount} words, ${Math.ceil(wordCount / 250)} pages estimated`;
            }
          } else {
            contextText += '\n⚠️ PDF text not yet extracted';
          }
          break;

        case 'audio_file':
          if (content.text_content) {
            const transcript = content.text_content.length > 3000 
              ? content.text_content.substring(0, 3000) + '... [transcript continues]'
              : content.text_content;
            contextText += `\n🎵 Transcript: ${transcript}`;
          } else {
            contextText += '\n⚠️ Audio transcript not yet available';
          }
          break;

        case 'video':
          if (content.text_content) {
            const transcript = content.text_content.length > 3000 
              ? content.text_content.substring(0, 3000) + '... [transcript continues]'
              : content.text_content;
            contextText += `\n🎬 Transcript: ${transcript}`;
          } else {
            contextText += '\n⚠️ Video transcript not yet available';
          }
          break;

        case 'website':
          if (content.text_content) {
            const webContent = content.text_content.length > 2000 
              ? content.text_content.substring(0, 2000) + '... [content continues]'
              : content.text_content;
            contextText += `\n🌐 Content: ${webContent}`;
          } else {
            contextText += '\n⚠️ Website content not yet extracted';
          }
          if (content.url) {
            contextText += `\n🔗 URL: ${content.url}`;
          }
          break;

        case 'text':
        case 'chat':
          if (content.text_content) {
            const textContent = content.text_content.length > 2000 
              ? content.text_content.substring(0, 2000) + '... [content continues]'
              : content.text_content;
            contextText += `\n📝 Content: ${textContent}`;
          }
          break;

        case 'file':
          if (content.text_content) {
            const fileContent = content.text_content.length > 3000 
              ? content.text_content.substring(0, 3000) + '... [document continues]'
              : content.text_content;
            contextText += `\n📁 Content: ${fileContent}`;
          } else {
            contextText += '\n⚠️ Document text not yet extracted';
          }
          if (content.filename) {
            contextText += `\n📎 Filename: ${content.filename}`;
          }
          break;

        default:
          if (content.text_content) {
            contextText += `\n📄 Content: ${content.text_content}`;
          } else {
            contextText += '\n⚠️ No text content available yet';
          }
      }
      
      // Add metadata info if available
      if (content.metadata?.fileSize) {
        const sizeInMB = (content.metadata.fileSize / (1024 * 1024)).toFixed(2);
        contextText += `\n💾 Size: ${sizeInMB} MB`;
      }
      
      return contextText;
    }).join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI Tutor'}: ${msg.content}`)
      .join('\n');

    // Construct the enhanced system prompt
    const systemPrompt = `You are Shattara AI Tutor, an intelligent educational assistant helping students learn from their study materials. You are currently in a study room where the student has organized their learning content.

📚 ROOM CONTENT AVAILABLE:
${roomContext || 'No content available in this room yet. Encourage the student to add their study materials (PDFs, videos, notes, etc.) to get started.'}

💬 RECENT CONVERSATION:
${conversationContext || 'This is the start of the conversation.'}

🎯 INSTRUCTIONS:
- Be helpful, encouraging, and educational with a friendly, approachable tone
- ALWAYS reference specific content from the room when answering questions
- When content is not yet processed (shows "not yet extracted/available"), let the student know it's being processed
- Provide explanations at an appropriate academic level for the student
- Help students understand concepts rather than just giving direct answers
- Encourage critical thinking and ask follow-up questions
- If asked about content that's chunked (shows "continues"), offer to dive deeper into specific sections
- Use the emojis and formatting in your responses to make them more engaging
- When referencing content, use the title and type (e.g., "Based on your PDF 'Chapter 5 Notes'...")
- Suggest practical study strategies and techniques based on the available content
- If no content is available, guide the student on how to add materials to the room

🔍 CONTENT ANALYSIS CAPABILITIES:
- PDF documents: Can analyze text, summarize key points, create study guides
- YouTube videos: Can reference transcripts, chapters, and timestamps
- Audio files: Can work with transcripts for lectures and recordings  
- Websites: Can analyze articles and web content
- Notes and text: Can help organize and expand on written materials
- Documents: Can process various file formats for text analysis

Remember: Your goal is to be an intelligent study companion that helps students learn effectively from their materials.`;

    // Prepare the Gemini API request
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nStudent Question: ${message}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Call Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequest),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const aiResponse = geminiData.candidates[0].content.parts[0].text;

    // Store AI response in the database
    const { error: insertError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        content: aiResponse,
        sender_type: 'ai',
        message_type: 'ai_response',
        metadata: {
          model: 'gemini-1.5-flash-latest',
          room_id: roomId,
          generated_at: new Date().toISOString()
        }
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store AI response');
    }

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    
    // Return a fallback response
    const fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me anything about your study materials!";
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        success: false,
        error: error.message 
      }),
      {
        status: 200, // Return 200 to avoid breaking the chat flow
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
