-- Create summaries table for storing multiple summaries per content
CREATE TABLE public.summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('brief', 'standard', 'detailed')),
  summary TEXT NOT NULL,
  key_points JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own summaries"
  ON public.summaries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own summaries"
  ON public.summaries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own summaries"
  ON public.summaries
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own summaries"
  ON public.summaries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_summaries_content_id ON public.summaries(content_id);
CREATE INDEX idx_summaries_user_id ON public.summaries(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_summaries_updated_at
  BEFORE UPDATE ON public.summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();