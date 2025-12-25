-- Enable REPLICA IDENTITY FULL for real-time updates
ALTER TABLE public.flashcards REPLICA IDENTITY FULL;
ALTER TABLE public.quizzes REPLICA IDENTITY FULL;
ALTER TABLE public.summaries REPLICA IDENTITY FULL;

-- Add tables to realtime publication (content is already a member)
ALTER PUBLICATION supabase_realtime ADD TABLE public.flashcards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.summaries;