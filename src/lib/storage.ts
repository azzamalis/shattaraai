
import { supabase } from '@/integrations/supabase/client';

export type StorageContentType = 
  | 'pdf' 
  | 'video' 
  | 'audio_file' 
  | 'file' 
  | 'upload' 
  | 'recording' 
  | 'live_recording'
  | 'youtube'
  | 'website' 
  | 'text' 
  | 'chat';

// Map content types to storage buckets
export const getStorageBucket = (contentType: StorageContentType): string => {
  const bucketMap: Record<StorageContentType, string> = {
    pdf: 'pdfs',
    video: 'videos',
    audio_file: 'audio-files',
    file: 'documents',
    upload: 'documents',
    recording: 'audio-recordings',
    live_recording: 'audio-recordings',
    youtube: 'youtube-content',
    website: 'website-content',
    text: 'text-content',
    chat: 'chat-content'
  };
  return bucketMap[contentType];
};

// Sanitize file name for storage (remove special characters and spaces)
const sanitizeFileName = (fileName: string): string => {
  // Get file extension
  const lastDotIndex = fileName.lastIndexOf('.');
  const name = lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName;
  const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : '';
  
  // Replace spaces with underscores and remove special characters
  // Keep only alphanumeric, underscores, hyphens
  const sanitizedName = name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .substring(0, 100); // Limit length
  
  return sanitizedName + extension;
};

// Progress callback type
export type UploadProgressCallback = (progress: number) => void;

// Upload file to appropriate storage bucket - returns the signed URL
export const uploadFileToStorage = async (
  file: File, 
  contentType: StorageContentType, 
  userId: string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  console.log('DEBUG: storage - uploadFileToStorage called with:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    contentType,
    userId
  });

  const bucket = getStorageBucket(contentType);
  const timestamp = Date.now();
  const sanitizedFileName = sanitizeFileName(file.name);
  const fileName = `${userId}/${timestamp}_${sanitizedFileName}`;
  
  console.log('DEBUG: storage - Upload details:', {
    bucket,
    fileName,
    originalFileName: file.name,
    sanitizedFileName,
    timestamp
  });

  try {
    console.log(`DEBUG: storage - Uploading ${contentType} to ${bucket}: ${fileName}`);
    
    // Use XMLHttpRequest for progress tracking since Supabase JS client
    // doesn't expose onUploadProgress in the standard upload method
    const signedUrl = await uploadWithProgress(bucket, fileName, file, onProgress);
    
    console.log('DEBUG: storage - Upload successful with progress tracking');
    return signedUrl;
  } catch (error) {
    console.error('DEBUG: storage - Upload exception:', error);
    throw error;
  }
};

// Helper function to upload with progress tracking
const uploadWithProgress = async (
  bucket: string,
  path: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Get the Supabase URL and anon key
    const supabaseUrl = 'https://trvuidenkjqqlwadlosh.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydnVpZGVua2pxcWx3YWRsb3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NTMzNzIsImV4cCI6MjA2MzEyOTM3Mn0.V72-VE9VMW8a7XWiRxEbHznEBMn70yB6AvgqRc7yWFo';
    
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        console.log(`DEBUG: storage - Upload progress: ${progress}%`);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('DEBUG: storage - XHR upload completed successfully');
        
        // Now get the signed URL using Supabase client
        try {
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, 3600);
          
          if (signedError) {
            reject(new Error(`Failed to create signed URL: ${signedError.message}`));
            return;
          }
          
          console.log('DEBUG: storage - Signed URL generated');
          resolve(signedUrlData.signedUrl);
        } catch (err) {
          reject(err);
        }
      } else {
        const errorText = xhr.responseText || `Upload failed with status ${xhr.status}`;
        console.error('DEBUG: storage - XHR upload failed:', errorText);
        reject(new Error(errorText));
      }
    });
    
    xhr.addEventListener('error', () => {
      console.error('DEBUG: storage - XHR network error');
      reject(new Error('Network error during upload'));
    });
    
    xhr.addEventListener('abort', () => {
      console.log('DEBUG: storage - XHR upload aborted');
      reject(new Error('Upload aborted'));
    });
    
    // Get auth token for authenticated uploads
    supabase.auth.getSession().then(({ data: { session } }) => {
      xhr.open('POST', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.setRequestHeader('apikey', supabaseAnonKey);
      xhr.setRequestHeader('x-upsert', 'false');
      
      if (session?.access_token) {
        xhr.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
      }
      
      xhr.send(file);
    }).catch(reject);
  });
};

// Upload pasted content metadata to storage
export const uploadPastedContentMetadata = async (
  metadata: any,
  contentType: 'youtube' | 'website' | 'chat' | 'text',
  userId: string,
  contentId: string
): Promise<string> => {
  const bucket = getStorageBucket(contentType);
  const fileName = `${userId}/${contentId}/metadata.json`;
  
  try {
    const metadataFile = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json'
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, metadataFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw new Error(`Failed to upload metadata: ${error.message}`);
    }

    // Create a signed URL for secure access (1 hour expiry)
    const { data: signedUrlData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 3600);
    
    if (signedError) {
      throw new Error(`Failed to create signed URL: ${signedError.message}`);
    }
    
    return signedUrlData.signedUrl;
  } catch (error) {
    console.error('Error uploading pasted content metadata:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFileFromStorage = async (
  url: string, 
  contentType?: StorageContentType | null
): Promise<void> => {
  if (!url || !isStorageUrl(url)) {
    return;
  }

  try {
    // Extract bucket and path from URL
    const urlParts = url.split('/storage/v1/object/public/');
    if (urlParts.length !== 2) return;
    
    const [bucket, ...pathParts] = urlParts[1].split('/');
    const filePath = pathParts.join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file from storage:', error);
    }
  } catch (error) {
    console.error('Error deleting file from storage:', error);
  }
};

// Check if URL is a Supabase storage URL (public or signed)
export const isStorageUrl = (url: string): boolean => {
  return url.includes('/storage/v1/object/public/') || url.includes('/storage/v1/object/sign/');
};

// Get a signed URL for a file (for refreshing expired URLs)
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }
};

// Get file info from storage URL
export const getFileInfoFromUrl = (url: string) => {
  if (!isStorageUrl(url)) return null;
  
  const urlParts = url.split('/storage/v1/object/public/');
  if (urlParts.length !== 2) return null;
  
  const [bucket, ...pathParts] = urlParts[1].split('/');
  const filePath = pathParts.join('/');
  
  return { bucket, filePath };
};
