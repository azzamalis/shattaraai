import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { uploadFileToStorage, uploadPastedContentMetadata, deleteFileFromStorage, isStorageUrl, StorageContentType, getStorageBucket } from '@/lib/storage';
import * as pdfjsLib from 'pdfjs-dist';

export interface ContentItem {
  id: string;
  user_id: string;
  room_id: string | null;
  title: string;
  type: 'file' | 'video' | 'pdf' | 'live_recording' | 'audio_file' | 'youtube' | 'website' | 'text' | 'chat' | 'upload' | 'recording';
  url?: string;
  text_content?: string;
  filename?: string;
  storage_path?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  processing_status?: string;
  chapters?: any;
  transcription_confidence?: number;
}

export const useContent = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async (roomId?: string) => {
    console.log('DEBUG: useContent - fetchContent called with:', { roomId, userId: user?.id });
    
    if (!user) {
      console.log('DEBUG: useContent - No user found, clearing content and stopping fetch');
      setContent([]);
      setLoading(false);
      return;
    }

    try {
      console.log('DEBUG: useContent - Building Supabase query');
      let query = supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false });

      if (roomId) {
        console.log('DEBUG: useContent - Adding room filter:', roomId);
        query = query.eq('room_id', roomId);
      }

      console.log('DEBUG: useContent - Executing Supabase query');
      const { data, error } = await query;

      if (error) {
        console.error('DEBUG: useContent - Supabase query error:', error);
        toast.error('Failed to load content');
      } else {
        console.log('DEBUG: useContent - Query successful, received data:', {
          itemCount: data?.length || 0,
          items: data?.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            url: item.url,
            filename: item.filename
          }))
        });

        // Cast the data to match our ContentItem interface
        setContent((data || []).map(item => ({
          ...item,
          type: item.type as ContentItem['type'],
          metadata: item.metadata as Record<string, any>
        })));
      }
    } catch (error) {
      console.error('DEBUG: useContent - Fetch content error:', error);
      toast.error('Failed to load content');
    } finally {
      console.log('DEBUG: useContent - Fetch content completed, setting loading to false');
      setLoading(false);
    }
  };

  const fetchContentById = async (contentId: string): Promise<ContentItem | null> => {
    console.log('DEBUG: useContent - fetchContentById called with:', { contentId, userId: user?.id });
    
    if (!user) {
      console.log('DEBUG: useContent - No user found for fetchContentById');
      return null;
    }

    try {
      console.log('DEBUG: useContent - Executing Supabase query for single content item');
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('DEBUG: useContent - Error fetching content by ID:', error);
        return null;
      }

      console.log('DEBUG: useContent - Successfully fetched content by ID:', {
        id: data.id,
        title: data.title,
        type: data.type,
        url: data.url,
        filename: data.filename,
        storage_path: data.storage_path,
        metadata: data.metadata
      });

      return {
        ...data,
        type: data.type as ContentItem['type'],
        metadata: data.metadata as Record<string, any>
      };
    } catch (error) {
      console.error('DEBUG: useContent - Exception in fetchContentById:', error);
      return null;
    }
  };

  const addContent = async (contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    console.log('DEBUG: useContent - addContent called with:', {
      title: contentData.title,
      type: contentData.type,
      url: contentData.url,
      filename: contentData.filename,
      userId: user?.id
    });

    if (!user) {
      console.log('DEBUG: useContent - No user found for addContent');
      return null;
    }

    try {
      // Ensure we're not storing blob URLs
      const cleanedContentData = {
        ...contentData,
        url: contentData.url && contentData.url.startsWith('blob:') ? undefined : contentData.url,
        storage_path: contentData.storage_path && contentData.storage_path.startsWith('blob:') ? undefined : contentData.storage_path
      };

      console.log('DEBUG: useContent - Cleaned content data:', {
        ...cleanedContentData,
        user_id: user.id
      });

      console.log('DEBUG: useContent - Inserting content into Supabase');
      const { data, error } = await supabase
        .from('content')
        .insert([{ ...cleanedContentData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('DEBUG: useContent - Error creating content:', error);
        toast.error('Failed to create content');
        return null;
      }

      console.log('DEBUG: useContent - Content created successfully:', {
        id: data.id,
        title: data.title,
        type: data.type,
        url: data.url,
        filename: data.filename
      });

      const newContent = {
        ...data,
        type: data.type as ContentItem['type'],
        metadata: data.metadata as Record<string, any>
      };

      setContent(prev => [newContent, ...prev]);
      toast.success('Content created successfully');
      return data.id;
    } catch (error) {
      console.error('DEBUG: useContent - Exception in addContent:', error);
      toast.error('Failed to create content');
      return null;
    }
  };

  const addContentWithFile = async (
    contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    file?: File
  ) => {
    console.log('DEBUG: useContent - addContentWithFile called with:', {
      contentTitle: contentData.title,
      contentType: contentData.type,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId: user?.id
    });

    if (!user) {
      console.log('DEBUG: useContent - No user found for addContentWithFile');
      return null;
    }

    try {
      let finalContentData = { ...contentData };
      
      // Handle file upload for ALL file-based content types
      if (file) {
        console.log('DEBUG: useContent - Processing file upload');
        const storageContentType = mapContentTypeToStorage(contentData.type);
        console.log('DEBUG: useContent - Mapped storage content type:', storageContentType);
        
        if (storageContentType) {
          console.log('DEBUG: useContent - Starting file upload to storage with details:', {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            storageContentType,
            userId: user.id
          });
          
          const uploadedUrl = await uploadFileToStorage(file, storageContentType, user.id);
          console.log('DEBUG: useContent - File uploaded successfully, received URL:', uploadedUrl);
          
          // Store the proper Supabase storage URL
          finalContentData.url = uploadedUrl;
          finalContentData.storage_path = uploadedUrl;
          finalContentData.filename = file.name;
          
          // Add comprehensive file metadata
          finalContentData.metadata = {
            ...finalContentData.metadata,
            fileSize: file.size,
            fileType: file.type,
            isUploadedFile: true,
            uploadedAt: new Date().toISOString(),
            storageUrl: uploadedUrl,
            storageBucket: getStorageBucket(storageContentType)
          };

          console.log('DEBUG: useContent - Final content data prepared:', {
            title: finalContentData.title,
            type: finalContentData.type,
            url: finalContentData.url,
            filename: finalContentData.filename,
            metadataKeys: Object.keys(finalContentData.metadata)
          });
        } else {
          console.error('DEBUG: useContent - Unsupported file type for storage:', contentData.type);
          throw new Error(`Unsupported file type: ${contentData.type}`);
        }
      }

      // Clean any potential blob URLs before saving
      finalContentData.url = finalContentData.url && finalContentData.url.startsWith('blob:') ? undefined : finalContentData.url;
      finalContentData.storage_path = finalContentData.storage_path && finalContentData.storage_path.startsWith('blob:') ? undefined : finalContentData.storage_path;

      console.log('DEBUG: useContent - Calling addContent with final data');
      const contentId = await addContent(finalContentData);
      
      // Auto-trigger content processing based on content type
      if (contentId) {
        console.log('DEBUG: useContent - Content created successfully, starting automatic processing...', { contentId, type: finalContentData.type });
        // Don't await - let it run in background
        processContentAutomatically(contentId, finalContentData, file).catch(error => {
          console.error('DEBUG: useContent - Background processing failed:', error);
        });
      }
      
      console.log('DEBUG: useContent - addContentWithFile completed, content ID:', contentId);
      return contentId;
    } catch (error) {
      console.error('DEBUG: useContent - Error in addContentWithFile:', error);
      toast.error('Failed to upload file');
      return null;
    }
  };

  // Enhanced addContent function to handle pasted content metadata storage
  const addContentWithMetadata = async (
    contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    metadata?: any
  ) => {
    console.log('DEBUG: useContent - addContentWithMetadata called');

    if (!user) return null;

    try {
      let finalContentData = { ...contentData };
      
      // For pasted content types, store metadata in their respective storage buckets
      if (metadata && ['youtube', 'website', 'chat', 'text'].includes(contentData.type)) {
        try {
          // Generate a temporary ID for the metadata file
          const tempId = crypto.randomUUID();
          const metadataUrl = await uploadPastedContentMetadata(
            metadata, 
            contentData.type as 'youtube' | 'website' | 'chat' | 'text',
            user.id,
            tempId
          );
          
          // Store metadata URL in the content metadata
          finalContentData.metadata = {
            ...finalContentData.metadata,
            metadataStoragePath: metadataUrl,
            uploadedAt: new Date().toISOString()
          };
        } catch (metadataError) {
          console.warn('Failed to upload metadata to storage:', metadataError);
          // Continue without storing metadata - not critical
        }
      }

      // Clean any potential blob URLs before saving
      finalContentData.url = finalContentData.url && finalContentData.url.startsWith('blob:') ? undefined : finalContentData.url;
      finalContentData.storage_path = finalContentData.storage_path && finalContentData.storage_path.startsWith('blob:') ? undefined : finalContentData.storage_path;

      const contentId = await addContent(finalContentData);
      
      // Auto-trigger content processing based on content type
      if (contentId) {
        console.log('DEBUG: useContent - Content with metadata created, starting automatic processing...', { contentId, type: finalContentData.type });
        // Don't await - let it run in background
        processContentAutomatically(contentId, finalContentData, undefined).catch(error => {
          console.error('DEBUG: useContent - Background processing failed:', error);
        });
      }
      
      return contentId;
    } catch (error) {
      console.error('Error creating content with metadata:', error);
      toast.error('Failed to create content');
      return null;
    }
  };

  const updateContent = async (contentId: string, updates: Partial<ContentItem>) => {
    console.log('DEBUG: useContent - updateContent called:', { contentId, updates });

    if (!user) return;

    try {
      // Clean any potential blob URLs before updating
      const cleanedUpdates = {
        ...updates,
        url: updates.url && updates.url.startsWith('blob:') ? undefined : updates.url,
        storage_path: updates.storage_path && updates.storage_path.startsWith('blob:') ? undefined : updates.storage_path
      };

      const { error } = await supabase
        .from('content')
        .update(cleanedUpdates)
        .eq('id', contentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating content:', error);
        toast.error('Failed to update content');
        return;
      }

      setContent(prev => prev.map(item => 
        item.id === contentId ? { ...item, ...cleanedUpdates, updated_at: new Date().toISOString() } : item
      ));
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  // Add a function to manually trigger processing for existing content
  const triggerProcessing = async (contentId: string) => {
    console.log('DEBUG: useContent - Manually triggering processing for:', contentId);
    
    try {
      // Get the content item
      const { data: contentItem, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (error || !contentItem) {
        throw new Error('Content not found');
      }

      // For audio/video files, download and process them
      if ((contentItem.type === 'audio_file' || contentItem.type === 'video') && contentItem.url) {
        console.log('DEBUG: useContent - Downloading file from URL for processing:', contentItem.url);
        
        // Reset failed status first if needed
        if (contentItem.processing_status === 'failed') {
          await updateContent(contentId, { 
            processing_status: 'pending',
            text_content: null 
          });
          console.log('DEBUG: useContent - Reset failed status to pending');
        }
        
        // Update status to processing
        await updateContent(contentId, { processing_status: 'processing' });
        
        // Download the file from the URL
        const response = await fetch(contentItem.url);
        if (!response.ok) {
          throw new Error('Failed to download file');
        }
        
        const blob = await response.blob();
        const file = new File([blob], contentItem.filename || 'file', { type: blob.type });
        
        console.log('DEBUG: useContent - Downloaded file details:', {
          name: file.name,
          size: file.size,
          type: file.type
        });

        // Call processContentAutomatically with the downloaded file
        await processContentAutomatically(contentId, {
          title: contentItem.title,
          type: contentItem.type as ContentItem['type'],
          url: contentItem.url,
          text_content: contentItem.text_content,
          filename: contentItem.filename,
          storage_path: contentItem.storage_path,
          metadata: contentItem.metadata as Record<string, any>,
          room_id: contentItem.room_id,
          processing_status: contentItem.processing_status,
          chapters: contentItem.chapters,
          transcription_confidence: contentItem.transcription_confidence
        }, file);
        toast.success('Processing started for uploaded content!');
      } else {
        toast.error('Content type not supported for processing');
      }
    } catch (error) {
      console.error('DEBUG: useContent - Error triggering processing:', error);
      toast.error('Failed to start processing');
      // Reset status back to pending on error
      await updateContent(contentId, { processing_status: 'pending' });
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!user) return;

    try {
      // Get the content item to check if it has a storage URL
      const contentItem = content.find(item => item.id === contentId);
      
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
        return;
      }

      // If the content has a storage URL, delete the file from storage
      if (contentItem?.url && isStorageUrl(contentItem.url)) {
        try {
          const storageContentType = mapContentTypeToStorage(contentItem.type);
          await deleteFileFromStorage(contentItem.url, storageContentType);
        } catch (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Don't show error to user as the content record was already deleted
        }
      }

      // Also delete metadata files if they exist
      if (contentItem?.metadata?.metadataStoragePath && isStorageUrl(contentItem.metadata.metadataStoragePath)) {
        try {
          const storageContentType = mapContentTypeToStorage(contentItem.type);
          await deleteFileFromStorage(contentItem.metadata.metadataStoragePath, storageContentType);
        } catch (storageError) {
          console.error('Error deleting metadata from storage:', storageError);
        }
      }

      setContent(prev => prev.filter(item => item.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  // Unified content processing function
  const processContentAutomatically = async (
    contentId: string, 
    contentData: Omit<ContentItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
    file?: File
  ) => {
    console.log('DEBUG: useContent - Starting automatic content processing for:', contentId, contentData.type);
    
    try {
      switch (contentData.type) {
        case 'pdf':
          if (file) {
            console.log('DEBUG: useContent - Processing PDF with client-side extraction');
            try {
              const extractedText = await extractPdfText(file);
              console.log('DEBUG: useContent - Extracted text length:', extractedText.length);
              
              const { error: updateError } = await supabase
                .from('content')
                .update({ text_content: extractedText })
                .eq('id', contentId);
              
              if (updateError) {
                throw new Error(`Failed to save extracted text: ${updateError.message}`);
              }
              
              toast.success('PDF uploaded and text extracted successfully!');
            } catch (extractionError) {
              console.error('DEBUG: useContent - PDF text extraction failed:', extractionError);
              // Fallback to server-side extraction
              console.log('DEBUG: useContent - Attempting server-side PDF extraction');
              try {
                await supabase.functions.invoke('extract-pdf-text', {
                  body: {
                    contentId: contentId,
                    storagePath: contentData.storage_path || contentData.url
                  }
                });
                toast.success('PDF uploaded! Text extraction in progress...');
              } catch (serverError) {
                console.error('DEBUG: useContent - Server-side PDF extraction also failed:', serverError);
                toast.error('PDF uploaded but text extraction failed');
              }
            }
          }
          break;

        case 'youtube':
          if (contentData.url) {
            console.log('DEBUG: useContent - Processing YouTube content');
            try {
              await supabase.functions.invoke('youtube-extractor', {
                body: {
                  url: contentData.url,
                  contentId: contentId
                }
              });
              toast.success('YouTube video data is being extracted...');
            } catch (extractionError) {
              console.error('DEBUG: useContent - YouTube extraction failed:', extractionError);
              toast.error('YouTube data extraction failed, but content was saved');
            }
          }
          break;

        case 'website':
          if (contentData.url) {
            console.log('DEBUG: useContent - Processing website content');
            try {
              await supabase.functions.invoke('extract-website-content', {
                body: {
                  url: contentData.url,
                  contentId: contentId
                }
              });
              toast.success('Website content is being extracted...');
            } catch (extractionError) {
              console.error('DEBUG: useContent - Website extraction failed:', extractionError);
              console.log('DEBUG: useContent - Website extraction not available, content saved without processing');
            }
          }
          break;

        case 'audio_file':
        case 'video':
          if (file) {
            console.log('DEBUG: useContent - Processing audio/video file, file details:', {
              name: file.name,
              size: file.size,
              type: file.type
            });
            
            // Check file size (limit to 25MB for OpenAI)
            if (file.size > 25 * 1024 * 1024) {
              console.error('DEBUG: useContent - File too large for transcription:', file.size);
              await supabase
                .from('content')
                .update({ 
                  processing_status: 'failed',
                  text_content: 'File too large for transcription (max 25MB)'
                })
                .eq('id', contentId);
              toast.error('File too large for transcription (max 25MB)');
              return;
            }
            
            // Update status to processing first
            await supabase
              .from('content')
              .update({ processing_status: 'processing' })
              .eq('id', contentId);
            
            try {
              // Convert file to base64 in chunks to prevent stack overflow
              console.log('DEBUG: useContent - Converting file to base64 in chunks...');
              const base64Audio = await convertFileToBase64Chunked(file);
              console.log('DEBUG: useContent - Base64 conversion complete, length:', base64Audio.length);
              
              console.log('DEBUG: useContent - Calling audio-transcription function...');
              const { data, error } = await supabase.functions.invoke('audio-transcription', {
                body: {
                  audioData: base64Audio,
                  recordingId: contentId,
                  chunkIndex: 0,
                  isRealTime: false,
                  timestamp: Date.now(),
                  originalFileName: file.name
                }
              });
              
              if (error) {
                console.error('DEBUG: useContent - Audio transcription function error:', error);
                await supabase
                  .from('content')
                  .update({ 
                    processing_status: 'failed',
                    text_content: `Transcription failed: ${error.message || 'Unknown error'}`
                  })
                  .eq('id', contentId);
                toast.error('Audio/video transcription failed');
              } else {
                console.log('DEBUG: useContent - Audio-transcription function result:', data);
                toast.success('Audio/video uploaded! Transcription in progress...');
              }
            } catch (extractionError) {
              console.error('DEBUG: useContent - Audio transcription failed:', extractionError);
              await supabase
                .from('content')
                .update({ 
                  processing_status: 'failed',
                  text_content: `Processing error: ${extractionError instanceof Error ? extractionError.message : 'Unknown error'}`
                })
                .eq('id', contentId);
              toast.error('Audio/video processing failed');
            }
          } else {
            console.log('DEBUG: useContent - No file provided for audio/video processing');
          }
          break;

        case 'file':
          if (file) {
            console.log('DEBUG: useContent - Processing document file');
            try {
              await supabase.functions.invoke('extract-document-text', {
                body: {
                  contentId: contentId,
                  storagePath: contentData.storage_path || contentData.url,
                  fileType: file.type
                }
              });
              toast.success('Document uploaded! Text extraction in progress...');
            } catch (extractionError) {
              console.error('DEBUG: useContent - Document text extraction failed:', extractionError);
              console.log('DEBUG: useContent - Document text extraction not available, content saved without processing');
            }
          }
          break;

        default:
          console.log('DEBUG: useContent - No automatic processing available for content type:', contentData.type);
      }
    } catch (error) {
      console.error('DEBUG: useContent - Error in automatic content processing:', error);
    }
  };

  // Helper function to convert file to base64 properly
  const convertFileToBase64Chunked = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          // Remove data URL prefix to get just the base64 data
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Helper function to extract PDF text using pdfjs-dist
  const extractPdfText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';
          
          // Extract text from each page
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText.trim());
        } catch (error) {
          console.error('Error extracting PDF text:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Helper function to map content types to storage types
  const mapContentTypeToStorage = (contentType: ContentItem['type']): StorageContentType | null => {
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

  useEffect(() => {
    console.log('DEBUG: useContent - useEffect triggered for user change:', user?.id);
    if (user) {
      fetchContent();
    }
  }, [user?.id]); // Use user.id instead of user object

  // Enhanced real-time subscription with better error handling
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    
    const channelId = `content-realtime-${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log('DEBUG: useContent - Setting up real-time subscription:', channelId);
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'content',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        if (!mounted) return;
        console.log('DEBUG: useContent - Real-time content change received:', {
          eventType: payload.eventType,
          contentId: (payload.new as any)?.id || (payload.old as any)?.id,
          contentTitle: (payload.new as any)?.title || 'N/A'
        });
        
        // Handle different event types with proper type guards
        switch (payload.eventType) {
          case 'INSERT':
            if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
              const newItem = {
                ...payload.new,
                type: (payload.new as any).type as ContentItem['type'],
                metadata: (payload.new as any).metadata as Record<string, any>
              } as ContentItem;
              setContent(prev => {
                // Avoid duplicates
                if (prev.some(item => item.id === newItem.id)) return prev;
                return [newItem, ...prev];
              });
            }
            break;
            
          case 'UPDATE':
            if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
              const updatedItem = {
                ...payload.new,
                type: (payload.new as any).type as ContentItem['type'],
                metadata: (payload.new as any).metadata as Record<string, any>
              } as ContentItem;
              setContent(prev => prev.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              ));
            }
            break;
            
          case 'DELETE':
            if (payload.old && typeof payload.old === 'object' && 'id' in payload.old) {
              setContent(prev => prev.filter(item => item.id !== (payload.old as any).id));
            }
            break;
        }
      })
      .subscribe((status) => {
        if (!mounted) return;
        console.log('DEBUG: useContent - Real-time subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('DEBUG: useContent - Real-time subscription active for content');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('DEBUG: useContent - Real-time subscription error for content');
        }
      });

    return () => {
      mounted = false;
      console.log('DEBUG: useContent - Cleaning up real-time subscription');
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [user?.id]); // Use user.id instead of user object

  return {
    content,
    loading,
    addContent,
    addContentWithFile,
    addContentWithMetadata, // Enhanced function exposed
    updateContent,
    deleteContent,
    refreshContent: fetchContent,
    recentContent: content.slice(0, 10),
    fetchContentById,
    triggerProcessing
  };
};
