import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const OnboardingContent = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-dark px-4 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <Logo textColor="text-white" className="scale-125" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-dark-deeper rounded-xl p-8 shadow-xl">
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-3xl font-bold mb-2 text-white">{t('onboarding.welcome')}</h1>
          <p className="text-gray-400">{t('onboarding.description')}</p>
        </div>
        
        <OnboardingForm />
      </div>
      
      <div className={`mt-6 text-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <p className="text-slate-400 text-sm">
          {t('onboarding.alreadySetup')}{' '}
          <Link 
            to="/signin" 
            className="text-white font-medium relative after:absolute 
              after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
              after:bg-white after:transition-all after:duration-300"
          >
            {t('onboarding.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

const Onboarding = () => {
  return (
    <LanguageProvider>
      <OnboardingContent />
    </LanguageProvider>
  );
};

export default Onboarding;
