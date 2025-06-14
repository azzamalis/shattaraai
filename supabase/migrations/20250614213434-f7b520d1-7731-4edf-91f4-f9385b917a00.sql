
-- Create recordings table for audio content metadata
CREATE TABLE public.recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  audio_file_path TEXT,
  transcript TEXT,
  duration INTEGER, -- in seconds
  waveform_data JSONB,
  chapters JSONB, -- chapter markers with timestamps
  processing_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to recordings table
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

-- Create policies for recordings table
CREATE POLICY "Users can view their own recordings" 
  ON public.recordings 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.content 
    WHERE content.id = recordings.content_id 
    AND content.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own recordings" 
  ON public.recordings 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.content 
    WHERE content.id = recordings.content_id 
    AND content.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own recordings" 
  ON public.recordings 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.content 
    WHERE content.id = recordings.content_id 
    AND content.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own recordings" 
  ON public.recordings 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.content 
    WHERE content.id = recordings.content_id 
    AND content.user_id = auth.uid()
  ));

-- Create storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-recordings', 'audio-recordings', false);

-- Create storage policies for audio recordings bucket
CREATE POLICY "Users can upload their own recordings" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own recordings" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own recordings" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own recordings" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'audio-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for updated_at on recordings table
CREATE TRIGGER handle_updated_at_recordings
  BEFORE UPDATE ON public.recordings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
