-- Add missing columns for better alignment with contentId, roomId, and userId
-- Add content_metadata column to exams table to store related content information
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS content_metadata JSONB DEFAULT '{}';

-- Update exam_questions table to ensure proper reference tracking
ALTER TABLE public.exam_questions 
ADD COLUMN IF NOT EXISTS explanation TEXT,
ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exams_room_id ON public.exams(room_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_id ON public.exams(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON public.exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_exam_attempt_id ON public.exam_answers(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question_id ON public.exam_answers(question_id);