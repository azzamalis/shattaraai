-- Add onboarding checklist columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_checklist_tasks text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_checklist_dismissed_at timestamptz,
ADD COLUMN IF NOT EXISTS onboarding_checklist_completed_at timestamptz;