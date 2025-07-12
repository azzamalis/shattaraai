-- Create user-uploads storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'user-uploads', true);

-- Create policies for user-uploads bucket
CREATE POLICY "Allow public file access" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-uploads');

CREATE POLICY "Allow authenticated users to upload files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Allow users to update their own files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);