-- Add granular status columns for independent retry of transcription and chapters
-- This allows users to retry just the failed component instead of the entire processing

-- Add transcript_status column with default 'pending'
ALTER TABLE public.content 
ADD COLUMN IF NOT EXISTS transcript_status text DEFAULT 'pending';

-- Add chapters_status column with default 'pending'  
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS chapters_status text DEFAULT 'pending';

-- Add transcript_error column to store error messages for debugging
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS transcript_error text;

-- Add chapters_error column to store error messages for debugging
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS chapters_error text;

-- Add last_transcript_attempt to track when transcription was last attempted
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS last_transcript_attempt timestamp with time zone;

-- Add last_chapters_attempt to track when chapter generation was last attempted
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS last_chapters_attempt timestamp with time zone;

-- Add transcript_attempts counter for retry limiting
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS transcript_attempts integer DEFAULT 0;

-- Add chapters_attempts counter for retry limiting
ALTER TABLE public.content
ADD COLUMN IF NOT EXISTS chapters_attempts integer DEFAULT 0;

-- Create index for efficient querying of failed items
CREATE INDEX IF NOT EXISTS idx_content_transcript_status ON public.content(transcript_status) WHERE transcript_status IN ('failed', 'pending');
CREATE INDEX IF NOT EXISTS idx_content_chapters_status ON public.content(chapters_status) WHERE chapters_status IN ('failed', 'pending');

-- Add comment for documentation
COMMENT ON COLUMN public.content.transcript_status IS 'Status of transcript extraction: pending, processing, completed, failed, skipped';
COMMENT ON COLUMN public.content.chapters_status IS 'Status of chapter generation: pending, processing, completed, failed, skipped, not_applicable';
COMMENT ON COLUMN public.content.transcript_error IS 'Error message from last failed transcript attempt';
COMMENT ON COLUMN public.content.chapters_error IS 'Error message from last failed chapter generation attempt';
COMMENT ON COLUMN public.content.transcript_attempts IS 'Number of transcript extraction attempts for retry limiting';
COMMENT ON COLUMN public.content.chapters_attempts IS 'Number of chapter generation attempts for retry limiting';