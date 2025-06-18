
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';

const Onboarding = () => {
  const { t, isRTL } = useLanguage();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated, redirect to sign in
        navigate('/signin');
      } else if (profile?.onboarding_completed) {
        // User already completed onboarding, redirect to dashboard
        navigate('/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to sign in
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <Logo textColor="text-foreground" className="scale-125" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-card rounded-xl p-8 shadow-xl border border-border">
        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{t('onboarding.welcome')}</h1>
          <p className="text-muted-foreground">{t('onboarding.description')}</p>
        </div>
        
        <OnboardingForm />
      </div>
      
      <div className={`mt-6 text-center ${isRTL ? 'rtl' : 'ltr'}`}>
        <p className="text-muted-foreground text-sm">
          {t('onboarding.alreadySetup')}{' '}
          <Link 
            to="/signin" 
            className="text-foreground font-medium relative after:absolute 
              after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full 
              after:bg-foreground after:transition-all after:duration-300"
          >
            {t('onboarding.signIn')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
