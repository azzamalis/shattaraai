import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type ProcessedFile = {
  name: string;
  url: string;
  type: string;
  content: string;
  size: number;
};

export async function processAndUploadFiles(files: File[], userId: string): Promise<ProcessedFile[]> {
  const processedFiles: ProcessedFile[] = [];
  
  for (const file of files) {
    try {
      // Upload file to storage first
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const bucket = getStorageBucket(file.type, fileExt);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path);

      // Process file content
      let content = '';
      
      if (file.type === 'application/pdf') {
        content = await extractPDFContent(file);
      } else if (file.type.startsWith('image/')) {
        content = await extractImageContent(file);
      } else if (file.type === 'text/plain') {
        content = await file.text();
      } else if (file.name.endsWith('.docx')) {
        content = await extractDocxContent(file);
      }

      processedFiles.push({
        name: file.name,
        url: publicUrl,
        type: file.type,
        content,
        size: file.size
      });
      
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      toast({
        title: "File Processing Error",
        description: `Failed to process ${file.name}. Please try again.`,
        variant: "destructive",
      });
    }
  }
  
  return processedFiles;
}

function getStorageBucket(fileType: string, fileExt?: string): string {
  if (fileType.startsWith('image/')) return 'images';
  if (fileType === 'application/pdf') return 'pdfs';
  if (fileType.includes('document') || fileExt === 'docx' || fileExt === 'doc') return 'documents';
  return 'user-uploads';
}

async function extractPDFContent(file: File): Promise<string> {
  try {
    // Use the existing PDF extraction edge function
    const formData = new FormData();
    formData.append('file', file);
    
    const { data, error } = await supabase.functions.invoke('extract-pdf-text', {
      body: formData,
    });
    
    if (error) throw error;
    return data.text || '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return `[PDF content could not be extracted: ${file.name}]`;
  }
}

async function extractImageContent(file: File): Promise<string> {
  try {
    // For now, return a description. In the future, we could add OCR
    return `[Image file: ${file.name} - Content will be analyzed by AI]`;
  } catch (error) {
    console.error('Image processing error:', error);
    return `[Image content could not be processed: ${file.name}]`;
  }
}

async function extractDocxContent(file: File): Promise<string> {
  try {
    // Use the existing document extraction edge function
    const formData = new FormData();
    formData.append('file', file);
    
    const { data, error } = await supabase.functions.invoke('extract-document-text', {
      body: formData,
    });
    
    if (error) throw error;
    return data.text || '';
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return `[Document content could not be extracted: ${file.name}]`;
  }
}

export function formatFileContentForAI(files: ProcessedFile[]): string {
  if (files.length === 0) return '';
  
  let content = '\n\n--- Attached Files ---\n\n';
  
  files.forEach((file, index) => {
    content += `**File ${index + 1}: ${file.name}**\n`;
    content += `Type: ${file.type}\n`;
    content += `Content:\n${file.content}\n\n`;
  });
  
  return content;
}