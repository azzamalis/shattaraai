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
}

export function useOpenAIChatContent({
  conversationId,
  contextId,
  conversationHistory = [],
  contentData
}: UseOpenAIChatContentOptions) {
  
  const sendMessageToAI = useCallback(async (message: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat-content', {
        body: {
          message,
          conversationId,
          contextId,
          conversationHistory,
          contentData
        }
      });

      if (error) {
        console.error('Error calling OpenAI chat function:', error);
        
        // Handle specific error cases
        if (error.message?.includes('Rate limit')) {
          toast.error('Rate limit reached. Please try again later.');
          return 'I apologize, but you\'ve reached your rate limit for AI requests. Please try again later.';
        }
        
        if (error.message?.includes('authentication')) {
          toast.error('Authentication error. Please sign in again.');
          return 'There was an authentication issue. Please try signing in again.';
        }
        
        if (error.message?.includes('API key')) {
          toast.error('AI service temporarily unavailable.');
          return 'I apologize, but the AI service is temporarily unavailable. Please try again later.';
        }

        // Generic error fallback
        toast.error('Failed to get AI response');
        return 'I apologize, but I\'m having trouble processing your request right now. Please try again.';
      }

      if (!data?.response) {
        console.error('No response from AI function:', data);
        toast.error('No response received from AI');
        return 'I apologize, but I didn\'t receive a proper response. Please try again.';
      }

      return data.response;
    } catch (error) {
      console.error('Exception in sendMessageToAI:', error);
      toast.error('An unexpected error occurred');
      return 'I apologize, but something unexpected happened. Please try again.';
    }
  }, [conversationId, contextId, conversationHistory, contentData]);

  return { sendMessageToAI };
}