
-- Create rooms table for user rooms
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content table for user content
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'video', 'pdf', 'recording', 'youtube', 'website', 'text')),
  url TEXT,
  text_content TEXT,
  filename TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for rooms table
CREATE POLICY "Users can view their own rooms" 
  ON public.rooms 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own rooms" 
  ON public.rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own rooms" 
  ON public.rooms 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rooms" 
  ON public.rooms 
  FOR DELETE 
  USING (auth.uid() = user_id);

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

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX rooms_user_id_idx ON public.rooms(user_id);
CREATE INDEX content_user_id_idx ON public.content(user_id);
CREATE INDEX content_room_id_idx ON public.content(room_id);
CREATE INDEX content_type_idx ON public.content(type);
