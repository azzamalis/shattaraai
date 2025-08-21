-- Add real-time transcription fields to recordings table
ALTER TABLE public.recordings 
ADD COLUMN IF NOT EXISTS real_time_transcript JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS transcription_progress DECIMAL(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS transcription_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS audio_chunks_processed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS transcription_confidence DECIMAL(3,2) DEFAULT 0.00;

-- Add index for better real-time performance
CREATE INDEX IF NOT EXISTS idx_recordings_transcription_status ON public.recordings(transcription_status);
CREATE INDEX IF NOT EXISTS idx_recordings_real_time_transcript ON public.recordings USING GIN(real_time_transcript);

-- Add comments for documentation
COMMENT ON COLUMN public.recordings.real_time_transcript IS 'Array of real-time transcription chunks with timestamps';
COMMENT ON COLUMN public.recordings.transcription_progress IS 'Percentage of audio transcribed (0.00-100.00)';
COMMENT ON COLUMN public.recordings.transcription_status IS 'Status: pending, processing, completed, failed';
COMMENT ON COLUMN public.recordings.audio_chunks_processed IS 'Number of audio chunks processed for transcription';
COMMENT ON COLUMN public.recordings.transcription_confidence IS 'Average confidence score of transcription (0.00-1.00)';