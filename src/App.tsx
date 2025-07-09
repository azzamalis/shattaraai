import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import PricingPage from '@/pages/PricingPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import DashboardPage from '@/pages/DashboardPage';
import ContentPage from '@/pages/ContentPage';
import AccountPage from '@/pages/AccountPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import OnboardingPage from '@/pages/OnboardingPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { InviteHandler } from '@/components/InviteHandler';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content/:id" element={<ContentPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="*" element={<NotFoundPage />} />
            
            {/* Add invite handler route */}
            <Route path="/invite/:code" element={<InviteHandler />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
