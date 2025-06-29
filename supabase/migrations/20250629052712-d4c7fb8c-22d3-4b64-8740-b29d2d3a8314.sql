
-- Create a storage bucket for pasted content (YouTube, Website, Chat, Text)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pasted-content', 'pasted-content', true);

-- Create RLS policies for the pasted-content bucket
CREATE POLICY "Allow public access to pasted content files" ON storage.objects
FOR SELECT USING (bucket_id = 'pasted-content');

CREATE POLICY "Allow authenticated users to upload pasted content" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pasted-content' AND auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own pasted content" ON storage.objects
FOR UPDATE USING (bucket_id = 'pasted-content' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own pasted content" ON storage.objects
FOR DELETE USING (bucket_id = 'pasted-content' AND auth.uid() = owner);
