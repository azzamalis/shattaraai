import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    const generateTitle = async () => {
      try {
        // Get the first few messages from the conversation
        const { data: messages, error } = await supabase
          .from('chat_messages')
          .select('content, sender_type')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(3);

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

        // Update the content title if contentId is provided
        if (contentId) {
          await supabase
            .from('content')
            .update({ title: generatedTitle })
            .eq('id', contentId);
        }

        // Notify parent component
        onTitleGenerated?.(generatedTitle);

      } catch (error) {
        console.error('Error generating chat title:', error);
      }
    };

    // Generate title after a short delay to allow messages to be added
    const timer = setTimeout(generateTitle, 2000);
    return () => clearTimeout(timer);
  }, [conversationId, initialQuery, contentId, onTitleGenerated]);

  return null; // This is a utility component with no UI
}