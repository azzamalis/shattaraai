
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseGeminiChatOptions {
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

export function useGeminiChat({
  conversationId,
  roomId,
  roomContent = [],
  conversationHistory = []
}: UseGeminiChatOptions) {
  const sendMessageToAI = useCallback(async (message: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message,
          conversationId,
          roomId,
          roomContent,
          conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
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
      console.error('Error calling Gemini AI:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Return a fallback response instead of throwing
      return "I'm sorry, I'm having trouble responding right now. Please try asking your question again, or feel free to explore your study materials in this room.";
    }
  }, [conversationId, roomId, roomContent, conversationHistory]);

  return { sendMessageToAI };
}
