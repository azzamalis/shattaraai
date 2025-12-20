-- Create rate limiting table for contact form
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient rate limit queries
CREATE INDEX idx_contact_rate_limits_lookup 
ON public.contact_rate_limits (ip_address, endpoint, created_at);

-- Enable RLS (but allow service role access)
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can access this table
-- The edge function uses service role key so it can insert/query

-- Create cleanup function to remove old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limits 
  WHERE created_at < now() - INTERVAL '2 hours';
END;
$$;