import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProcessedExamResource {
  id: string;
  title: string;
  type: 'file' | 'url' | 'text';
  file?: File;
  url?: string;
  text?: string;
  extractedContent?: string;
  storageUrl?: string;
  isProcessing?: boolean;
  processingError?: string;
}

interface UseExamResourceUploadReturn {
  uploadAndExtractFile: (file: File, resourceId: string) => Promise<{ storageUrl: string; extractedContent: string } | null>;
  extractWebsiteContent: (url: string) => Promise<string | null>;
  isUploading: boolean;
}

export function useExamResourceUpload(): UseExamResourceUploadReturn {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAndExtractFile = useCallback(async (
    file: File, 
    resourceId: string
  ): Promise<{ storageUrl: string; extractedContent: string } | null> => {
    setIsUploading(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return null;
      }

      // Determine storage bucket based on file type
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      const mimeType = file.type;
      
      let bucket = 'documents';
      if (mimeType.includes('pdf')) {
        bucket = 'pdfs';
      } else if (mimeType.includes('audio')) {
        bucket = 'audio-files';
      } else if (mimeType.includes('video')) {
        bucket = 'videos';
      } else if (mimeType.includes('image')) {
        bucket = 'images';
      }

      // Generate unique file path
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `exam-resources/${user.id}/${timestamp}_${sanitizedName}`;

      console.log(`Uploading file to ${bucket}/${filePath}`);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error(`Failed to upload file: ${uploadError.message}`);
        return null;
      }

      // Get signed URL for the uploaded file
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError || !urlData?.signedUrl) {
        console.error('Error getting signed URL:', urlError);
        toast.error('Failed to get file URL');
        return null;
      }

      const storageUrl = urlData.signedUrl;
      let extractedContent = '';

      // Extract text based on file type
      if (mimeType.includes('pdf')) {
        // Call PDF extraction edge function
        const { data: pdfData, error: pdfError } = await supabase.functions.invoke('extract-pdf-text', {
          body: { fileUrl: storageUrl }
        });

        if (pdfError) {
          console.error('PDF extraction error:', pdfError);
          extractedContent = `[PDF file: ${file.name} - text extraction failed]`;
        } else if (pdfData?.text) {
          extractedContent = pdfData.text;
          console.log(`Extracted ${extractedContent.length} characters from PDF`);
        }
      } else if (fileExt === 'docx' || fileExt === 'doc') {
        // Call Word document extraction edge function
        const { data: wordData, error: wordError } = await supabase.functions.invoke('extract-word-text', {
          body: { 
            contentId: resourceId,
            storageUrl: storageUrl 
          }
        });

        if (wordError) {
          console.error('Word extraction error:', wordError);
          extractedContent = `[Word document: ${file.name} - text extraction failed]`;
        } else if (wordData?.success) {
          // Fetch the extracted text from the response
          extractedContent = wordData.extractedText || `[Word document processed: ${file.name}]`;
          console.log(`Extracted text from Word document`);
        }
      } else if (mimeType.includes('text') || ['txt', 'md', 'csv', 'json'].includes(fileExt)) {
        // Read text files directly
        try {
          extractedContent = await file.text();
          console.log(`Read ${extractedContent.length} characters from text file`);
        } catch (e) {
          console.error('Error reading text file:', e);
          extractedContent = `[Text file: ${file.name} - read failed]`;
        }
      } else if (mimeType.includes('audio') || mimeType.includes('video')) {
        // For audio/video, we'd need transcription - mark as pending
        extractedContent = `[${mimeType.includes('audio') ? 'Audio' : 'Video'} file: ${file.name} - transcription not yet supported for exam resources]`;
      } else {
        extractedContent = `[File: ${file.name} - content type not supported for text extraction]`;
      }

      return { storageUrl, extractedContent };

    } catch (error) {
      console.error('Error in uploadAndExtractFile:', error);
      toast.error('An error occurred while processing the file');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const extractWebsiteContent = useCallback(async (url: string): Promise<string | null> => {
    try {
      console.log(`Extracting content from website: ${url}`);
      
      const { data, error } = await supabase.functions.invoke('extract-website-content', {
        body: { url }
      });

      if (error) {
        console.error('Website extraction error:', error);
        return null;
      }

      if (data?.text_content) {
        console.log(`Extracted ${data.text_content.length} characters from website`);
        return data.text_content;
      }

      return null;
    } catch (error) {
      console.error('Error extracting website content:', error);
      return null;
    }
  }, []);

  return {
    uploadAndExtractFile,
    extractWebsiteContent,
    isUploading
  };
}
