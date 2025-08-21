import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Store active WebSocket connections
const activeConnections = new Map<string, WebSocket>();

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let recordingId: string | null = null;
  let userId: string | null = null;

  socket.onopen = () => {
    console.log("WebSocket connection opened for real-time transcription");
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data.type);

      switch (data.type) {
        case 'subscribe':
          recordingId = data.recordingId;
          userId = data.userId;
          
          if (recordingId && userId) {
            activeConnections.set(`${userId}-${recordingId}`, socket);
            console.log(`Client subscribed to recording ${recordingId} for user ${userId}`);
            
            // Send initial transcription data
            const { data: recording, error } = await supabase
              .from('recordings')
              .select('real_time_transcript, transcription_progress, transcription_status, transcription_confidence, chapters')
              .eq('content_id', recordingId)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (!error && recording) {
              socket.send(JSON.stringify({
                type: 'initial_transcript',
                recordingId,
                transcript: recording.real_time_transcript || [],
                progress: recording.transcription_progress || 0,
                status: recording.transcription_status || 'pending',
                confidence: recording.transcription_confidence || 0
              }));
            }
          }
          break;

        case 'request_chapters':
          if (recordingId) {
            await generateChapters(recordingId, socket);
          }
          break;

        case 'unsubscribe':
          if (recordingId && userId) {
            activeConnections.delete(`${userId}-${recordingId}`);
            console.log(`Client unsubscribed from recording ${recordingId}`);
          }
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  };

  socket.onclose = () => {
    if (recordingId && userId) {
      activeConnections.delete(`${userId}-${recordingId}`);
      console.log(`WebSocket connection closed for recording ${recordingId}`);
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});

// Function to generate chapters from transcription using AI
async function generateChapters(recordingId: string, socket: WebSocket) {
  try {
    console.log(`Generating chapters for recording ${recordingId}`);

    const { data: recording, error } = await supabase
      .from('recordings')
      .select('real_time_transcript, transcript')
      .eq('content_id', recordingId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !recording) {
      console.error('Error fetching recording for chapter generation:', error);
      return;
    }

    // Combine real-time transcript chunks into full text
    const realTimeTranscript = recording.real_time_transcript || [];
    const fullText = realTimeTranscript.length > 0 
      ? realTimeTranscript.map((chunk: any) => chunk.text).join(' ')
      : recording.transcript || '';

    if (!fullText.trim()) {
      socket.send(JSON.stringify({
        type: 'chapters_update',
        recordingId,
        chapters: [],
        message: 'No transcript available for chapter generation'
      }));
      return;
    }

    // Use OpenAI to generate chapters
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured for chapter generation');
      return;
    }

    const prompt = `Analyze the following transcript and identify natural chapter breaks. Create 3-7 chapters with meaningful titles and brief summaries. Each chapter should represent a distinct topic or section.

Transcript:
${fullText}

Please respond with a JSON array of chapters in this format:
[
  {
    "title": "Chapter Title",
    "summary": "Brief summary of what this chapter covers",
    "startTime": 0,
    "endTime": 30
  }
]

Estimate start and end times based on the natural flow of the content.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing transcripts and creating meaningful chapter divisions. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error for chapter generation:', await response.text());
      return;
    }

    const result = await response.json();
    const chaptersText = result.choices[0].message.content;
    
    try {
      const chapters = JSON.parse(chaptersText);
      
      // Update recording with generated chapters
      const { error: updateError } = await supabase
        .from('recordings')
        .update({
          chapters: chapters,
          updated_at: new Date().toISOString()
        })
        .eq('content_id', recordingId);

      if (updateError) {
        console.error('Error updating chapters:', updateError);
      }

      // Send chapters to WebSocket client
      socket.send(JSON.stringify({
        type: 'chapters_update',
        recordingId,
        chapters: chapters
      }));

      console.log(`Generated ${chapters.length} chapters for recording ${recordingId}`);

    } catch (parseError) {
      console.error('Error parsing generated chapters:', parseError);
      socket.send(JSON.stringify({
        type: 'chapters_update',
        recordingId,
        chapters: [],
        error: 'Failed to parse generated chapters'
      }));
    }

  } catch (error) {
    console.error('Error in generateChapters:', error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Failed to generate chapters'
    }));
  }
}

// Broadcast transcription updates to active connections
export async function broadcastTranscriptionUpdate(recordingId: string, userId: string, update: any) {
  const connectionKey = `${userId}-${recordingId}`;
  const socket = activeConnections.get(connectionKey);
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      type: 'transcription_update',
      recordingId,
      ...update
    }));
    console.log(`Broadcasted transcription update to ${connectionKey}`);
  }
}