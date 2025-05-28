
import React from 'react';
import ExamInterface from '@/components/dashboard/ExamInterface';

export default function ExamPage() {
  // Get exam config from localStorage or navigation state
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

  const examConfig = getExamConfig();

  const handleSubmitExam = (questions: any[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => {
    console.log('Exam submitted:', { questions, answers, skippedQuestions });
    // Clear exam config after submission
    localStorage.removeItem('examConfig');
    // Handle exam submission logic here
  };

  return (
    <ExamInterface 
      examConfig={examConfig}
      onSubmitExam={handleSubmitExam}
    />
  );
}
