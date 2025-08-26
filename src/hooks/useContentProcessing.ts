import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProcessingError {
  stage: string;
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
}

interface ContentProcessingState {
  isProcessing: boolean;
  hasError: boolean;
  error: ProcessingError | null;
  processingStage: string | null;
  timeoutId: number | null;
}

export const useContentProcessing = () => {
  const [state, setState] = useState<ContentProcessingState>({
    isProcessing: false,
    hasError: false,
    error: null,
    processingStage: null,
    timeoutId: null
  });

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      error: null
    }));
  }, []);

  const setProcessingStage = useCallback((stage: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      processingStage: stage,
      hasError: false,
      error: null
    }));
  }, []);

  const setError = useCallback((error: ProcessingError) => {
    setState(prev => {
      // Clear timeout if it exists
      if (prev.timeoutId) {
        clearTimeout(prev.timeoutId);
      }
      
      return {
        ...prev,
        isProcessing: false,
        hasError: true,
        error: {
          ...error,
          timestamp: error.timestamp || new Date().toISOString()
        },
        processingStage: null,
        timeoutId: null
      };
    });
    
    // Show toast notification
    toast.error(`Processing failed: ${error.message}`);
  }, []);

  const setComplete = useCallback(() => {
    setState(prev => {
      // Clear timeout if it exists
      if (prev.timeoutId) {
        clearTimeout(prev.timeoutId);
      }
      
      return {
        ...prev,
        isProcessing: false,
        hasError: false,
        error: null,
        processingStage: null,
        timeoutId: null
      };
    });
  }, []);

  const startProcessingWithTimeout = useCallback((stage: string, timeoutMs: number = 90000) => {
    setState(prev => {
      // Clear any existing timeout
      if (prev.timeoutId) {
        clearTimeout(prev.timeoutId);
      }
      
      // Set new timeout
      const timeoutId = window.setTimeout(() => {
        setError({
          stage: 'timeout',
          code: 'PROCESSING_TIMEOUT',
          message: `Processing timed out after ${timeoutMs / 1000} seconds`,
          details: { stage, timeoutMs }
        });
      }, timeoutMs);
      
      return {
        ...prev,
        isProcessing: true,
        processingStage: stage,
        hasError: false,
        error: null,
        timeoutId
      };
    });
  }, [setError]);

  const processContent = useCallback(async (
    contentId: string,
    contentType: string,
    processingParams: any = {}
  ) => {
    try {
      let functionName: string;
      let requestBody: any = {
        recordingId: contentId,
        contentType,
        ...processingParams
      };

      // Determine which function to call based on content type
      switch (contentType) {
        case 'youtube':
          functionName = 'audio-transcription';
          startProcessingWithTimeout('youtube_extraction');
          break;
        case 'audio_file':
          functionName = 'audio-transcription';
          startProcessingWithTimeout('audio_transcription');
          break;
        case 'video':
          functionName = 'audio-transcription';
          startProcessingWithTimeout('video_transcription');
          break;
        case 'pdf':
          functionName = 'extract-pdf-text';
          startProcessingWithTimeout('pdf_extraction');
          requestBody = { contentId, ...processingParams };
          break;
        default:
          throw new Error(`Unsupported content type: ${contentType}`);
      }

      console.log(`Starting ${contentType} processing for content ${contentId}`);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: requestBody
      });

      if (error) {
        throw new Error(`Function invocation failed: ${error.message}`);
      }

      // Check for structured error response
      if (data && data.ok === false) {
        setError({
          stage: data.stage || 'unknown',
          code: data.code || 'PROCESSING_ERROR',
          message: data.message || 'Processing failed',
          details: data.details
        });
        return false;
      }

      // Success
      setComplete();
      toast.success('Content processed successfully!');
      return true;

    } catch (error) {
      console.error('Content processing error:', error);
      setError({
        stage: 'function_call',
        code: 'FUNCTION_CALL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { contentId, contentType, processingParams }
      });
      return false;
    }
  }, [startProcessingWithTimeout, setError, setComplete]);

  const retryProcessing = useCallback(async (
    contentId: string,
    contentType: string,
    processingParams: any = {}
  ) => {
    clearError();
    return await processContent(contentId, contentType, processingParams);
  }, [clearError, processContent]);

  return {
    isProcessing: state.isProcessing,
    hasError: state.hasError,
    error: state.error,
    processingStage: state.processingStage,
    processContent,
    retryProcessing,
    clearError,
    setProcessingStage,
    setError,
    setComplete
  };
};

export default useContentProcessing;