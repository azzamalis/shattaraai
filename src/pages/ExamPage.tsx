
import React from 'react';
import ExamInterface from '@/components/dashboard/ExamInterface';

export default function ExamPage() {
  const examConfig = {
    topics: ['Physics', 'Astronomy'],
    contentMethod: 'Mixed',
    numQuestions: 25,
    examType: 'Both',
    duration: 60
  };

  const handleSubmitExam = (questions: any[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => {
    console.log('Exam submitted:', { questions, answers, skippedQuestions });
    // Handle exam submission logic here
  };

  return (
    <ExamInterface 
      examConfig={examConfig}
      onSubmitExam={handleSubmitExam}
    />
  );
}
