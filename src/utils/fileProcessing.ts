import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      
      console.log(`Uploading file ${file.name} to bucket ${bucket} with path ${fileName}`);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        console.error(`Upload error for ${file.name}:`, uploadError);
        throw uploadError;
      }

      // Get signed URL for secure access (1 hour expiry)
      const { data: signedUrlData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(uploadData.path, 3600);

      if (signedError) {
        console.error(`Signed URL error for ${file.name}:`, signedError);
        throw signedError;
      }

      const signedUrl = signedUrlData.signedUrl;
      console.log(`File ${file.name} uploaded successfully with signed URL`);

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
        url: signedUrl,
        type: file.type,
        content,
        size: file.size
      });
      
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      toast.error(`Failed to process ${file.name}. Please try again.`);
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
    // Import pdfjs-dist dynamically
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
    
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    // Extract text from all pages
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    console.log(`Extracted ${fullText.length} characters from PDF: ${file.name}`);
    return fullText.trim() || `[No text content found in PDF: ${file.name}]`;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return `[PDF content could not be extracted: ${file.name}. Error: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
}

async function extractImageContent(file: File): Promise<string> {
  try {
    // For images, return a description that AI can work with
    return `[Image file: ${file.name} - The AI will analyze this image when processing your message]`;
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
  
  let content = '\n\n[Context: The user has attached the following files with their message. The file content is provided below for your analysis.]\n\n';
  
  files.forEach((file, index) => {
    content += `--- Content from "${file.name}" (${file.type}) ---\n\n`;
    content += `${file.content}\n\n`;
    content += `--- End of ${file.name} ---\n\n`;
  });
  
  return content;
}