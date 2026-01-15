
import React, { useState, useMemo, useCallback, memo } from 'react';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomPageHeader } from '@/components/dashboard/RoomPageHeader';
import { RoomPageActions } from '@/components/dashboard/RoomPageActions';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { ExamPrepStepTwo } from '@/components/dashboard/exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from '@/components/dashboard/exam-prep/ExamPrepStepThree';
import { ProcessedExamResource } from '@/hooks/useExamResourceUpload';

interface RoomPageContentProps {
  currentRoom: any;
  roomContent: any[];
  roomId?: string;
  isExamMode: boolean;
  examStep: number;
  selectedContentIds: string[];
  handleTitleEdit: (title: string) => Promise<void>;
  handleDescriptionEdit: (description: string) => Promise<void>;
  handleContentToggle: (contentId: string) => void;
  setIsChatOpen: (open: boolean) => void;
  setIsExamMode: (mode: boolean) => void;
  handleExamCancel: () => void;
  handleToggleSelectAll: () => void;
  handleExamNext: () => void;
  handleExamBack: () => void;
  handleExamSkip: () => void;
  handleStartExam: () => void;
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  additionalResources: ProcessedExamResource[];
  setAdditionalResources: (resources: ProcessedExamResource[]) => void;
}

// Memoized exam step content components to prevent re-renders
const ExamStepOne = memo(function ExamStepOne({ 
  currentRoom, 
  isExamMode, 
  examStep, 
  examModeData 
}: { 
  currentRoom: any; 
  isExamMode: boolean; 
  examStep: number; 
  examModeData: any;
}) {
  return (
    <div className="py-6 sm:py-8">
      <RoomHeroSection 
        title={currentRoom.name} 
        description={currentRoom.description || ''} 
        isExamMode={isExamMode}
        examStep={examStep}
        examModeData={examModeData}
      />
    </div>
  );
});

const ExamStepTwoContent = memo(function ExamStepTwoContent({
  onBack,
  onNext,
  onSkip,
  onAdditionalResourcesChange
}: {
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onAdditionalResourcesChange: (resources: ProcessedExamResource[]) => void;
}) {
  return (
    <div className="py-6 sm:py-8">
      <ExamPrepStepTwo
        currentStep={2}
        totalSteps={3}
        onBack={onBack}
        onNext={onNext}
        onSkip={onSkip}
        onAdditionalResourcesChange={onAdditionalResourcesChange}
      />
    </div>
  );
});

const ExamStepThreeContent = memo(function ExamStepThreeContent({
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  examLength,
  setExamLength,
  onBack,
  onStartExam
}: {
  numQuestions: string;
  setNumQuestions: (value: string) => void;
  questionType: string;
  setQuestionType: (value: string) => void;
  examLength: string;
  setExamLength: (value: string) => void;
  onBack: () => void;
  onStartExam: () => void;
}) {
  return (
    <div className="py-6 sm:py-8">
      <ExamPrepStepThree
        currentStep={3}
        totalSteps={3}
        numQuestions={numQuestions}
        setNumQuestions={setNumQuestions}
        questionType={questionType}
        setQuestionType={setQuestionType}
        examLength={examLength}
        setExamLength={setExamLength}
        onBack={onBack}
        onStartExam={onStartExam}
      />
    </div>
  );
});

