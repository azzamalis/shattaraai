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
    const generateTitleAndMetadata = async () => {
      try {
        // Get the first few messages from the conversation
        const { data: messages, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(10); // Get more messages for better metadata

        if (error || !messages || messages.length === 0) {
          console.log('No messages found for title generation');
          return;
        }

        // Use the first user message or initial query to generate a title
        const firstUserMessage = messages.find(m => m.sender_type === 'user')?.content || initialQuery;
        
        if (!firstUserMessage) return;

        // Generate a concise title from the first message (max 50 chars)
        let generatedTitle = firstUserMessage.length > 50 
          ? firstUserMessage.substring(0, 47) + '...'
          : firstUserMessage;

        // Clean up the title
        generatedTitle = generatedTitle
          .replace(/^\s*help\s+me\s*/i, '') // Remove "help me" prefix
          .replace(/^\s*how\s+/i, 'How ') // Capitalize "how"
          .replace(/^\s*what\s+/i, 'What ') // Capitalize "what"
          .replace(/^\s*why\s+/i, 'Why ') // Capitalize "why"
          .replace(/^\s*when\s+/i, 'When ') // Capitalize "when"
          .replace(/^\s*where\s+/i, 'Where ') // Capitalize "where"
          .trim();

        // Fallback to generic title if too short
        if (generatedTitle.length < 5) {
          generatedTitle = 'Chat with Shattara AI';
        }

        console.log('Generated chat title:', generatedTitle);

        // Update the conversation title
        await supabase
          .from('chat_conversations')
          .update({ title: generatedTitle })
          .eq('id', conversationId);

        // Update the content title and metadata if contentId is provided
        if (contentId) {
          await supabase
            .from('content')
            .update({ title: generatedTitle })
            .eq('id', contentId);

          // Generate and update comprehensive chat metadata
          await updateContentWithChatMetadata(contentId, conversationId, messages);
        }

        // Notify parent component
        onTitleGenerated?.(generatedTitle);

      } catch (error) {
        console.error('Error generating chat title and metadata:', error);
      }
    };

    // Generate title and metadata after a delay to allow messages to be added
    const timer = setTimeout(generateTitleAndMetadata, 3000);
    return () => clearTimeout(timer);
  }, [conversationId, initialQuery, contentId, onTitleGenerated]);

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