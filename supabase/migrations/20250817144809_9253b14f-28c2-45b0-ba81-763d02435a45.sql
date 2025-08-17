-- Fix security warnings by updating functions with proper search_path
DROP FUNCTION IF EXISTS public.user_owns_exam(uuid);
DROP FUNCTION IF EXISTS public.user_owns_room_for_exam(uuid);
DROP FUNCTION IF EXISTS public.user_owns_exam_via_question(uuid);
DROP FUNCTION IF EXISTS public.user_owns_exam_attempt(uuid);

-- Recreate security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.user_owns_exam(exam_uuid uuid)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exams 
    WHERE id = exam_uuid AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_room_for_exam(exam_uuid uuid)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exams e
    JOIN public.rooms r ON e.room_id = r.id
    WHERE e.id = exam_uuid AND r.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_exam_via_question(question_uuid uuid)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exam_questions eq
    JOIN public.exams e ON eq.exam_id = e.id
    WHERE eq.id = question_uuid AND e.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.user_owns_exam_attempt(attempt_uuid uuid)
RETURNS BOOLEAN 
LANGUAGE SQL 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.exam_attempts 
    WHERE id = attempt_uuid AND user_id = auth.uid()
  );
$$;