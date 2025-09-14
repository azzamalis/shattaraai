-- Clean up existing policies completely first
DROP POLICY IF EXISTS "Enhanced profile select policy" ON public.profiles;
DROP POLICY IF EXISTS "Enhanced profile update policy" ON public.profiles;
DROP POLICY IF EXISTS "Enhanced profile insert policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Enhanced security function to validate profile access with additional checks
CREATE OR REPLACE FUNCTION public.validate_profile_access(profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Get current authenticated user
  current_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if trying to access their own profile
  IF current_user_id != profile_id THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Create audit log table for sensitive profile operations (if not exists)
CREATE TABLE IF NOT EXISTS public.profile_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  action text NOT NULL,
  changed_fields jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.profile_audit_log ENABLE ROW LEVEL SECURITY;

-- Drop existing audit policy if exists
DROP POLICY IF EXISTS "Users can view their own audit log" ON public.profile_audit_log;

-- Create policy for audit log - only users can see their own audit entries
CREATE POLICY "Users can view their own audit log"
ON public.profile_audit_log
FOR SELECT
USING (auth.uid() = user_id);

-- Function to log profile changes
CREATE OR REPLACE FUNCTION public.log_profile_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed_fields jsonb := '{}';
  action_type text;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'profile_created';
    changed_fields := row_to_json(NEW)::jsonb;
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'profile_updated';
    -- Only log changed fields
    IF COALESCE(OLD.email, '') != COALESCE(NEW.email, '') THEN
      changed_fields := changed_fields || jsonb_build_object('email', jsonb_build_object('old', OLD.email, 'new', NEW.email));
    END IF;
    IF COALESCE(OLD.full_name, '') != COALESCE(NEW.full_name, '') THEN
      changed_fields := changed_fields || jsonb_build_object('full_name', jsonb_build_object('old', OLD.full_name, 'new', NEW.full_name));
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'profile_deleted';
    changed_fields := row_to_json(OLD)::jsonb;
  END IF;
  
  -- Insert audit log entry
  INSERT INTO public.profile_audit_log (
    user_id,
    action,
    changed_fields
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    changed_fields
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile audit logging
DROP TRIGGER IF EXISTS profile_audit_trigger ON public.profiles;
CREATE TRIGGER profile_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_change();

-- Enhanced RLS policies using the validation function
CREATE POLICY "Secure profile select policy"
ON public.profiles
FOR SELECT
USING (public.validate_profile_access(id));

CREATE POLICY "Secure profile update policy"  
ON public.profiles
FOR UPDATE
USING (public.validate_profile_access(id))
WITH CHECK (public.validate_profile_access(id));

CREATE POLICY "Secure profile insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (public.validate_profile_access(id));

-- Create a secure function for invite code validation
CREATE OR REPLACE FUNCTION public.validate_invite_code(code text)
RETURNS table(is_valid boolean, referrer_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (ur.is_active = true) as is_valid,
    ur.user_id as referrer_id
  FROM public.user_referrals ur
  WHERE ur.invite_code = code
  LIMIT 1;
END;
$$;

-- Drop existing referral policy and create new restrictive one
DROP POLICY IF EXISTS "Public can validate invite codes" ON public.user_referrals;
DROP POLICY IF EXISTS "Users can view their own referral data" ON public.user_referrals;

CREATE POLICY "Users can view their own referral data"
ON public.user_referrals
FOR SELECT
USING (auth.uid() = user_id);