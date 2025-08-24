import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
const activeConnections = new Map<string, { socket: WebSocket; userId: string; recordingId: string }>();

// Broadcast transcription update to specific client
function broadcastTranscriptionUpdate(recordingId: string, userId: string, update: any) {
  for (const [connectionId, connection] of activeConnections) {
    if (connection.recordingId === recordingId && connection.userId === userId) {
      try {
        connection.socket.send(JSON.stringify({
          type: 'transcription_update',
          data: update
        }));
      } catch (error) {
        console.error(`Failed to send update to connection ${connectionId}:`, error);
        activeConnections.delete(connectionId);
      }
    }
  }
}

// Generate chapters using OpenAI
async function generateChapters(recordingId: string, socket: WebSocket) {
  try {
    console.log(`Generating chapters for recording ${recordingId}`);
    
    // Fetch transcript data
    const { data: recording, error: fetchError } = await supabase
      .from('recordings')
      .select('transcript, real_time_transcript')
      .eq('content_id', recordingId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // No recording found - this is expected for new live recordings without transcript yet
        console.log(`No recording found for content_id ${recordingId} - skipping chapter generation for new live recording`);
        socket.send(JSON.stringify({
          type: 'chapters_error',
          error: 'No transcript available yet for new recording'
        }));
      } else {
        console.error('Error fetching recording for chapters:', fetchError);
        socket.send(JSON.stringify({
          type: 'chapters_error',
          error: 'Failed to fetch recording data'
        }));
      }
      return;
    }

    const transcript = recording.transcript || 
      (recording.real_time_transcript?.map((chunk: any) => chunk.text).join(' ')) || '';

    if (!transcript.trim()) {
      socket.send(JSON.stringify({
        type: 'chapters_error',
        error: 'No transcript available for chapter generation'
      }));
      return;
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      socket.send(JSON.stringify({
        type: 'chapters_error',
        error: 'OpenAI API not configured'
      }));
      return;
    }

    // Request chapters from OpenAI
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
            content: `You are an expert at analyzing transcripts and creating meaningful chapters. 
            Create 3-7 chapters for the given transcript. Each chapter should represent a distinct topic or theme.
            
            Return your response as a valid JSON array with this exact structure:
            [
              {
                "title": "Chapter Title",
                "summary": "Brief summary of what this chapter covers",
                "startTime": 0,
                "endTime": 120
              }
            ]
            
            Rules:
            - startTime and endTime should be in seconds
            - Chapters should not overlap
            - Cover the entire transcript duration
            - Keep titles concise (3-8 words)
            - Keep summaries brief (1-2 sentences)
            - Return ONLY the JSON array, no other text`
          },
          {
            role: 'user',
            content: `Please create chapters for this transcript:\n\n${transcript}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      socket.send(JSON.stringify({
        type: 'chapters_error',
        error: 'Failed to generate chapters'
      }));
      return;
    }

    const result = await response.json();
    const chaptersText = result.choices[0].message.content;
    
    let chapters;
    try {
      chapters = JSON.parse(chaptersText);
    } catch (parseError) {
      console.error('Failed to parse chapters JSON:', parseError);
      socket.send(JSON.stringify({
        type: 'chapters_error',
        error: 'Failed to parse generated chapters'
      }));
      return;
    }

    // Update recording with chapters
    const { error: updateError } = await supabase
      .from('recordings')
      .update({
        chapters: chapters,
        processing_status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('content_id', recordingId);

    if (updateError) {
      console.error('Error updating recording with chapters:', updateError);
    }

    // Send chapters to client
    socket.send(JSON.stringify({
      type: 'chapters_generated',
      chapters: chapters
    }));

    console.log(`Generated ${chapters.length} chapters for recording ${recordingId}`);

  } catch (error) {
    console.error('Error generating chapters:', error);
    socket.send(JSON.stringify({
      type: 'chapters_error',
      error: 'Unexpected error generating chapters'
    }));
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Request must be a WebSocket upgrade", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const connectionId = crypto.randomUUID();
  
  console.log(`WebSocket connection established: ${connectionId}`);

  socket.onopen = () => {
    console.log(`WebSocket opened for connection ${connectionId}`);
  };

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log(`Received message on connection ${connectionId}:`, message.type);

      switch (message.type) {
        case 'subscribe': {
          const { recordingId, userId } = message;
          if (!recordingId || !userId) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Missing recordingId or userId'
            }));
            return;
          }

          // Store connection
          activeConnections.set(connectionId, {
            socket,
            userId,
            recordingId
          });

          // Fetch initial data - handle case where recording doesn't exist yet (new live recording)
          const { data: recording, error } = await supabase
            .from('recordings')
            .select('real_time_transcript, chapters, transcription_status, processing_status')
            .eq('content_id', recordingId)
            .single();

          // For new live recordings, the recording might not exist in the database yet
          // This is normal behavior, so we'll send empty initial data instead of an error
          let initialData = {
            transcriptionChunks: [],
            chapters: [],
            transcriptionStatus: 'ready',
            processingStatus: 'ready'
          };

          if (error && error.code === 'PGRST116') {
            // No rows returned - this is expected for new live recordings
            console.log(`No recording found for content_id ${recordingId} - initializing empty state for new live recording`);
          } else if (error) {
            // Unexpected error
            console.error('Unexpected error fetching recording:', error);
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Failed to fetch recording data'
            }));
            return;
          } else if (recording) {
            // Recording exists, use its data
            initialData = {
              transcriptionChunks: recording.real_time_transcript || [],
              chapters: recording.chapters || [],
              transcriptionStatus: recording.transcription_status || 'ready',
              processingStatus: recording.processing_status || 'ready'
            };
          }

          // Send initial data
          socket.send(JSON.stringify({
            type: 'initial_data',
            data: initialData
          }));

          socket.send(JSON.stringify({
            type: 'subscribed',
            recordingId
          }));

          break;
        }

        case 'request_chapters': {
          const { recordingId } = message;
          if (!recordingId) {
            socket.send(JSON.stringify({
              type: 'error',
              message: 'Missing recordingId'
            }));
            return;
          }

          await generateChapters(recordingId, socket);
          break;
        }

        case 'unsubscribe': {
          activeConnections.delete(connectionId);
          socket.send(JSON.stringify({
            type: 'unsubscribed'
          }));
          break;
        }

        default:
          console.log(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error handling WebSocket message on connection ${connectionId}:`, error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  };

  socket.onclose = () => {
    console.log(`WebSocket closed for connection ${connectionId}`);
    activeConnections.delete(connectionId);
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error on connection ${connectionId}:`, error);
    activeConnections.delete(connectionId);
  };

  return response;
});