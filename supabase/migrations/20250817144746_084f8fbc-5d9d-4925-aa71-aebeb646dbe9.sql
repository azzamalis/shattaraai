-- Create enum for question types
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'free_text');

-- Create enum for exam attempt status
CREATE TYPE public.exam_attempt_status AS ENUM ('in_progress', 'completed', 'abandoned');

-- Create exams table
CREATE TABLE public.exams (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    total_questions INTEGER NOT NULL DEFAULT 0,
    time_limit_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_exams_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE
);

-- Create exam_questions table
CREATE TABLE public.exam_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID NOT NULL,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'multiple_choice',
    options JSONB,
    correct_answer TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    order_index INTEGER NOT NULL,
    reference_source TEXT,
    reference_time TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_exam_questions_exam FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE
);

-- Create exam_attempts table
CREATE TABLE public.exam_attempts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID NOT NULL,
    user_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 0,
    status exam_attempt_status NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_exam_attempts_exam FOREIGN KEY (exam_id) REFERENCES public.exams(id) ON DELETE CASCADE
);

-- Create exam_answers table
CREATE TABLE public.exam_answers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_attempt_id UUID NOT NULL,
    question_id UUID NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT fk_exam_answers_attempt FOREIGN KEY (exam_attempt_id) REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_exam_answers_question FOREIGN KEY (question_id) REFERENCES public.exam_questions(id) ON DELETE CASCADE,
    UNIQUE(exam_attempt_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX idx_exams_user_id ON public.exams(user_id);
CREATE INDEX idx_exams_room_id ON public.exams(room_id);
CREATE INDEX idx_exam_questions_exam_id ON public.exam_questions(exam_id);
CREATE INDEX idx_exam_questions_order ON public.exam_questions(exam_id, order_index);
CREATE INDEX idx_exam_attempts_exam_id ON public.exam_attempts(exam_id);
CREATE INDEX idx_exam_attempts_user_id ON public.exam_attempts(user_id);
CREATE INDEX idx_exam_answers_attempt_id ON public.exam_answers(exam_attempt_id);
CREATE INDEX idx_exam_answers_question_id ON public.exam_answers(question_id);

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.user_owns_exam(exam_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exams 
    WHERE id = exam_uuid AND user_id = auth.uid()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_owns_room_for_exam(exam_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exams e
    JOIN public.rooms r ON e.room_id = r.id
    WHERE e.id = exam_uuid AND r.user_id = auth.uid()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_owns_exam_via_question(question_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exam_questions eq
    JOIN public.exams e ON eq.exam_id = e.id
    WHERE eq.id = question_uuid AND e.user_id = auth.uid()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_owns_exam_attempt(attempt_uuid uuid)
RETURNS BOOLEAN AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exam_attempts 
    WHERE id = attempt_uuid AND user_id = auth.uid()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exams table
CREATE POLICY "Users can view their own exams" 
ON public.exams FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create exams in their own rooms" 
ON public.exams FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS(SELECT 1 FROM public.rooms WHERE id = room_id AND user_id = auth.uid())
);

CREATE POLICY "Users can update their own exams" 
ON public.exams FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exams" 
ON public.exams FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for exam_questions table
CREATE POLICY "Users can view questions from their exams" 
ON public.exam_questions FOR SELECT 
USING (public.user_owns_exam(exam_id));

CREATE POLICY "Users can create questions in their exams" 
ON public.exam_questions FOR INSERT 
WITH CHECK (public.user_owns_exam(exam_id));

CREATE POLICY "Users can update questions in their exams" 
ON public.exam_questions FOR UPDATE 
USING (public.user_owns_exam(exam_id));

CREATE POLICY "Users can delete questions from their exams" 
ON public.exam_questions FOR DELETE 
USING (public.user_owns_exam(exam_id));

-- RLS Policies for exam_attempts table
CREATE POLICY "Users can view their own exam attempts" 
ON public.exam_attempts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create attempts for accessible exams" 
ON public.exam_attempts FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  public.user_owns_room_for_exam(exam_id)
);

CREATE POLICY "Users can update their own exam attempts" 
ON public.exam_attempts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exam attempts" 
ON public.exam_attempts FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for exam_answers table
CREATE POLICY "Users can view their own exam answers" 
ON public.exam_answers FOR SELECT 
USING (public.user_owns_exam_attempt(exam_attempt_id));

CREATE POLICY "Users can create answers in their exam attempts" 
ON public.exam_answers FOR INSERT 
WITH CHECK (public.user_owns_exam_attempt(exam_attempt_id));

CREATE POLICY "Users can update their own exam answers" 
ON public.exam_answers FOR UPDATE 
USING (public.user_owns_exam_attempt(exam_attempt_id));

CREATE POLICY "Users can delete their own exam answers" 
ON public.exam_answers FOR DELETE 
USING (public.user_owns_exam_attempt(exam_attempt_id));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_exams_updated_at
    BEFORE UPDATE ON public.exams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_exam_questions_updated_at
    BEFORE UPDATE ON public.exam_questions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_exam_attempts_updated_at
    BEFORE UPDATE ON public.exam_attempts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_exam_answers_updated_at
    BEFORE UPDATE ON public.exam_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();