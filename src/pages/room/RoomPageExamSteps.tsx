
import React from 'react';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { ExamPrepStepTwo } from '@/components/dashboard/exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from '@/components/dashboard/exam-prep/ExamPrepStepThree';

interface RoomPageExamStepsProps {
  examStep: number;
  currentRoom: any;
  isExamMode: boolean;
  selectedContentIds: string[];
  roomContent: any[];
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  handleToggleSelectAll: () => void;
  handleExamNext: () => void;
  handleExamBack: () => void;
  handleExamSkip: () => void;
  handleStartExam: () => void;
  handleExamCancel: () => void;
}

export function RoomPageExamSteps({
  examStep,
  currentRoom,
  isExamMode,
  selectedContentIds,
  roomContent,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  examLength,
  setExamLength,
  handleToggleSelectAll,
  handleExamNext,
  handleExamBack,
  handleExamSkip,
  handleStartExam,
  handleExamCancel
}: RoomPageExamStepsProps) {
  const selectedCount = selectedContentIds.length;
  const totalCount = roomContent.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  if (examStep === 1) {
    return (
      <RoomHeroSection 
        title={currentRoom.name} 
        description={currentRoom.description || ''} 
        isExamMode={isExamMode}
        examStep={examStep}
        examModeData={isExamMode ? {
          selectedCount,
          totalCount,
          isAllSelected,
          onToggleSelectAll: handleToggleSelectAll,
          onNext: handleExamNext,
          onCancel: handleExamCancel
        } : undefined}
      />
    );
  }

  if (examStep === 2) {
    return (
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <ExamPrepStepTwo
          onBack={handleExamBack}
          onNext={handleExamNext}
          onSkip={handleExamSkip}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 sm:px-6">
      <ExamPrepStepThree
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        questionType={questionType}
        setQuestionType={setQuestionType}
        examLength={examLength}
        setExamLength={setExamLength}
        onBack={handleExamBack}
        onStartExam={handleStartExam}
      />
    </div>
  );
}
