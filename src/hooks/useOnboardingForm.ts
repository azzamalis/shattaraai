
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface OnboardingFormData {
  language: string;
  purpose: string;
  goal: string;
  source: string;
}

export const useOnboardingForm = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
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
      // Map form values to database enum values
      const purposeMap: Record<string, string> = {
        'student': 'student',
        'teacher': 'teacher',
        'work': 'professional',
        'research': 'researcher'
      };

      const goalMap: Record<string, string> = {
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

      const sourceMap: Record<string, string> = {
        'search': 'search_engine',
        'instagram': 'social_media',
        'tiktok': 'social_media',
        'twitter': 'social_media',
        'youtube': 'social_media',
        'online-ad': 'advertisement',
        'friends-family': 'referral'
      };

      const { error } = await updateProfile({
        language: formData.language,
        purpose: purposeMap[formData.purpose] || formData.purpose,
        goal: goalMap[formData.goal] || formData.goal,
        source: sourceMap[formData.source] || formData.source,
        onboarding_completed: true
      });

      if (error) {
        toast.error("Failed to save onboarding data", {
          description: error.message
        });
        return;
      }

      toast.success("Onboarding complete!", {
        description: "Your preferences have been saved."
      });
      
      // Navigate to dashboard after onboarding
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
