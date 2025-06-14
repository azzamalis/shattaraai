
-- Drop the existing INSERT policy that's missing the WITH CHECK condition
DROP POLICY IF EXISTS "Users can create their own rooms" ON public.rooms;

-- Create the corrected INSERT policy with proper WITH CHECK condition
CREATE POLICY "Users can create their own rooms" 
  ON public.rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
