import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface OnboardingFormData {
  language: string;
  purpose: string;
  goal: string;
  source: string;
}

export const useOnboardingForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<OnboardingFormData>({
    language: '',
    purpose: '',
    goal: '',
    source: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Set a specific field in the form data
  const setField = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => {
      // If changing purpose, reset goal as it depends on purpose
      if (field === 'purpose') {
        return { ...prev, [field]: value, goal: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  // Validate form whenever form data changes
  useEffect(() => {
    const { language, purpose, goal, source } = formData;
    setIsFormValid(!!language && !!purpose && !!goal && !!source);
  }, [formData]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue."
      });
      return;
    }

    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to complete onboarding."
      });
      navigate('/signin');
      return;
    }

    try {
      // Map form values to database enum values with proper typing
      const purposeMap: Record<string, Database['public']['Enums']['user_purpose']> = {
        'student': 'student',
        'teacher': 'teacher',
        'work': 'professional',
        'research': 'researcher'
      };

      const goalMap: Record<string, Database['public']['Enums']['user_goal']> = {
        'exam-prep': 'exam_prep',
        'research': 'data_analysis',
        'coursework': 'homework_help',
        'lesson-planning': 'lesson_planning',
        'grading': 'student_assessment',
        'personalization': 'content_creation',
        'productivity': 'career_advancement',
        'learning': 'skill_building',
        'innovation': 'collaboration'
      };

      const sourceMap: Record<string, Database['public']['Enums']['user_source']> = {
        'search': 'search_engine',
        'instagram': 'social_media',
        'tiktok': 'social_media',
        'twitter': 'social_media',
        'youtube': 'social_media',
        'online-ad': 'advertisement',
        'friends-family': 'referral'
      };

      // Use upsert instead of insert to avoid duplicate key errors
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          language: formData.language,
          purpose: purposeMap[formData.purpose],
          goal: goalMap[formData.goal],
          source: sourceMap[formData.source],
          onboarding_completed: true
        }, { onConflict: ['id'] });

      if (error) {
        toast.error("Failed to save onboarding data", {
          description: error.message
        });
        return;
      }

      toast.success("Onboarding complete!", {
        description: "Your preferences have been saved."
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    }
  };

  return {
    formData,
    isFormValid,
    setField,
    handleSubmit
  };
};
