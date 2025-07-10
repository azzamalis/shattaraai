
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
        
        // Check for authentication errors
        if (error.message?.includes('authorization') || error.message?.includes('auth')) {
          toast.error('Authentication error. Please refresh the page and try again.');
          return "I'm having trouble authenticating your request. Please refresh the page and try again.";
        }
        
        // Check for API key errors
        if (error.message?.includes('API key') || error.message?.includes('GOOGLE_GEMINI_API_KEY')) {
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
      console.error('Error calling Gemini AI:', error);
      toast.error('Failed to get AI response. Please try again.');
      
      // Return a fallback response instead of throwing
      return "I'm sorry, I'm having trouble responding right now. Please try asking your question again, or feel free to explore your study materials in this room.";
    }
  }, [conversationId, roomId, roomContent, conversationHistory]);

  return { sendMessageToAI };
}
