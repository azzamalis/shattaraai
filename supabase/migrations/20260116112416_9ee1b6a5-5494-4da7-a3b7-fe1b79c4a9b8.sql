-- Create IP rate limits table for public endpoints
CREATE TABLE IF NOT EXISTS public.ip_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_lookup 
ON public.ip_rate_limits (ip_address, endpoint, window_start);

-- Create index for cleanup
CREATE INDEX IF NOT EXISTS idx_ip_rate_limits_window 
ON public.ip_rate_limits (window_start);

-- Enable RLS (but allow service role to access)
ALTER TABLE public.ip_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create function to check and update IP rate limit
CREATE OR REPLACE FUNCTION public.check_ip_rate_limit(
  p_ip_address TEXT,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS TABLE(allowed BOOLEAN, remaining_requests INTEGER, reset_time TIMESTAMP WITH TIME ZONE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_current_count INTEGER;
  v_record_id UUID;
BEGIN
  -- Calculate window start
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current count for this IP and endpoint within the window
  SELECT id, request_count INTO v_record_id, v_current_count
  FROM public.ip_rate_limits
  WHERE ip_address = p_ip_address 
    AND endpoint = p_endpoint
    AND window_start > v_window_start
  ORDER BY window_start DESC
  LIMIT 1;
  
  IF v_record_id IS NULL THEN
    -- No recent record, create new one
    INSERT INTO public.ip_rate_limits (ip_address, endpoint, request_count, window_start)
    VALUES (p_ip_address, p_endpoint, 1, now());
    
    RETURN QUERY SELECT 
      true AS allowed,
      (p_max_requests - 1) AS remaining_requests,
      (now() + (p_window_minutes || ' minutes')::INTERVAL) AS reset_time;
  ELSIF v_current_count >= p_max_requests THEN
    -- Rate limit exceeded
    RETURN QUERY SELECT 
      false AS allowed,
      0 AS remaining_requests,
      (SELECT window_start + (p_window_minutes || ' minutes')::INTERVAL 
       FROM public.ip_rate_limits WHERE id = v_record_id) AS reset_time;
  ELSE
    -- Update count
    UPDATE public.ip_rate_limits 
    SET request_count = request_count + 1, updated_at = now()
    WHERE id = v_record_id;
    
    RETURN QUERY SELECT 
      true AS allowed,
      (p_max_requests - v_current_count - 1) AS remaining_requests,
      (SELECT window_start + (p_window_minutes || ' minutes')::INTERVAL 
       FROM public.ip_rate_limits WHERE id = v_record_id) AS reset_time;
  END IF;
END;
$$;

-- Create cleanup function for old IP rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_old_ip_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.ip_rate_limits 
  WHERE window_start < now() - INTERVAL '24 hours';
END;
$$;