
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { ContentProvider } from "@/contexts/ContentContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PasswordReset from "./pages/PasswordReset";
import NewPassword from "./pages/NewPassword";
import DashboardPage from "./pages/DashboardPage";
import RoomPage from "./pages/RoomPage";

import ContentPage from "./pages/ContentPage";
import ChatPage from "./pages/ChatPage";
import PricingPage from "./pages/PricingPage";
import Contact from "./pages/Contact";
import HistoryPage from "./pages/HistoryPage";
import Profile from "./pages/Profile";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Teachers from "./pages/Teachers";
import Team from "./pages/Team";
import Careers from "./pages/Careers";
import Onboarding from "./pages/Onboarding";
import ExamPage from "./pages/ExamPage";
import ExamLoadingPage from "./pages/ExamLoadingPage";
import ExamResultsPage from "./pages/ExamResultsPage";
import { ExamResultsSummary } from "./components/dashboard/ExamResultsSummary";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <ContentProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <div className="min-h-screen bg-background">
                  <Routes>
                  <Route path="/" element={<Index />} />
                   <Route path="/signin" element={<SignIn />} />
                   <Route path="/signup" element={<SignUp />} />
                   <Route path="/password-reset" element={<PasswordReset />} />
                   <Route path="/new-password" element={<NewPassword />} />
                   <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/rooms/:roomId" element={<RoomPage />} />
                  
                  <Route path="/content/:contentId" element={<ContentPage />} />
                  <Route path="/chat/:contentId" element={<ChatPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/teachers" element={<Teachers />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                   <Route path="/exam/:contentId" element={<ExamPage />} />
                   <Route path="/exam-loading/:roomId" element={<ExamLoadingPage />} />
                   <Route path="/exam-results/:contentId" element={<ExamResultsPage />} />
                   <Route path="/exam-summary/:contentId" element={<ExamResultsSummary />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </ContentProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
