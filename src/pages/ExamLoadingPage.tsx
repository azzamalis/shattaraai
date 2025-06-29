
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamLoadingScreen } from '@/components/dashboard/ExamLoadingScreen';

export default function ExamLoadingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const handleLoadingComplete = () => {
    // Get exam config from localStorage to determine where to navigate
    const examConfig = localStorage.getItem('examConfig');
    if (examConfig) {
      const config = JSON.parse(examConfig);
      // Navigate to exam page with the first selected content ID or room ID
      const contentId = config.selectedContentIds?.[0] || roomId;
      navigate(`/exam/${contentId}`);
    } else {
      // Fallback: navigate to exam page with room ID
      navigate(`/exam/${roomId}`);
    }
  };

  return <ExamLoadingScreen onComplete={handleLoadingComplete} />;
}
