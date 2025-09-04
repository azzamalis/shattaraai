-- Add automatic retry mechanism for stuck video processing
-- Create a function to handle automatic retries for videos stuck in processing
CREATE OR REPLACE FUNCTION public.auto_retry_stuck_video_processing()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  stuck_video RECORD;
BEGIN
  -- Find videos that have been in processing state for more than 5 minutes
  -- and don't have text_content or chapters populated
  FOR stuck_video IN
    SELECT id, storage_path
    FROM public.content 
    WHERE type = 'video' 
      AND processing_status = 'processing'
      AND (text_content IS NULL OR text_content = '')
      AND (chapters IS NULL OR chapters::text = 'null' OR chapters::text = '[]')
      AND updated_at < NOW() - INTERVAL '5 minutes'
      AND created_at > NOW() - INTERVAL '1 hour' -- Only retry recent uploads
  LOOP
    -- Reset status to pending and call extract-video-audio function
    UPDATE public.content 
    SET processing_status = 'pending',
        updated_at = NOW()
    WHERE id = stuck_video.id;
    
    -- Log the retry attempt
    RAISE NOTICE 'Auto-retrying video processing for content ID: %', stuck_video.id;
    
    -- Call the extract-video-audio function (this will be handled by the client)
    -- We just reset the status here, the client will detect and retry
  END LOOP;
END;
$function$

-- Create a trigger to automatically run the retry function every few minutes
-- This will be handled by a scheduled job on the client side instead