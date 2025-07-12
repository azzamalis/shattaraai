
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

// Upload file to appropriate storage bucket
export const uploadFileToStorage = async (
  file: File, 
  contentType: StorageContentType, 
  userId: string
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
  const fileName = `${userId}/${timestamp}_${file.name}`;
  
  console.log('DEBUG: storage - Upload details:', {
    bucket,
    fileName,
    timestamp
  });

  try {
    console.log(`DEBUG: storage - Uploading ${contentType} to ${bucket}: ${fileName}`);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('DEBUG: storage - Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    console.log('DEBUG: storage - Upload successful:', data.path);
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    console.log('DEBUG: storage - Public URL generated:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('DEBUG: storage - Upload exception:', error);
    throw error;
  }
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

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
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

// Check if URL is a Supabase storage URL
export const isStorageUrl = (url: string): boolean => {
  return url.includes('/storage/v1/object/public/');
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
