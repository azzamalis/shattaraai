import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { retryWithBackoff, handleError, showErrorToast } from '@/lib/errorHandling';

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
  
  const sendMessageToAI = useCallback(async (message: string): Promise<string> => {
    try {
      // Use retry with backoff for reliability
      const response = await retryWithBackoff(async () => {
        const { data, error } = await supabase.functions.invoke('openai-chat-content', {
          body: {
            message,
            conversationId,
            contextId,
            conversationHistory,
            contentData,
            attachments
          }
        });

        if (error) {
          throw error;
        }

        if (!data?.response) {
          throw new Error('No response received from AI');
        }

        return data.response;
      }, 3, 2000);

      return response;
    } catch (error) {
      console.error('Exception in sendMessageToAI:', error);
      
      // Use centralized error handling
      const errorInfo = handleError(error, 'AI Chat');
      
      // Show error toast with retry option
      showErrorToast(errorInfo, () => {
        // Trigger a retry by the user
        toast.info('Click send again to retry');
      });
      
      return errorInfo.message;
    }
  }, [conversationId, contextId, conversationHistory, contentData, attachments]);

  return { sendMessageToAI };
}