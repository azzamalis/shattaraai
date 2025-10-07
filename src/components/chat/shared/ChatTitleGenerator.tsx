import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { updateContentWithChatMetadata } from '@/lib/chatMetadata';

interface ChatTitleGeneratorProps {
  conversationId: string;
  initialQuery?: string;
  contentId?: string;
  onTitleGenerated?: (title: string) => void;
}

export function ChatTitleGenerator({ 
  conversationId, 
  initialQuery, 
  contentId,
  onTitleGenerated 
}: ChatTitleGeneratorProps) {
  
  useEffect(() => {
    let isMounted = true;
    
    const generateTitleAndMetadata = async () => {
      if (!isMounted) return;
      
      try {
        // Get the first few messages from the conversation
        const { data: messages, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(10);

        if (!isMounted || error || !messages || messages.length === 0) {
          console.log('No messages found for title generation or component unmounted');
          return;
        }

        // Use the first user message or initial query to generate a title
        const firstUserMessage = messages.find(m => m.sender_type === 'user')?.content || initialQuery;
        
        if (!firstUserMessage || !isMounted) return;

        // Use AI to generate a concise, descriptive title
        let generatedTitle: string;
        try {
          const { data: titleData, error: titleError } = await supabase.functions.invoke('openai-chat-content', {
            body: {
              message: `Generate a concise, descriptive title (max 5 words) for this chat conversation. Only return the title, nothing else:\n\n${firstUserMessage}`,
              conversationHistory: [],
              skipCache: true
            }
          });

          if (!titleError && titleData?.response) {
            generatedTitle = titleData.response.trim().replace(/^["']|["']$/g, '');
            // Ensure title isn't too long
            if (generatedTitle.length > 60) {
              generatedTitle = generatedTitle.substring(0, 57) + '...';
            }
          } else {
            // Fallback to first message truncation
            generatedTitle = firstUserMessage.length > 50 
              ? firstUserMessage.substring(0, 47) + '...'
              : firstUserMessage;
          }
        } catch (error) {
          console.error('Error generating AI title:', error);
          // Fallback to first message truncation
          generatedTitle = firstUserMessage.length > 50 
            ? firstUserMessage.substring(0, 47) + '...'
            : firstUserMessage;
        }

        if (!isMounted || generatedTitle.length < 3) {
          generatedTitle = 'Chat with Shattara AI';
        }

        console.log('Generated chat title:', generatedTitle);

        if (!isMounted) return;

        // Update conversation title
        await supabase
          .from('chat_conversations')
          .update({ title: generatedTitle })
          .eq('id', conversationId);

        // Update content title if contentId is provided
        if (contentId) {
          await supabase
            .from('content')
            .update({ title: generatedTitle })
            .eq('id', contentId);
        }

        // Update metadata if contentId is provided
        if (contentId && isMounted) {
          await updateContentWithChatMetadata(contentId, conversationId, messages);
        }

        if (isMounted) {
          onTitleGenerated?.(generatedTitle);
        }

      } catch (error) {
        console.error('Error generating chat title and metadata:', error);
      }
    };

    // Trigger immediately when we have the initial query, otherwise wait for messages
    const delay = initialQuery ? 1000 : 2000;
    const timer = setTimeout(generateTitleAndMetadata, delay);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [conversationId, initialQuery, contentId]);

  // Set up real-time listener for message updates to refresh metadata
  useEffect(() => {
    if (!contentId || !conversationId) return;

    const channel = supabase
      .channel(`chat-metadata-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, async () => {
        // Update metadata when new messages are added (debounced)
        setTimeout(async () => {
          try {
            const { data: messages } = await supabase
              .from('chat_messages')
              .select('*')
              .eq('conversation_id', conversationId)
              .order('created_at', { ascending: true });

            if (messages && contentId) {
              await updateContentWithChatMetadata(contentId, conversationId, messages);
            }
          } catch (error) {
            console.error('Error updating chat metadata:', error);
          }
        }, 5000); // Update metadata 5 seconds after new message
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, contentId]);

  return null; // This is a utility component with no UI
}