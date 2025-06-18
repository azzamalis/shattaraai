
-- Create a storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true);

-- Create RLS policy for the PDF bucket to allow public access
CREATE POLICY "Allow public access to PDF files" ON storage.objects
FOR SELECT USING (bucket_id = 'pdfs');

-- Create RLS policy to allow authenticated users to upload PDFs
CREATE POLICY "Allow authenticated users to upload PDFs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.role() = 'authenticated');

-- Create RLS policy to allow users to update their own PDFs
CREATE POLICY "Allow users to update their own PDFs" ON storage.objects
FOR UPDATE USING (bucket_id = 'pdfs' AND auth.uid() = owner);

-- Create RLS policy to allow users to delete their own PDFs
CREATE POLICY "Allow users to delete their own PDFs" ON storage.objects
FOR DELETE USING (bucket_id = 'pdfs' AND auth.uid() = owner);
