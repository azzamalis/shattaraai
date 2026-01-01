-- Make all public buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN (
  'videos', 
  'audio-files', 
  'documents', 
  'images', 
  'pdfs', 
  'user-uploads', 
  'youtube-content', 
  'website-content', 
  'text-content', 
  'chat-content'
);

-- Drop any existing overly permissive policies on storage.objects
-- First, let's create comprehensive user-scoped RLS policies

-- Policy for users to read their own files across all private buckets
DROP POLICY IF EXISTS "Users can read their own files in private buckets" ON storage.objects;
CREATE POLICY "Users can read their own files in private buckets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN ('videos', 'audio-files', 'documents', 'images', 'pdfs', 'user-uploads', 'youtube-content', 'website-content', 'text-content', 'chat-content') 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to insert their own files
DROP POLICY IF EXISTS "Users can upload their own files to private buckets" ON storage.objects;
CREATE POLICY "Users can upload their own files to private buckets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('videos', 'audio-files', 'documents', 'images', 'pdfs', 'user-uploads', 'youtube-content', 'website-content', 'text-content', 'chat-content')
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to update their own files
DROP POLICY IF EXISTS "Users can update their own files in private buckets" ON storage.objects;
CREATE POLICY "Users can update their own files in private buckets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('videos', 'audio-files', 'documents', 'images', 'pdfs', 'user-uploads', 'youtube-content', 'website-content', 'text-content', 'chat-content')
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for users to delete their own files
DROP POLICY IF EXISTS "Users can delete their own files from private buckets" ON storage.objects;
CREATE POLICY "Users can delete their own files from private buckets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('videos', 'audio-files', 'documents', 'images', 'pdfs', 'user-uploads', 'youtube-content', 'website-content', 'text-content', 'chat-content')
  AND auth.uid()::text = (storage.foldername(name))[1]
);