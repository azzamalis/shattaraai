
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { uploadFileToStorage } from '@/lib/storage';
import { toast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  created_at: string;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
    uploadedAt: string;
  }>;
}

interface UseChatConversationProps {
  conversationType: 'general' | 'content_discussion' | 'room_collaboration' | 'exam_support';
  contextId?: string;
  contextType?: string;
  autoCreate?: boolean;
}

type ConversationType = 'general' | 'content_discussion' | 'room_collaboration' | 'exam_support';

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
  const isCreatingRef = useRef(false);
  const isSendingRef = useRef(false);
  const isAddingAIResponseRef = useRef(false);

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
          attachments = Array.isArray(metadata.attachments) ? metadata.attachments : [];
        }

        console.log('Processing message:', message.id, 'metadata:', message.metadata, 'attachments:', attachments);

        return {
          id: message.id,
          content: message.content,
          sender_type: message.sender_type as 'user' | 'ai' | 'system',
          created_at: message.created_at,
          attachments: attachments
        };
      });

      console.log('Fetched messages with attachments:', formattedMessages);
      setMessages(formattedMessages);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConversation = useCallback(async (type: ConversationType, contextId?: string, contextType?: string) => {
    if (!user?.id) throw new Error('User not authenticated');

    console.log('Creating conversation with params:', { type, contextId, contextType });

    const conversationData = {
      user_id: user.id,
      type,
      // For room_collaboration, context_id should be null (foreign key points to content table)
      context_id: type === 'room_collaboration' ? null : (contextId || null),
      context_type: contextType || 'content',
      metadata: type === 'room_collaboration' ? { room_id: contextId } : {}
    };

    const { data, error } = await supabase
      .from('chat_conversations')
      .insert(conversationData)
      .select()
      .single();

    if (error) throw error;

    console.log('Created conversation:', data);
    return data;
  }, [user?.id]);

  useEffect(() => {
    const loadConversation = async () => {
      if (!user) {
        console.log('User not authenticated, waiting for authentication');
        return;
      }

      // Skip if already creating or if we already have a conversation
      if (isCreatingRef.current) {
        console.log('Already creating conversation, skipping...');
        return;
      }

      // Skip if we already have a conversation for this context
      if (conversationId && conversation?.context_id === contextId) {
        console.log('Conversation already loaded for this context:', conversationId);
        return;
      }

      isCreatingRef.current = true;
      setIsLoading(true);
      
      try {
        // If we have a contextId (content ID), try to find existing conversation first
        if (contextId) {
          console.log('Looking for conversation with contextId:', contextId);
          
          const { data: existingConversation, error } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('context_id', contextId)
            .eq('context_type', contextType || 'content')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching conversation:', error);
            isCreatingRef.current = false;
            return;
          }

          if (existingConversation) {
            console.log('Found existing conversation:', existingConversation.id);
            setConversationId(existingConversation.id);
            setConversation(existingConversation);
            await fetchMessages(existingConversation.id);
          } else if (autoCreate) {
            // Create new conversation linked to content
            console.log('Creating new conversation with context:', contextId);
            const newConversation = await createConversation(
              conversationType,
              contextId,
              contextType || 'content'
            );
            
            if (newConversation) {
              setConversationId(newConversation.id);
              setConversation(newConversation);
              
              // Update content with conversation link in metadata
              await supabase
                .from('content')
                .update({ 
                  metadata: { conversationId: newConversation.id },
                  processing_status: 'processing'
                })
                .eq('id', contextId);
              
              console.log('New conversation created and linked:', newConversation.id);
            }
          }
        }
      } catch (error) {
        console.error('Error in loadConversation:', error);
      } finally {
        setIsLoading(false);
        isCreatingRef.current = false;
      }
    };

    loadConversation();
  }, [conversationType, contextId, contextType, user?.id]);

  const sendMessage = async (
    content: string, 
    attachments?: Array<{
      name: string;
      type: string;
      size: number;
      url: string;
      uploadedAt: string;
    }>
  ): Promise<ChatMessage | null> => {
    if (!user || !conversationId) {
      console.error('User not authenticated or conversation not initialized');
      return null;
    }

    if (isSendingRef.current) {
      console.log('Already sending message, skipping duplicate...');
      return null;
    }

    isSendingRef.current = true;
    setIsSending(true);
    try {
      const metadata = attachments && attachments.length > 0 ? {
        attachments: attachments,
        hasAttachments: true,
        attachmentCount: attachments.length
      } : null;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversationId,
          sender_type: 'user',
          content: content,
          user_id: user.id,
          message_type: 'text',
          metadata: metadata
        }])
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
        attachments: attachments
      };

      console.log('Created new message with attachments:', newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      return newMessage;
    } finally {
      setIsSending(false);
      isSendingRef.current = false;
    }
  };

  const addAIResponse = async (content: string, messageType?: string, metadata?: any) => {
    if (!conversationId) {
      console.error('Conversation not initialized');
      return;
    }

    // Prevent duplicate AI responses using ref guard
    if (isAddingAIResponseRef.current) {
      console.log('Already adding AI response, skipping duplicate call');
      return;
    }

    isAddingAIResponseRef.current = true;
    console.log('Adding AI response to conversation:', conversationId);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'ai',
          content: content,
          user_id: user?.id || '',
          message_type: 'ai_response',
          metadata: metadata || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding AI response:', error);
        return;
      }

      console.log('AI response added successfully:', data.id);

      // Safely parse metadata for attachments
      let attachments: any[] = [];
      if (data.metadata && typeof data.metadata === 'object' && data.metadata !== null) {
        const parsedMetadata = data.metadata as any;
        attachments = Array.isArray(parsedMetadata.attachments) ? parsedMetadata.attachments : [];
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
    } finally {
      // Reset flag after a brief delay to prevent rapid duplicate calls
      setTimeout(() => {
        isAddingAIResponseRef.current = false;
      }, 300);
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
