-- Add processing_status and chapters fields to content table
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending';
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS chapters JSONB;
ALTER TABLE public.content ADD COLUMN IF NOT EXISTS transcription_confidence DECIMAL;

-- Add index for better performance on processing_status queries
CREATE INDEX IF NOT EXISTS idx_content_processing_status ON public.content(processing_status);

-- Update existing records to have pending status
UPDATE public.content SET processing_status = 'pending' WHERE processing_status IS NULL;