
import { supabase } from '@/integrations/supabase/client';

export type StorageContentType = 'pdf' | 'video' | 'audio_file' | 'upload' | 'file' | 'recording' | 'live_recording' | 'youtube' | 'website' | 'chat' | 'text';

// Mapping content types to storage buckets
const CONTENT_TYPE_TO_BUCKET: Record<StorageContentType, string> = {
  'pdf': 'pdfs',
  'video': 'videos',
  'audio_file': 'audio-files',
  'upload': 'documents',
  'file': 'documents',
  'recording': 'audio-files',
  'live_recording': 'audio-files',
  'youtube': 'pasted-content',
  'website': 'pasted-content',
  'chat': 'pasted-content',
  'text': 'pasted-content'
};

// Allowed file extensions for each content type
const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  'pdfs': ['.pdf'],
  'videos': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  'audio-files': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac'],
  'documents': ['.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'],
  'images': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  'pasted-content': ['.txt', '.json', '.html', '.md'] // For cached content, metadata files
};

export async function uploadFileToStorage(
  file: File, 
  contentType: StorageContentType, 
  userId: string
): Promise<string> {
  const bucket = CONTENT_TYPE_TO_BUCKET[contentType];
  if (!bucket) {
    throw new Error(`Unsupported content type: ${contentType}`);
  }

  // Validate file extension
  const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ALLOWED_EXTENSIONS[bucket];
  if (allowedExts && !allowedExts.includes(fileExt)) {
    throw new Error(`File type ${fileExt} not allowed for ${contentType}. Allowed types: ${allowedExts.join(', ')}`);
  }

  const fileName = `${userId}/${Date.now()}${fileExt}`;
  
  console.log(`Uploading ${contentType} to ${bucket}:`, fileName);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error(`Storage upload error for ${contentType}:`, error);
    throw new Error(`Failed to upload ${contentType}: ${error.message}`);
  }

  console.log(`${contentType} uploaded successfully:`, data.path);

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  console.log(`${contentType} public URL:`, publicUrl);
  
  return publicUrl;
}

// New function to upload content metadata or cached data for pasted content types
export async function uploadPastedContentMetadata(
  metadata: any,
  contentType: 'youtube' | 'website' | 'chat' | 'text',
  userId: string,
  contentId: string
): Promise<string> {
  const bucket = 'pasted-content';
  const fileName = `${userId}/${contentType}/${contentId}.json`;
  
  // Convert metadata to JSON blob
  const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: 'application/json'
  });
  
  console.log(`Uploading ${contentType} metadata to ${bucket}:`, fileName);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, metadataBlob, {
      cacheControl: '3600',
      upsert: true // Allow overwriting existing metadata
    });

  if (error) {
    console.error(`Storage upload error for ${contentType} metadata:`, error);
    throw new Error(`Failed to upload ${contentType} metadata: ${error.message}`);
  }

  console.log(`${contentType} metadata uploaded successfully:`, data.path);

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteFileFromStorage(url: string, contentType?: StorageContentType): Promise<void> {
  if (!url) return;

  // Determine bucket from URL or content type
  let bucket: string | undefined;
  
  if (contentType) {
    bucket = CONTENT_TYPE_TO_BUCKET[contentType];
  } else {
    // Try to extract bucket from URL
    const bucketMatches = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\//);
    if (bucketMatches) {
      bucket = bucketMatches[1];
    }
  }

  if (!bucket) {
    console.warn('Could not determine bucket for URL:', url);
    return;
  }

  // Extract the file path from the public URL
  const urlParts = url.split('/');
  const bucketIndex = urlParts.indexOf(bucket);
  if (bucketIndex === -1) return;
  
  const filePath = urlParts.slice(bucketIndex + 1).join('/');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error(`Failed to delete file from ${bucket}:`, error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }

  console.log(`File deleted from ${bucket}:`, filePath);
}

export function isStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/');
}

export function getStorageBucket(contentType: StorageContentType): string {
  return CONTENT_TYPE_TO_BUCKET[contentType] || 'documents';
}

// Legacy function for backward compatibility
export async function uploadPDFToStorage(file: File, userId: string): Promise<string> {
  return uploadFileToStorage(file, 'pdf', userId);
}

export async function deletePDFFromStorage(url: string): Promise<void> {
  return deleteFileFromStorage(url, 'pdf');
}

export function isPDFStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/pdfs/');
}
