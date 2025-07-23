-- First clean up orphaned chat conversations and messages
DELETE FROM public.chat_messages 
WHERE conversation_id IN (
  SELECT id FROM public.chat_conversations 
  WHERE context_id IS NOT NULL 
  AND context_id NOT IN (SELECT id FROM public.content)
);

DELETE FROM public.chat_conversations 
WHERE context_id IS NOT NULL 
AND context_id NOT IN (SELECT id FROM public.content);

-- Now add the foreign key constraint for cascade deletes
ALTER TABLE public.chat_conversations 
ADD CONSTRAINT fk_chat_conversations_content 
FOREIGN KEY (context_id) 
REFERENCES public.content(id) 
ON DELETE CASCADE;