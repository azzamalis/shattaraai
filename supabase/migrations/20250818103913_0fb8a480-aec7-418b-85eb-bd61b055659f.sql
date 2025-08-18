-- Add missing columns to exam_attempts table for comprehensive exam results
ALTER TABLE public.exam_attempts 
ADD COLUMN IF NOT EXISTS skipped_questions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS time_taken_minutes integer DEFAULT 0;

-- Add index for better performance when querying exam attempts
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_exam ON public.exam_attempts(user_id, exam_id);

-- Update the updated_at trigger to work with the new columns
CREATE OR REPLACE FUNCTION public.calculate_exam_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate time taken if completed_at is set
  IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.time_taken_minutes = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) / 60;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate time taken
DROP TRIGGER IF EXISTS calculate_exam_metrics_trigger ON public.exam_attempts;
CREATE TRIGGER calculate_exam_metrics_trigger
  BEFORE UPDATE ON public.exam_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_exam_metrics();