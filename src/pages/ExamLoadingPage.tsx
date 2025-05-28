import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamLoadingScreen } from '@/components/dashboard/ExamLoadingScreen';

export default function ExamLoadingPage() {
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    // Navigate to exam page after loading completes
    navigate('/exam');
  };

  return <ExamLoadingScreen onComplete={handleLoadingComplete} />;
}
