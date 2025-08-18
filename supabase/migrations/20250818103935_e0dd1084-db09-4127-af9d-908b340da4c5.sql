-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.calculate_exam_metrics()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Calculate time taken if completed_at is set
  IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.time_taken_minutes = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) / 60;
  END IF;
  
  RETURN NEW;
END;
$$;