export const RoomPageContent = memo(function RoomPageContent({
  currentRoom,
  roomContent,
  roomId,
  isExamMode,
  examStep,
  selectedContentIds,
  handleTitleEdit,
  handleDescriptionEdit,
  handleContentToggle,
  setIsChatOpen,
  setIsExamMode,
  handleExamCancel,
  handleToggleSelectAll,
  handleExamNext,
  handleExamBack,
  handleExamSkip,
  handleStartExam,
  numQuestions,
  setNumQuestions,
  questionType,
  setQuestionType,
  examLength,
  setExamLength,
  additionalResources,
  setAdditionalResources
}: RoomPageContentProps) {
  const [showHeroSection, setShowHeroSection] = useState(false);

  // Memoized click handler
  const handleClickOutside = useCallback(() => {
    // This function is passed to header for click outside handling
  }, []);

  const handleAddContentClick = useCallback(() => {
    setShowHeroSection(prev => !prev);
  }, []);

  const handleChatOpen = useCallback(() => {
    setIsChatOpen(true);
  }, [setIsChatOpen]);

  const handleExamModalOpen = useCallback(() => {
    setIsExamMode(true);
  }, [setIsExamMode]);

  // Memoized exam mode data to prevent child re-renders
  const examModeData = useMemo(() => ({
    selectedCount: selectedContentIds.length,
    totalCount: roomContent.length,
    isAllSelected: selectedContentIds.length === roomContent.length && roomContent.length > 0,
    onToggleSelectAll: handleToggleSelectAll,
    onNext: handleExamNext,
    onCancel: handleExamCancel
  }), [selectedContentIds.length, roomContent.length, handleToggleSelectAll, handleExamNext, handleExamCancel]);

  // Memoized exam step content renderer
  const examStepContent = useMemo(() => {
    if (!isExamMode) return null;

    if (examStep === 1) {
      return (
        <ExamStepOne
          currentRoom={currentRoom}
          isExamMode={isExamMode}
          examStep={examStep}
          examModeData={examModeData}
        />
      );
    }

    if (examStep === 2) {
      return (
        <ExamStepTwoContent
          onBack={handleExamBack}
          onNext={handleExamNext}
          onSkip={handleExamSkip}
          onAdditionalResourcesChange={setAdditionalResources}
        />
      );
    }

    if (examStep === 3) {
      return (
        <ExamStepThreeContent
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          questionType={questionType}
          setQuestionType={setQuestionType}
          examLength={examLength}
          setExamLength={setExamLength}
          onBack={handleExamBack}
          onStartExam={handleStartExam}
        />
      );
    }

    return null;
  }, [
    isExamMode, examStep, currentRoom, examModeData,
    handleExamBack, handleExamNext, handleExamSkip, setAdditionalResources,
    numQuestions, setNumQuestions, questionType, setQuestionType,
    examLength, setExamLength, handleStartExam
  ]);

  // Memoized hero section for non-exam mode
  const heroSection = useMemo(() => {
    if (!showHeroSection || isExamMode) return null;
    
    return (
      <div className="py-6 sm:py-8">
        <RoomHeroSection 
          title={currentRoom.name} 
          description={currentRoom.description || ''} 
          isExamMode={false}
          examStep={0}
        />
      </div>
    );
  }, [showHeroSection, isExamMode, currentRoom?.name, currentRoom?.description]);

  // Memoized room view props
  const roomViewProps = useMemo(() => ({
    title: currentRoom.name,
    description: currentRoom.description || '',
    isEmpty: roomContent.length === 0,
    hideHeader: true,
    isExamSelectionMode: isExamMode && examStep === 1,
    selectedContentIds,
    onContentSelectionChange: handleContentToggle
  }), [currentRoom.name, currentRoom.description, roomContent.length, isExamMode, examStep, selectedContentIds, handleContentToggle]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden pt-6 sm:pt-8">
      <div className="px-4 sm:px-6 lg:px-12 2xl:px-36 bg-background">
        <div className="w-full">
          <div className="group/header relative">
            {/* Header and Actions - Stack on mobile, side-by-side on xl */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 xl:gap-6">
              <RoomPageHeader 
                room={currentRoom}
                onTitleEdit={handleTitleEdit}
                onDescriptionEdit={handleDescriptionEdit}
                onClickOutside={handleClickOutside}
              />

              <RoomPageActions 
                onChatOpen={handleChatOpen}
                onExamModalOpen={handleExamModalOpen}
                onExamModalClose={handleExamCancel}
                roomId={roomId}
                isExamMode={isExamMode}
                onAddContent={handleAddContentClick}
                isAddContentActive={showHeroSection}
              />
            </div>

            {/* Divider */}
            <div className="relative mt-4 md:mt-8">
              <div className="w-full h-px bg-border" />
            </div>

            {/* Hero Section - shown when Add Content is clicked (non-exam mode) */}
            {heroSection}

            {/* Exam Step Content - all steps rendered here */}
            {examStepContent}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <RoomView {...roomViewProps} />
      </div>
    </div>
  );
});
