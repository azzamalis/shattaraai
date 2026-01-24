-- Add RLS policy for contact_rate_limits table
-- This allows service role (used by edge functions) to manage rate limit records
-- while preventing public access

CREATE POLICY "Service role can manage rate limits"
ON public.contact_rate_limits
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);