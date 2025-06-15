
-- Create a storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-files', 
  'pdf-files', 
  true, 
  52428800, -- 50MB limit
  ARRAY['application/pdf']
);

-- Create RLS policies for the PDF files bucket
CREATE POLICY "Users can upload their own PDF files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pdf-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own PDF files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'pdf-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own PDF files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pdf-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own PDF files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pdf-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add a storage_path column to the content table to track file locations
ALTER TABLE content ADD COLUMN storage_path TEXT;

-- Enable realtime for content table to sync updates
ALTER TABLE content REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE content;
