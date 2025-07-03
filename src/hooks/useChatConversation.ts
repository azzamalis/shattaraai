
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type ConversationType = Database['public']['Enums']['conversation_type'];
type MessageType = Database['public']['Enums']['message_type'];

export interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  message_type: MessageType;
  created_at: string;
  metadata?: any;
}

export interface ChatConversation {
  id: string;
  title?: string;
  type: ConversationType;
  context_id?: string;
  context_type?: string;
  last_message_at?: string;
  created_at: string;
  metadata?: any;
}

interface UseChatConversationOptions {
  conversationType: ConversationType;
  contextId?: string;
  contextType?: string;
  autoCreate?: boolean;
}

// Helper function to convert database message to ChatMessage
const convertToChatMessage = (dbMessage: any): ChatMessage => ({
  id: dbMessage.id,
  content: dbMessage.content,
  sender_type: dbMessage.sender_type as 'user' | 'ai' | 'system',
  message_type: dbMessage.message_type,
  created_at: dbMessage.created_at,
  metadata: dbMessage.metadata
});

export function useChatConversation({
  conversationType,
  contextId,
  contextType,
  autoCreate = true
}: UseChatConversationOptions) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Find or create conversation
  const initializeConversation = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // First, try to find existing conversation
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', conversationType)
        .eq('is_archived', false);

      if (contextId) {
        query = query.eq('context_id', contextId);
      }
      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      const { data: existingConversations } = await query
        .order('last_message_at', { ascending: false })
        .limit(1);

      let conversationData = existingConversations?.[0];

      // Create new conversation if none exists and autoCreate is enabled
      if (!conversationData && autoCreate) {
        const { data: newConversation, error } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: user.id,
            type: conversationType,
            context_id: contextId,
            context_type: contextType,
            title: generateConversationTitle(conversationType, contextType)
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating conversation:', error);
          toast.error('Failed to create conversation');
          return;
        }

        conversationData = newConversation;
      }

      if (conversationData) {
        setConversation(conversationData);
        await loadMessages(conversationData.id);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setIsLoading(false);
    }
  }, [user, conversationType, contextId, contextType, autoCreate]);

  // Load messages for conversation
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      // Convert database messages to ChatMessage format
      const chatMessages = (data || []).map(convertToChatMessage);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (
    content: string,
    messageType: MessageType = 'text',
    metadata?: any
  ) => {
    if (!conversation || !user || !content.trim()) return;

    try {
      setIsSending(true);

      // Optimistic update
      const tempMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        sender_type: 'user',
        message_type: messageType,
        created_at: new Date().toISOString(),
        metadata
      };

      setMessages(prev => [...prev, tempMessage]);

      // Send to database
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          user_id: user.id,
          content: content.trim(),
          sender_type: 'user',
          message_type: messageType,
          metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        // Remove optimistic update
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        return;
      }

      // Replace optimistic update with real message
      const realMessage = convertToChatMessage(data);
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? realMessage : msg
      ));

      return realMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  }, [conversation, user]);

  // Add AI response
  const addAIResponse = useCallback(async (
    content: string,
    messageType: MessageType = 'ai_response',
    metadata?: any
  ) => {
    if (!conversation || !user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          user_id: user.id,
          content,
          sender_type: 'ai',
          message_type: messageType,
          metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding AI response:', error);
        return;
      }

      const aiMessage = convertToChatMessage(data);
      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
    } catch (error) {
      console.error('Error adding AI response:', error);
    }
  }, [conversation, user]);

  // Archive conversation
  const archiveConversation = useCallback(async () => {
    if (!conversation) return;

    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ is_archived: true })
        .eq('id', conversation.id);

      if (error) {
        console.error('Error archiving conversation:', error);
        toast.error('Failed to archive conversation');
        return;
      }

      toast.success('Conversation archived');
      setConversation(null);
      setMessages([]);
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast.error('Failed to archive conversation');
    }
  }, [conversation]);

  // Set up real-time subscription
  useEffect(() => {
    if (!conversation) return;

    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversation.id}`
        },
        (payload) => {
          const newMessage = convertToChatMessage(payload.new);
          setMessages(prev => {
            // Avoid duplicates (in case of optimistic updates)
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation]);

  // Initialize conversation on mount
  useEffect(() => {
    initializeConversation();
  }, [initializeConversation]);

  return {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse,
    archiveConversation,
    refreshConversation: initializeConversation
  };
}

function generateConversationTitle(type: ConversationType, contextType?: string): string {
  switch (type) {
    case 'general':
      return 'AI Tutor Chat';
    case 'content_discussion':
      return `${contextType ? contextType.charAt(0).toUpperCase() + contextType.slice(1) : 'Content'} Discussion`;
    case 'room_collaboration':
      return 'Room Collaboration';
    case 'exam_support':
      return 'Exam Support';
    default:
      return 'Chat';
  }
}
