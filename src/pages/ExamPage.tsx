import React, { Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamInterfaceSkeleton } from '@/components/ui/document-skeleton';

// Lazy load heavy ExamInterface component
const ExamInterface = lazy(() => import('@/components/dashboard/ExamInterface'));

export default function ExamPage() {
  const navigate = useNavigate();

  // Get generated exam from localStorage or fall back to config
  const getExamData = () => {
    const generatedExamStr = localStorage.getItem('generatedExam');
    if (generatedExamStr) {
      try {
        return JSON.parse(generatedExamStr);
      } catch (error) {
        console.error('Error parsing generated exam:', error);
      }
    }
    return null;
  };

  // Get exam config from localStorage as fallback
  const getExamConfig = () => {
    const savedConfig = localStorage.getItem('examConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      return {
        topics: config.selectedTopics || ['Physics', 'Astronomy'],
        contentMethod: 'Mixed',
        numQuestions: parseInt(config.numQuestions) || 25,
        examType: config.questionType || 'Both',
        duration: parseInt(config.examLength) || 60
      };
    }
    
    // Fallback default config
    return {
      topics: ['Physics', 'Astronomy'],
      contentMethod: 'Mixed',
      numQuestions: 25,
      examType: 'Both',
      duration: 60
    };
  };

  const generatedExam = getExamData();
  const examConfig = getExamConfig();

  const handleSubmitExam = (questions: any[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => {
    // Save exam results to localStorage for the results page
    const examResults = {
      questions,
      answers,
      skippedQuestions: Array.from(skippedQuestions),
      score: {
        total: questions.length,
        // Add more score calculations here
      }
    };
    localStorage.setItem('examResults', JSON.stringify(examResults));
    
    // Clear exam data after submission
    localStorage.removeItem('examConfig');
    localStorage.removeItem('generatedExam');
    
    // Navigate to results page
    navigate('/exam-results');
  };

  return (
    <Suspense fallback={<ExamInterfaceSkeleton />}>
      <ExamInterface 
        examConfig={examConfig}
        generatedExam={generatedExam}
        onSubmitExam={handleSubmitExam}
      />
    </Suspense>
  );
}
