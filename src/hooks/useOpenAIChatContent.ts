import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseOpenAIChatContentOptions {
  conversationId?: string;
  contextId?: string;
  conversationHistory?: Array<{
    content: string;
    sender_type: 'user' | 'ai';
  }>;
  contentData?: {
    title: string;
    type: string;
    text_content?: string;
    summary?: string;
    chapters?: any[];
  };
  attachments?: Array<{
    url: string;
    name: string;
    type: string;
    content?: string;
  }>;
}

export function useOpenAIChatContent({
  conversationId,
  contextId,
  conversationHistory = [],
  contentData,
  attachments = []
}: UseOpenAIChatContentOptions) {
  
  // Non-streaming message (for backward compatibility)
  const sendMessageToAI = useCallback(async (message: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat-content', {
        body: {
          message,
          conversationId,
          contextId,
          conversationHistory,
          contentData,
          attachments,
          stream: false
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.response) {
        throw new Error('No response received from AI');
      }

      return data.response;
    } catch (error) {
      console.error('Exception in sendMessageToAI:', error);
      toast.error('Failed to get AI response');
      return "I'm sorry, I encountered an error. Please try again.";
    }
  }, [conversationId, contextId, conversationHistory, contentData, attachments]);

  // Streaming message
  const streamMessageToAI = useCallback(async (
    message: string,
    onDelta: (text: string) => void,
    onDone: () => void
  ): Promise<void> => {
    try {
      // SECURITY FIX: Get user's session token instead of using anon key
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error('You must be logged in to use the AI chat');
        onDone();
        return;
      }

      const response = await fetch('https://trvuidenkjqqlwadlosh.supabase.co/functions/v1/openai-chat-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydnVpZGVua2pxcWx3YWRsb3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTMzNzIsImV4cCI6MjA2MzEyOTM3Mn0.V72-VE9VMW8a7XWiRxEbHznEBMn70yB6AvgqRc7yWFo',
        },
        body: JSON.stringify({
          message,
          conversationId,
          contextId,
          conversationHistory,
          contentData,
          attachments,
          stream: true
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please log in again.');
          onDone();
          return;
        }
        if (response.status === 429) {
          toast.error('Rate limit exceeded. Please try again later.');
          onDone();
          return;
        }
        throw new Error('Failed to start stream');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            onDone();
            return;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              onDelta(content);
            }
          } catch {
            // Incomplete JSON, put it back
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (buffer.trim()) {
        for (let raw of buffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onDelta(content);
          } catch { /* ignore */ }
        }
      }

      onDone();
    } catch (error) {
      console.error('Streaming error:', error);
      toast.error('Failed to get AI response');
      onDone();
    }
  }, [conversationId, contextId, conversationHistory, contentData, attachments]);

  return { sendMessageToAI, streamMessageToAI };
}