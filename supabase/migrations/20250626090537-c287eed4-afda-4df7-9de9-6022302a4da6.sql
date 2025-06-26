
-- Create storage buckets for different content types
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('videos', 'videos', true),
  ('audio-files', 'audio-files', true),
  ('documents', 'documents', true),
  ('images', 'images', true);

-- Create RLS policies for videos bucket
CREATE POLICY "Allow public access to video files" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Allow authenticated users to upload videos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own videos" ON storage.objects
FOR UPDATE USING (bucket_id = 'videos' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own videos" ON storage.objects
FOR DELETE USING (bucket_id = 'videos' AND auth.uid() = owner);

-- Create RLS policies for audio-files bucket
CREATE POLICY "Allow public access to audio files" ON storage.objects
FOR SELECT USING (bucket_id = 'audio-files');

CREATE POLICY "Allow authenticated users to upload audio files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own audio files" ON storage.objects
FOR UPDATE USING (bucket_id = 'audio-files' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own audio files" ON storage.objects
FOR DELETE USING (bucket_id = 'audio-files' AND auth.uid() = owner);

-- Create RLS policies for documents bucket
CREATE POLICY "Allow public access to document files" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.uid() = owner);

-- Create RLS policies for images bucket
CREATE POLICY "Allow public access to image files" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid() = owner);

-- Enable real-time functionality for content table (only if not already enabled)
ALTER TABLE public.content REPLICA IDENTITY FULL;

-- Update content table to utilize storage_path column properly
UPDATE public.content SET storage_path = url WHERE storage_path IS NULL AND url IS NOT NULL;
