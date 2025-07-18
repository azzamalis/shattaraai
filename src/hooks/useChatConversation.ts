
import { useState, useCallback, useEffect } from 'react';
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
  conversationType: 'general' | 'content_discussion' | 'room_collaboration' | 'exam_support';
  contextId?: string;
  contextType?: string;
  autoCreate?: boolean;
}

export function useChatConversation({
  conversationType,
  contextId,
  contextType,
  autoCreate = false
}: UseChatConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);

  const fetchMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      const formattedMessages: ChatMessage[] = data.map(message => {
        // Safely parse metadata and get attachments
        let attachments: any[] = [];
        if (message.metadata && typeof message.metadata === 'object' && message.metadata !== null) {
          const metadata = message.metadata as any;
          attachments = metadata.attachments || [];
        }

        return {
          id: message.id,
          content: message.content,
          sender_type: message.sender_type as 'user' | 'ai' | 'system',
          created_at: message.created_at,
          attachments: attachments
        };
      });

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
        .from('chat_conversations')
        .insert([
          {
            type: conversationType,
            context_id: contextId,
            context_type: contextType,
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
  }, [conversationType, contextId, contextType, user]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        let query = supabase
          .from('chat_conversations')
          .select('*')
          .eq('type', conversationType)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (contextId) {
          query = query.eq('context_id', contextId);
        }

        if (contextType) {
          query = query.eq('context_type', contextType);
        }

        const { data: existingConversation, error } = await query.maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching conversation:', error);
          return;
        }

        if (existingConversation) {
          setConversationId(existingConversation.id);
          setConversation(existingConversation);
          await fetchMessages(existingConversation.id);
        } else if (autoCreate) {
          const newConversationId = await createConversation();
          if (newConversationId) {
            setConversationId(newConversationId);
            // Create a basic conversation object
            const newConversation = {
              id: newConversationId,
              type: conversationType,
              context_id: contextId,
              context_type: contextType,
              user_id: user.id,
              created_at: new Date().toISOString()
            };
            setConversation(newConversation);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadConversation();
  }, [conversationType, contextId, contextType, user, fetchMessages, autoCreate, createConversation]);

  const sendMessage = async (content: string, attachments?: File[]): Promise<ChatMessage | null> => {
    if (!user || !conversationId) {
      console.error('User not authenticated or conversation not initialized');
      return null;
    }

    setIsSending(true);
    try {
      // Process attachments into the format we need
      const processedAttachments = attachments?.map(file => ({
        id: `temp-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: file.type,
        size: file.size
      })) || [];

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'user',
          content: content,
          user_id: user.id,
          metadata: { attachments: processedAttachments }
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        sender_type: data.sender_type as 'user' | 'ai' | 'system',
        created_at: data.created_at,
        attachments: processedAttachments
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } finally {
      setIsSending(false);
    }
  };

  const addAIResponse = async (content: string, messageType?: string, metadata?: any) => {
    if (!conversationId) {
      console.error('Conversation not initialized');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'ai',
          content: content,
          user_id: user?.id || '',
          message_type: (messageType as 'text' | 'system' | 'ai_response' | 'user_query') || 'ai_response',
          metadata: metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding AI response:', error);
        return;
      }

      // Safely parse metadata for attachments
      let attachments: any[] = [];
      if (data.metadata && typeof data.metadata === 'object' && data.metadata !== null) {
        const parsedMetadata = data.metadata as any;
        attachments = parsedMetadata.attachments || [];
      }

      const aiMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        sender_type: data.sender_type as 'user' | 'ai' | 'system',
        created_at: data.created_at,
        attachments: attachments
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error adding AI response:', error);
    }
  };

  return {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse
  };
}
