
import { useState, useCallback, useEffect } from 'react';
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

    // Create content entry for general chats to make them persistent and accessible from dashboard
    let contentId = contextId;
    if (type === 'general' && !contextId) {
      try {
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .insert({
            user_id: user.id,
            title: 'New Chat Session',
            type: 'chat',
            processing_status: 'completed',
            text_content: 'Chat conversation in progress...',
            metadata: { conversation_type: 'general', auto_generated: true }
          })
          .select()
          .single();

        if (contentError) throw contentError;
        contentId = contentData.id;
        console.log('Created content entry for chat:', contentData);
      } catch (error) {
        console.error('Error creating content entry:', error);
        toast({
          title: "Warning",
          description: "Chat created but may not appear in history.",
          variant: "destructive",
        });
      }
    }

    const conversationData = {
      user_id: user.id,
      type,
      context_id: contentId || null,
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

      setIsLoading(true);
      try {
        // If we have a contextId, always look for that specific conversation first
        if (contextId) {
          console.log('Looking for conversation with contextId:', contextId);
          
          let query = supabase
            .from('chat_conversations')
            .select('*')
            .eq('type', conversationType)
            .eq('user_id', user.id)
            .eq('context_type', contextType || 'content')
            .order('created_at', { ascending: false })
            .limit(1);

          // For room collaboration, check metadata instead of context_id
          if (conversationType === 'room_collaboration') {
            query = query.contains('metadata', { room_id: contextId });
          } else {
            query = query.eq('context_id', contextId);
          }

          const { data: existingConversation, error } = await query.maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching conversation:', error);
            return;
          }

          if (existingConversation) {
            console.log('Loading existing conversation for contextId:', existingConversation.id);
            setConversationId(existingConversation.id);
            setConversation(existingConversation);
            await fetchMessages(existingConversation.id);
          } else if (autoCreate) {
            // Create new conversation for this specific contextId
            console.log('Creating new conversation for contextId:', contextId);
            const newConversation = await createConversation(conversationType, contextId, contextType);
            if (newConversation) {
              setConversationId(newConversation.id);
              setConversation(newConversation);
              setMessages([]); // Start with empty messages for new conversation
            }
          }
        } else if (autoCreate) {
          // For general chat without contextId, always create a new conversation
          console.log('Creating new general conversation');
          const newConversation = await createConversation(conversationType);
          if (newConversation) {
            setConversationId(newConversation.id);
            setConversation(newConversation);
            setMessages([]); // Start with empty messages for new conversation
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
      const processedAttachments = attachments?.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size
      })) || [];

      console.log('Sending message with files:', attachments);
      console.log('Sending message with processed attachments:', processedAttachments);

      // Create the metadata object with attachments
      const metadata = processedAttachments.length > 0 ? { attachments: processedAttachments } : null;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'user',
          content: content,
          user_id: user.id,
          metadata: metadata
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

      console.log('Created new message with attachments:', newMessage);
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
          metadata: metadata || null
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
