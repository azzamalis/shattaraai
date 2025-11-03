-- Add thumbnail_url column to content table if it doesn't exist
ALTER TABLE public.content 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;