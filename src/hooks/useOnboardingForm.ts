
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface OnboardingFormData {
  language: string;
  purpose: string;
  goal: string;
  source: string;
}

export const useOnboardingForm = () => {
  const navigate = useNavigate();
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid) {
      toast.success("Onboarding complete!", {
        description: "Your preferences have been saved."
      });
      
      // Navigate to home page or dashboard after onboarding
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue."
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
