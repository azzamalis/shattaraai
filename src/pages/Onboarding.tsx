
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';
import OnboardingForm from '@/components/onboarding/OnboardingForm';

const Onboarding = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="inline-block">
          <Logo textColor="text-white" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-dark-deeper rounded-xl p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome to Shattara AI</h1>
          <p className="text-gray-400">Tell us about yourself to get started</p>
        </div>
        
        <OnboardingForm />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Already set up? <Link to="/signin" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
