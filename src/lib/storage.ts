
import { supabase } from '@/integrations/supabase/client';

export async function uploadPDFToStorage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  console.log('Uploading PDF to storage:', fileName);
  
  const { data, error } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  console.log('PDF uploaded successfully:', data.path);

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(data.path);

  console.log('PDF public URL:', publicUrl);
  
  return publicUrl;
}

export async function deletePDFFromStorage(url: string): Promise<void> {
  // Extract the file path from the public URL
  const urlParts = url.split('/');
  const bucketIndex = urlParts.indexOf('pdfs');
  if (bucketIndex === -1) return;
  
  const filePath = urlParts.slice(bucketIndex + 1).join('/');
  
  const { error } = await supabase.storage
    .from('pdfs')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete PDF: ${error.message}`);
  }
}

export function isPDFStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/pdfs/');
}
