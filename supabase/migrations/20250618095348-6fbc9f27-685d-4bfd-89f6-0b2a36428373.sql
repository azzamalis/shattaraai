
-- Drop the existing INSERT policy for rooms
DROP POLICY IF EXISTS "Users can create their own rooms" ON public.rooms;

-- Create a new INSERT policy with the correct WITH CHECK clause
CREATE POLICY "Users can create their own rooms" 
  ON public.rooms 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also update the other policies to ensure they're properly configured
DROP POLICY IF EXISTS "Users can view their own rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can update their own rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can delete their own rooms" ON public.rooms;

-- Recreate all policies with proper configuration
CREATE POLICY "Users can view their own rooms" 
  ON public.rooms 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rooms" 
  ON public.rooms 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rooms" 
  ON public.rooms 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
