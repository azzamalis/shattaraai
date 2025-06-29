
import { uploadFileToStorage, uploadPastedContentMetadata, deleteFileFromStorage, isStorageUrl, StorageContentType } from '@/lib/storage';
import { ContentItem } from './types';

// Helper function to map content types to storage types
export const mapContentTypeToStorage = (contentType: ContentItem['type']): StorageContentType | null => {
  const mapping: Record<ContentItem['type'], StorageContentType | null> = {
    'pdf': 'pdf',
    'file': 'file',
    'video': 'video',
    'audio_file': 'audio_file',
    'upload': 'upload',
    'recording': 'recording',
    'live_recording': 'live_recording',
    // Pasted content types now have storage support
    'youtube': 'youtube',
    'website': 'website',
    'text': 'text',
    'chat': 'chat'
  };
  return mapping[contentType];
};

export const handleFileUpload = async (
  file: File,
  contentType: ContentItem['type'],
  userId: string
): Promise<{ url: string; filename: string }> => {
  const storageContentType = mapContentTypeToStorage(contentType);
  if (!storageContentType) {
    throw new Error(`Unsupported content type for file upload: ${contentType}`);
  }

  console.log('Uploading file to storage:', file.name, 'Type:', storageContentType);
  const uploadedUrl = await uploadFileToStorage(file, storageContentType, userId);
  console.log('File uploaded successfully:', uploadedUrl);

  return {
    url: uploadedUrl,
    filename: file.name
  };
};

export const handleMetadataUpload = async (
  metadata: any,
  contentType: 'youtube' | 'website' | 'chat' | 'text',
  userId: string,
  tempId: string
): Promise<string | null> => {
  try {
    const metadataUrl = await uploadPastedContentMetadata(
      metadata, 
      contentType,
      userId,
      tempId
    );
    return metadataUrl;
  } catch (metadataError) {
    console.warn('Failed to upload metadata to storage:', metadataError);
    return null;
  }
};

export const handleStorageCleanup = async (
  contentItem: ContentItem
): Promise<void> => {
  if (contentItem.url && isStorageUrl(contentItem.url)) {
    try {
      const storageContentType = mapContentTypeToStorage(contentItem.type);
      await deleteFileFromStorage(contentItem.url, storageContentType);
    } catch (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Don't throw error as the content record was already deleted
    }
  }
};
