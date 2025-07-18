import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  created_at: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
  }>;
}

interface UseChatConversationProps {
  conversationType: 'general' | 'content';
  contentId?: string;
  autoCreate?: boolean;
}

export function useChatConversation({
  conversationType,
  contentId,
  autoCreate = false
}: UseChatConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const formattedMessages: ChatMessage[] = data.map(message => ({
        id: message.id,
        content: message.content,
        sender_type: message.sender_type,
        created_at: message.created_at,
        attachments: message.attachments
      }));

      setMessages(formattedMessages);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (): Promise<string | null> => {
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([
          {
            type: conversationType,
            content_id: contentId,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }, [conversationType, contentId, user]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        let query = supabase
          .from('conversations')
          .select('*')
          .eq('type', conversationType)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (contentId) {
          query = supabase
            .from('conversations')
            .select('*')
            .eq('type', conversationType)
            .eq('content_id', contentId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
        }

        const { data: existingConversation, error } = await query;

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching conversation:', error);
          return;
        }

        if (existingConversation) {
          setConversationId(existingConversation.id);
          await fetchMessages(existingConversation.id);
        } else if (autoCreate) {
          const newConversationId = await createConversation();
          if (newConversationId) {
            setConversationId(newConversationId);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationType, contentId, user, fetchMessages, autoCreate, createConversation]);

  const sendMessage = async (content: string, attachments?: any): Promise<ChatMessage | null> => {
    if (!user || !conversationId) {
      console.error('User not authenticated or conversation not initialized');
      return null;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_type: 'user',
            content: content,
            user_id: user.id,
            attachments: attachments || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        sender_type: data.sender_type,
        created_at: data.created_at,
        attachments: data.attachments
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } finally {
      setIsSending(false);
    }
  };

  const addAIResponse = async (content: string) => {
    if (!conversationId) {
      console.error('Conversation not initialized');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_type: 'ai',
            content: content
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding AI response:', error);
        return;
      }

      const aiMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        sender_type: data.sender_type,
        created_at: data.created_at,
        attachments: data.attachments
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error adding AI response:', error);
    }
  };

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  };
}
