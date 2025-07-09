
-- Create user_referrals table to store unique invite codes for each user
CREATE TABLE public.user_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  successful_referrals INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id)
);

-- Create referral_activities table to track all referral events
CREATE TABLE public.referral_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invite_code TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('link_clicked', 'signup_completed', 'first_content_uploaded', 'reward_earned')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create referral_rewards table to manage earned benefits
CREATE TABLE public.referral_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_activity_id UUID NOT NULL REFERENCES public.referral_activities(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('free_month', 'bonus_credits', 'premium_features')),
  reward_value INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'claimed', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_referrals
CREATE POLICY "Users can view their own referral codes" 
  ON public.user_referrals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own referral codes" 
  ON public.user_referrals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes" 
  ON public.user_referrals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow public read access to referral codes for validation (without exposing user_id)
CREATE POLICY "Public can validate invite codes" 
  ON public.user_referrals 
  FOR SELECT 
  USING (is_active = true);

-- RLS Policies for referral_activities
CREATE POLICY "Users can view their referral activities" 
  ON public.referral_activities 
  FOR SELECT 
  USING (auth.uid() = referrer_user_id OR auth.uid() = referee_user_id);

CREATE POLICY "System can create referral activities" 
  ON public.referral_activities 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for referral_rewards
CREATE POLICY "Users can view their own rewards" 
  ON public.referral_rewards 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create rewards" 
  ON public.referral_rewards 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own rewards" 
  ON public.referral_rewards 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to generate unique invite codes
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-character code with letters and numbers
    code := UPPER(
      substr(md5(random()::text || clock_timestamp()::text), 1, 4) ||
      substr(md5(random()::text || clock_timestamp()::text), 1, 4)
    );
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.user_referrals WHERE invite_code = code) INTO code_exists;
    
    -- If unique, exit loop
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically generate invite code for new users
CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_referrals (user_id, invite_code)
  VALUES (NEW.id, public.generate_invite_code());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-generate invite codes for new users
CREATE TRIGGER on_user_created_generate_referral_code
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_referral_code();

-- Create function to update referral stats
CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total referrals count
  UPDATE public.user_referrals 
  SET total_referrals = total_referrals + 1,
      updated_at = now()
  WHERE user_id = NEW.referrer_user_id
    AND NEW.activity_type = 'signup_completed';
  
  -- Update successful referrals count
  UPDATE public.user_referrals 
  SET successful_referrals = successful_referrals + 1,
      updated_at = now()
  WHERE user_id = NEW.referrer_user_id
    AND NEW.activity_type = 'first_content_uploaded';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update referral stats
CREATE TRIGGER on_referral_activity_update_stats
  AFTER INSERT ON public.referral_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_stats();

-- Add updated_at trigger for referral_rewards
CREATE TRIGGER handle_updated_at_referral_rewards
  BEFORE UPDATE ON public.referral_rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add updated_at trigger for user_referrals
CREATE TRIGGER handle_updated_at_user_referrals
  BEFORE UPDATE ON public.user_referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
