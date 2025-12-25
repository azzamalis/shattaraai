
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { uploadFileToStorage } from '@/lib/storage';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface ChatMessage {
  id: string;
  content: string;
  sender_type: 'user' | 'ai' | 'system';
  created_at: string;
  status?: MessageStatus;
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

  // Helper to format message from DB row
  const formatMessage = useCallback((dbMessage: any): ChatMessage => {
    let attachments: any[] = [];
    if (dbMessage.metadata && typeof dbMessage.metadata === 'object' && dbMessage.metadata !== null) {
      const metadata = dbMessage.metadata as any;
      attachments = Array.isArray(metadata.attachments) ? metadata.attachments : [];
    }
    return {
      id: dbMessage.id,
      content: dbMessage.content,
      sender_type: dbMessage.sender_type as 'user' | 'ai' | 'system',
      created_at: dbMessage.created_at,
      attachments: attachments
    };
  }, []);

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

    // For general conversations without a valid contextId, don't set context_id
    // to avoid FK constraint issues with non-existent content entries
    const conversationData = {
      user_id: user.id,
      type,
      context_id: (contextId && contextType !== 'general') ? contextId : null,
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
      if (conversationId && (conversation?.context_id === contextId || (!contextId && conversation))) {
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
            // Verify content exists before creating conversation (prevent FK constraint violations)
            const { data: contentExists } = await supabase
              .from('content')
              .select('id')
              .eq('id', contextId)
              .single();

            if (!contentExists) {
              console.error('Cannot create conversation: content does not exist', contextId);
              isCreatingRef.current = false;
              return;
            }

            // Create new conversation linked to existing content
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
        } else if (autoCreate) {
          // Handle general conversations without a contextId
          console.log('Looking for existing general conversation');
          
          const { data: existingGeneral, error } = await supabase
            .from('chat_conversations')
            .select('*')
            .eq('type', conversationType)
            .is('context_id', null)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching general conversation:', error);
            isCreatingRef.current = false;
            return;
          }

          if (existingGeneral) {
            console.log('Found existing general conversation:', existingGeneral.id);
            setConversationId(existingGeneral.id);
            setConversation(existingGeneral);
            await fetchMessages(existingGeneral.id);
          } else {
            // Create new general conversation
            console.log('Creating new general conversation');
            const newConversation = await createConversation(conversationType);
            
            if (newConversation) {
              setConversationId(newConversation.id);
              setConversation(newConversation);
              console.log('New general conversation created:', newConversation.id);
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
  }, [conversationType, contextId, contextType, user?.id, autoCreate, conversationId, conversation, fetchMessages, createConversation]);

  // Real-time subscription for chat messages
  useEffect(() => {
    if (!conversationId) return;

    console.log('Setting up real-time subscription for conversation:', conversationId);

    const channel = supabase
      .channel(`chat-messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Real-time message received:', payload);
          const newMessage = payload.new as any;
          
          // Avoid duplicates - check if message already exists
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) {
              console.log('Duplicate message, skipping:', newMessage.id);
              return prev;
            }
            console.log('Adding new message from real-time:', newMessage.id);
            return [...prev, formatMessage(newMessage)];
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Real-time message update:', payload);
          const updatedMessage = payload.new as any;
          setMessages(prev => 
            prev.map(m => m.id === updatedMessage.id ? formatMessage(updatedMessage) : m)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('Real-time message delete:', payload);
          const deletedMessage = payload.old as any;
          setMessages(prev => prev.filter(m => m.id !== deletedMessage.id));
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription for conversation:', conversationId);
      supabase.removeChannel(channel);
    };
  }, [conversationId, formatMessage]);

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
    
    const tempId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    // Add optimistic message with 'sending' status
    const optimisticMessage: ChatMessage = {
      id: tempId,
      content: content,
      sender_type: 'user',
      created_at: timestamp,
      status: 'sending',
      attachments: attachments
    };
    
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    
    try {
      // Check for duplicate using UUID and timestamp (within 5 seconds)
      const existingMessages = await supabase
        .from('chat_messages')
        .select('id, created_at')
        .eq('conversation_id', conversationId)
        .eq('content', content)
        .gte('created_at', new Date(Date.now() - 5000).toISOString());
      
      if (existingMessages.data && existingMessages.data.length > 0) {
        console.log('Duplicate message detected (recent identical content), skipping...');
        // Remove optimistic message
        setMessages(prevMessages => prevMessages.filter(m => m.id !== tempId));
        return null;
      }
      
      const metadata = attachments && attachments.length > 0 ? {
        attachments: attachments,
        hasAttachments: true,
        attachmentCount: attachments.length
      } : null;

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          id: tempId,
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
        throw error;
      }

      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        sender_type: data.sender_type as 'user' | 'ai' | 'system',
        created_at: data.created_at,
        status: 'sent',
        attachments: attachments
      };

      console.log('Created new message with attachments:', newMessage);
      // Replace optimistic message with real one
      setMessages(prevMessages => 
        prevMessages.map(m => m.id === tempId ? newMessage : m)
      );
      return newMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Update optimistic message to failed status
      setMessages(prevMessages => 
        prevMessages.map(m => m.id === tempId ? { ...m, status: 'failed' as MessageStatus } : m)
      );
      toast.error('Failed to send message. Please try again.');
      return null;
    } finally {
      setIsSending(false);
      isSendingRef.current = false;
    }
  };

  const retryMessage = async (messageId: string): Promise<ChatMessage | null> => {
    const failedMessage = messages.find(m => m.id === messageId && m.status === 'failed');
    if (!failedMessage) return null;
    
    // Remove the failed message first
    setMessages(prevMessages => prevMessages.filter(m => m.id !== messageId));
    
    // Retry sending with the same content
    return sendMessage(failedMessage.content, failedMessage.attachments);
  };

  const addAIResponse = async (content: string, messageType?: string, metadata?: any) => {
    if (!conversationId) {
      console.error('Conversation not initialized');
      return;
    }

    // Prevent duplicate AI responses - use conversation ID + content hash
    const responseHash = `${conversationId}-${content.substring(0, 50)}`;
    if (isAddingAIResponseRef.current) {
      console.log('Already adding AI response, skipping duplicate...', responseHash);
      return;
    }

    isAddingAIResponseRef.current = true;
    
    // Add small delay to prevent race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Double-check if this response was already added
      const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('id, content')
        .eq('conversation_id', conversationId)
        .eq('sender_type', 'ai')
        .order('created_at', { ascending: false })
        .limit(3);

      // Check if identical response already exists
      const isDuplicate = existingMessages?.some(msg => 
        msg.content === content || msg.content.substring(0, 100) === content.substring(0, 100)
      );

      if (isDuplicate) {
        console.log('Duplicate AI response detected, skipping insert');
        isAddingAIResponseRef.current = false;
        return;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'ai',
          content: content,
          user_id: user?.id || '',
          message_type: 'ai_response', // Always use ai_response type
          metadata: metadata || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding AI response:', error);
        isAddingAIResponseRef.current = false;
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
      // Keep the flag set for a bit longer to prevent rapid duplicates
      setTimeout(() => {
        isAddingAIResponseRef.current = false;
      }, 500);
    }
  };

  return {
    conversation,
    messages,
    isLoading,
    isSending,
    sendMessage,
    addAIResponse,
    retryMessage
  };
}
