
-- Drop the existing constraint that's preventing new content types
ALTER TABLE public.content DROP CONSTRAINT IF EXISTS content_type_check;

-- Add the updated constraint with all supported content types including the new ones
ALTER TABLE public.content ADD CONSTRAINT content_type_check 
CHECK (type = ANY (ARRAY['file'::text, 'video'::text, 'pdf'::text, 'recording'::text, 'live_recording'::text, 'audio_file'::text, 'youtube'::text, 'website'::text, 'text'::text, 'chat'::text, 'upload'::text]));
