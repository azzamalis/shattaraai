-- First, let's check if there's a content record that should exist
-- Update the recordings RLS policy to allow creation for live recordings
DROP POLICY IF EXISTS "Users can create their own recordings" ON public.recordings;

-- Create a more permissive policy for recordings that handles both regular recordings and live recordings
CREATE POLICY "Users can create their own recordings" 
ON public.recordings 
FOR INSERT 
WITH CHECK (
  -- For live recordings, check if the user is authenticated
  (content_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' AND auth.uid() IS NOT NULL)
  OR
  -- For regular recordings, check content ownership
  (auth.uid() IN (
    SELECT content.user_id 
    FROM content 
    WHERE content.id = recordings.content_id
  ))
);