
-- Remove the existing pasted-content bucket
DELETE FROM storage.objects WHERE bucket_id = 'pasted-content';
DELETE FROM storage.buckets WHERE id = 'pasted-content';

-- Create separate buckets for each content type
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('youtube-content', 'youtube-content', true),
  ('website-content', 'website-content', true),
  ('text-content', 'text-content', true),
  ('chat-content', 'chat-content', true);

-- Create RLS policies for youtube-content bucket
CREATE POLICY "Allow public access to youtube content files" ON storage.objects
FOR SELECT USING (bucket_id = 'youtube-content');

CREATE POLICY "Allow authenticated users to upload youtube content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'youtube-content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own youtube content" ON storage.objects
FOR UPDATE USING (bucket_id = 'youtube-content' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own youtube content" ON storage.objects
FOR DELETE USING (bucket_id = 'youtube-content' AND auth.uid() = owner);

-- Create RLS policies for website-content bucket
CREATE POLICY "Allow public access to website content files" ON storage.objects
FOR SELECT USING (bucket_id = 'website-content');

CREATE POLICY "Allow authenticated users to upload website content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'website-content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own website content" ON storage.objects
FOR UPDATE USING (bucket_id = 'website-content' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own website content" ON storage.objects
FOR DELETE USING (bucket_id = 'website-content' AND auth.uid() = owner);

-- Create RLS policies for text-content bucket
CREATE POLICY "Allow public access to text content files" ON storage.objects
FOR SELECT USING (bucket_id = 'text-content');

CREATE POLICY "Allow authenticated users to upload text content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'text-content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own text content" ON storage.objects
FOR UPDATE USING (bucket_id = 'text-content' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own text content" ON storage.objects
FOR DELETE USING (bucket_id = 'text-content' AND auth.uid() = owner);

-- Create RLS policies for chat-content bucket
CREATE POLICY "Allow public access to chat content files" ON storage.objects
FOR SELECT USING (bucket_id = 'chat-content');

CREATE POLICY "Allow authenticated users to upload chat content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'chat-content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own chat content" ON storage.objects
FOR UPDATE USING (bucket_id = 'chat-content' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own chat content" ON storage.objects
FOR DELETE USING (bucket_id = 'chat-content' AND auth.uid() = owner);
