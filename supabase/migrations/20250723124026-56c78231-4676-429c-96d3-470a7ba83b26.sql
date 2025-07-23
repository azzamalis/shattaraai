-- Add cascade delete for chat conversations and messages when content is deleted
ALTER TABLE public.chat_conversations 
ADD CONSTRAINT fk_chat_conversations_content 
FOREIGN KEY (context_id) 
REFERENCES public.content(id) 
ON DELETE CASCADE;