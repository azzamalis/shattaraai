-- Fix Function Search Path Issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, language, onboarding_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'en',
    false
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    UPDATE public.profiles 
    SET 
      email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', full_name),
      updated_at = now()
    WHERE id = NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.chat_conversations 
  SET 
    last_message_at = NEW.created_at,
    updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_exam_metrics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.time_taken_minutes = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) / 60;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ai_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := UPPER(
      substr(md5(random()::text || clock_timestamp()::text), 1, 4) ||
      substr(md5(random()::text || clock_timestamp()::text), 1, 4)
    );
    
    SELECT EXISTS(SELECT 1 FROM public.user_referrals WHERE invite_code = code) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_referrals (user_id, invite_code)
  VALUES (NEW.id, public.generate_invite_code());
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
$$;

-- Enhanced security function to validate profile access with additional checks
CREATE OR REPLACE FUNCTION public.validate_profile_access(profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  session_valid boolean;
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
  
  -- Additional security: Verify session is still valid
  SELECT EXISTS(
    SELECT 1 FROM auth.sessions 
    WHERE user_id = current_user_id 
    AND expires_at > now()
  ) INTO session_valid;
  
  RETURN session_valid;
END;
$$;

-- Create audit log table for sensitive profile operations
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
    IF OLD.email != NEW.email THEN
      changed_fields := changed_fields || jsonb_build_object('email', jsonb_build_object('old', OLD.email, 'new', NEW.email));
    END IF;
    IF OLD.full_name != NEW.full_name THEN
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
    changed_fields,
    ip_address,
    user_agent
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    changed_fields,
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for profile audit logging
DROP TRIGGER IF EXISTS profile_audit_trigger ON public.profiles;
CREATE TRIGGER profile_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.log_profile_change();

-- Update profiles RLS policies with enhanced security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Enhanced RLS policies using the validation function
CREATE POLICY "Enhanced profile select policy"
ON public.profiles
FOR SELECT
USING (public.validate_profile_access(id));

CREATE POLICY "Enhanced profile update policy"
ON public.profiles
FOR UPDATE
USING (public.validate_profile_access(id))
WITH CHECK (public.validate_profile_access(id));

CREATE POLICY "Enhanced profile insert policy"
ON public.profiles
FOR INSERT
WITH CHECK (public.validate_profile_access(id));

-- Restrict referral system access for better security
DROP POLICY IF EXISTS "Public can validate invite codes" ON public.user_referrals;

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

-- New restrictive policy for referrals
CREATE POLICY "Users can view their own referral data"
ON public.user_referrals
FOR SELECT
USING (auth.uid() = user_id);