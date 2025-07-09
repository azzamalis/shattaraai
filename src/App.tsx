
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import PricingPage from '@/pages/PricingPage';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import DashboardPage from '@/pages/DashboardPage';
import ContentPage from '@/pages/ContentPage';
import Profile from '@/pages/Profile';
import PasswordReset from '@/pages/PasswordReset';
import Onboarding from '@/pages/Onboarding';
import NotFound from '@/pages/NotFound';
import ErrorBoundary from '@/components/ErrorBoundary';
import { InviteHandler } from '@/components/InviteHandler';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content/:id" element={<ContentPage />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Add invite handler route */}
            <Route path="/invite/:code" element={<InviteHandler />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
