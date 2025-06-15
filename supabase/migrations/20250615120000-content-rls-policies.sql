
-- Add RLS policies for the content table to ensure users can only access their own content
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own content" ON public.content;
DROP POLICY IF EXISTS "Users can create their own content" ON public.content;
DROP POLICY IF EXISTS "Users can update their own content" ON public.content;
DROP POLICY IF EXISTS "Users can delete their own content" ON public.content;

-- Create RLS policies for content table
CREATE POLICY "Users can view their own content" 
  ON public.content 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content" 
  ON public.content 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content" 
  ON public.content 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content" 
  ON public.content 
  FOR DELETE 
  USING (auth.uid() = user_id);
