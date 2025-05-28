
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamLoadingScreen } from '@/components/dashboard/ExamLoadingScreen';

export default function ExamLoadingPage() {
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    // Navigate to exam page or wherever you want after loading completes
    // For now, let's navigate back to dashboard
    navigate('/dashboard');
  };

  return <ExamLoadingScreen onComplete={handleLoadingComplete} />;
}
