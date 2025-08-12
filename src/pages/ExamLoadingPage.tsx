
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ExamLoadingScreen } from '@/components/dashboard/ExamLoadingScreen';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function ExamLoadingPage() {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateExam();
  }, []);

  const generateExam = async () => {
    try {
      setIsGenerating(true);

      // Get exam config from localStorage
      const examConfigStr = localStorage.getItem('examConfig');
      if (!examConfigStr) {
        toast.error('Exam configuration not found');
        navigate(`/rooms/${roomId}`);
        return;
      }

      const examConfig = JSON.parse(examConfigStr);

      // Get room content for the selected content IDs
      const { data: roomContent, error: contentError } = await supabase
        .from('content')
        .select('id, title, type, text_content')
        .in('id', examConfig.selectedContentIds || []);

      if (contentError) {
        console.error('Error fetching room content:', contentError);
        toast.error('Failed to load room content');
        navigate(`/rooms/${roomId}`);
        return;
      }

      // Call OpenAI exam generation
      const { data, error } = await supabase.functions.invoke('openai-generate-exam', {
        body: {
          roomId,
          roomContent: roomContent || [],
          additionalResources: examConfig.additionalResources || [],
          examConfig: {
            numQuestions: parseInt(examConfig.numQuestions) || 25,
            questionType: examConfig.questionType || 'Both',
            examLength: parseInt(examConfig.examLength) || 60,
            selectedTopics: examConfig.selectedTopics || []
          }
        }
      });

      if (error) {
        console.error('Error generating exam:', error);
        toast.error('Failed to generate exam. Please try again.');
        navigate(`/rooms/${roomId}`);
        return;
      }

      if (!data?.success) {
        console.error('Exam generation failed:', data?.error);
        toast.error(data?.error || 'Failed to generate exam');
        navigate(`/rooms/${roomId}`);
        return;
      }

      // Store generated exam in localStorage
      localStorage.setItem('generatedExam', JSON.stringify(data.exam));
      
      // Navigate to exam page after a short delay
      setTimeout(() => {
        const contentId = examConfig.selectedContentIds?.[0] || roomId;
        navigate(`/exam/${contentId}`);
      }, 2000);

    } catch (error) {
      console.error('Unexpected error generating exam:', error);
      toast.error('An unexpected error occurred');
      navigate(`/rooms/${roomId}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadingComplete = () => {
    // This will be called by ExamLoadingScreen if needed
    if (!isGenerating) {
      const examConfig = localStorage.getItem('examConfig');
      if (examConfig) {
        const config = JSON.parse(examConfig);
        const contentId = config.selectedContentIds?.[0] || roomId;
        navigate(`/exam/${contentId}`);
      } else {
        navigate(`/exam/${roomId}`);
      }
    }
  };

  return <ExamLoadingScreen onComplete={handleLoadingComplete} />;
}
