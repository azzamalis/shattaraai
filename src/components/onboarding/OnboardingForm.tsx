
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import LanguageSelector from './selectors/LanguageSelector';
import PurposeSelector from './selectors/PurposeSelector';
import GoalSelector from './selectors/GoalSelector';
import SourceSelector from './selectors/SourceSelector';

const OnboardingForm = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('');
  const [purpose, setPurpose] = useState('');
  const [goal, setGoal] = useState('');
  const [source, setSource] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form
  useEffect(() => {
    setIsFormValid(!!language && !!purpose && !!goal && !!source);
  }, [language, purpose, goal, source]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormValid) {
      toast.success("Onboarding complete!", {
        description: "Your preferences have been saved."
      });
      
      // Navigate to home page or dashboard after onboarding
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } else {
      toast.error("Please complete all fields", {
        description: "All fields are required to continue."
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Selection */}
      <LanguageSelector value={language} onChange={setLanguage} />
      
      {/* Purpose Selection */}
      <PurposeSelector 
        value={purpose} 
        onChange={(value) => {
          setPurpose(value);
          setGoal(''); // Reset goal when purpose changes
        }} 
      />
      
      {/* Conditional Goal Selection */}
      {purpose && (
        <GoalSelector 
          value={goal} 
          onChange={setGoal} 
          purpose={purpose} 
        />
      )}
      
      {/* Source Selection */}
      <SourceSelector value={source} onChange={setSource} />
      
      {/* Continue Button */}
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-light text-white py-6 mt-8"
        disabled={!isFormValid}
      >
        Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );
};

export default OnboardingForm;
