
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import LanguageSelector from './selectors/LanguageSelector';
import PurposeSelector from './selectors/PurposeSelector';
import GoalSelector from './selectors/GoalSelector';
import SourceSelector from './selectors/SourceSelector';
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import { useLanguage, type LanguageCode } from '@/contexts/LanguageContext';

const OnboardingForm = () => {
  const { 
    formData, 
    isFormValid, 
    setField, 
    handleSubmit 
  } = useOnboardingForm();
  
  const { t, isRTL, setLanguage } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setField('language', value);
    setLanguage(value as LanguageCode);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Language Selection */}
      <LanguageSelector 
        value={formData.language} 
        onChange={handleLanguageChange}
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
        className={`w-full bg-primary hover:bg-primary-light text-white py-6 mt-8 ${isRTL ? 'flex-row-reverse' : ''}`}
        disabled={!isFormValid}
      >
        {t('onboarding.continue')}
        <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
      </Button>
    </form>
  );
};

export default OnboardingForm;
