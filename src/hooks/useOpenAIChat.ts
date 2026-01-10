import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseOpenAIChatOptions {
  conversationId: string;
  roomId: string;
  roomContent?: Array<{
    id: string;
    title: string;
    type: string;
    text_content?: string;
  }>;
  conversationHistory?: Array<{
    content: string;
    sender_type: 'user' | 'ai';
  }>;
}

export function useOpenAIChat({
  conversationId,
  roomId,
  roomContent = [],
  conversationHistory = []
}: UseOpenAIChatOptions) {
  // Non-streaming message (for backward compatibility)
  const sendMessageToAI = useCallback(async (message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-room-chat', {
        body: {
          message,
          conversationId,
          roomId,
          roomContent,
          conversationHistory,
          stream: false
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Check for authentication errors
        if (error.message?.includes('authorization') || error.message?.includes('auth')) {
          toast.error('Authentication error. Please refresh the page and try again.');
          return "I'm having trouble authenticating your request. Please refresh the page and try again.";
        }
        
        // Check for API key errors
        if (error.message?.includes('API key') || error.message?.includes('OPENAI_API_KEY')) {
          toast.error('AI service configuration error. Please contact support.');
          return "I'm having trouble connecting to the AI service. Please contact support for assistance.";
        }
        
        throw new Error('Failed to get AI response');
      }

      if (!data?.success) {
        console.error('AI function error:', data?.error);
        if (data?.response) {
          // Return fallback response
          return data.response;
        }
        throw new Error('AI service unavailable');
      }

      return data.response;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Return a fallback response instead of throwing
      return "I'm sorry, I'm having trouble responding right now. Please try asking your question again, or feel free to explore your study materials in this room.";
    }
  }, [conversationId, roomId, roomContent, conversationHistory]);

  // Streaming message handler
  const streamMessageToAI = useCallback(async (
    message: string,
    onDelta: (text: string) => void,
    onDone: () => void
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('Please sign in to continue');
        onDone();
        return;
      }

      const response = await fetch(
        `https://trvuidenkjqqlwadlosh.supabase.co/functions/v1/openai-room-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydnVpZGVua2pxcWx3YWRsb3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTMzNzIsImV4cCI6MjA2MzEyOTM3Mn0.V72-VE9VMW8a7XWiRxEbHznEBMn70yB6AvgqRc7yWFo'
          },
          body: JSON.stringify({
            message,
            conversationId,
            roomId,
            roomContent,
            conversationHistory,
            stream: true
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Streaming request failed:', errorText);
        toast.error('Failed to get AI response');
        onDone();
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error('No reader available');
        onDone();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmedLine.slice(6));
            
            if (json.error) {
              console.error('Stream error:', json.error);
              toast.error('AI response error');
              break;
            }
            
            if (json.delta) {
              onDelta(json.delta);
            }
            
            if (json.done) {
              break;
            }
          } catch (parseError) {
            // Skip malformed JSON chunks
          }
        }
      }

      onDone();
    } catch (error) {
      console.error('Streaming error:', error);
      toast.error('Failed to stream AI response');
      onDone();
    }
  }, [conversationId, roomId, roomContent, conversationHistory]);

  return { sendMessageToAI, streamMessageToAI };
}
