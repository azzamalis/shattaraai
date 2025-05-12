
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import LanguageSelector from './selectors/LanguageSelector';
import PurposeSelector from './selectors/PurposeSelector';
import GoalSelector from './selectors/GoalSelector';
import SourceSelector from './selectors/SourceSelector';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';

const OnboardingForm = () => {
  const { 
    formData, 
    isFormValid, 
    setField, 
    handleSubmit 
  } = useOnboardingForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Selection */}
      <LanguageSelector 
        value={formData.language} 
        onChange={(value) => setField('language', value)} 
      />
      
      {/* Purpose Selection */}
      <PurposeSelector 
        value={formData.purpose} 
        onChange={(value) => setField('purpose', value)} 
      />
      
      {/* Conditional Goal Selection */}
      {formData.purpose && (
        <GoalSelector 
          value={formData.goal} 
          onChange={(value) => setField('goal', value)} 
          purpose={formData.purpose} 
        />
      )}
      
      {/* Source Selection */}
      <SourceSelector 
        value={formData.source} 
        onChange={(value) => setField('source', value)} 
      />
      
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
