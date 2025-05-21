
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Team from "./pages/Team";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Careers from "./pages/Careers";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PasswordReset from "./pages/PasswordReset";
import Onboarding from "./pages/Onboarding";
import DashboardPage from "./pages/DashboardPage";
import RoomPage from "./pages/RoomPage";
import HistoryPage from "./pages/HistoryPage";
import RecordingRoom from "./pages/RecordingRoom";
import PricingPage from "./pages/PricingPage";
import Profile from "./pages/Profile";
import ReportsPage from "./pages/ReportsPage";
import React from "react";

// Create a new QueryClient instance inside the component
const App = () => {
  const queryClient = new QueryClient(); // Move this inside the component
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/team" element={<Team />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/onboarding" element={<Onboarding />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rooms/:id" element={<RoomPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/recording" element={<RecordingRoom />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
