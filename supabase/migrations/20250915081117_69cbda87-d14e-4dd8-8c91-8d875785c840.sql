-- Fix security vulnerability in referral system policies
-- Remove overly permissive policies and replace with secure ones

-- Drop the insecure policies
DROP POLICY IF EXISTS "System can create referral activities" ON public.referral_activities;
DROP POLICY IF EXISTS "System can create rewards" ON public.referral_rewards;

-- Create secure policies that only allow service role or system functions to create records
-- For referral_activities: Only allow service role to insert
CREATE POLICY "Service role can create referral activities" 
ON public.referral_activities 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- For referral_rewards: Only allow service role to insert  
CREATE POLICY "Service role can create referral rewards"
ON public.referral_rewards 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Update the referral system functions to use proper security
-- Update the referral stats function to ensure it runs with proper privileges
CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only update if this is a legitimate referral activity
  -- This function should only be called by system triggers or edge functions
  UPDATE public.user_referrals 
  SET total_referrals = total_referrals + 1,
      updated_at = now()
  WHERE user_id = NEW.referrer_user_id
    AND NEW.activity_type = 'signup_completed';
  
  UPDATE public.user_referrals 
  SET successful_referrals = successful_referrals + 1,
      updated_at = now()
  WHERE user_id = NEW.referrer_user_id
    AND NEW.activity_type = 'first_content_uploaded';
  
  RETURN NEW;
END;
$function$;