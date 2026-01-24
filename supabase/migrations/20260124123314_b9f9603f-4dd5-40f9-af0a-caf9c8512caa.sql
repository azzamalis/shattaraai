-- Fix newsletter_subscribers RLS policies
-- Remove redundant INSERT policies and consolidate into one with email validation

-- Drop existing overly permissive INSERT policies
DROP POLICY IF EXISTS "Anon can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticator can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Dashboard users can subscribe" ON public.newsletter_subscribers;

-- Create a single consolidated policy with email format validation
-- Allows public newsletter subscription but validates email format at database level
CREATE POLICY "Public newsletter subscription with validation"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Validate email format using regex
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  -- Limit email length to prevent abuse
  AND length(email) <= 255
  -- Ensure email is lowercase (matches what the edge function does)
  AND email = lower(email)
);