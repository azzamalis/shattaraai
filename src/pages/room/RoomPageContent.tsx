
import React, { useState } from 'react';
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

export function RoomPageContent({
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

  const handleClickOutside = () => {
    // This function is passed to header for click outside handling
  };

  const handleAddContentClick = () => {
    setShowHeroSection(prev => !prev);
  };

  // Calculate exam mode data
  const selectedCount = selectedContentIds.length;
  const totalCount = roomContent.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  // Render exam step content based on current step
  const renderExamStepContent = () => {
    if (!isExamMode) return null;

    if (examStep === 1) {
      return (
        <div className="py-6 sm:py-8">
          <RoomHeroSection 
            title={currentRoom.name} 
            description={currentRoom.description || ''} 
            isExamMode={isExamMode}
            examStep={examStep}
            examModeData={{
              selectedCount,
              totalCount,
              isAllSelected,
              onToggleSelectAll: handleToggleSelectAll,
              onNext: handleExamNext,
              onCancel: handleExamCancel
            }}
          />
        </div>
      );
    }

    if (examStep === 2) {
      return (
        <div className="py-6 sm:py-8">
          <ExamPrepStepTwo
            currentStep={2}
            totalSteps={3}
            onBack={handleExamBack}
            onNext={handleExamNext}
            onSkip={handleExamSkip}
            onAdditionalResourcesChange={setAdditionalResources}
          />
        </div>
      );
    }

    if (examStep === 3) {
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
            onBack={handleExamBack}
            onStartExam={handleStartExam}
          />
        </div>
      );
    }

    return null;
  };

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
                onChatOpen={() => setIsChatOpen(true)}
                onExamModalOpen={() => setIsExamMode(true)}
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
            {showHeroSection && !isExamMode && (
              <div className="py-6 sm:py-8">
                <RoomHeroSection 
                  title={currentRoom.name} 
                  description={currentRoom.description || ''} 
                  isExamMode={false}
                  examStep={0}
                />
              </div>
            )}

            {/* Exam Step Content - all steps rendered here */}
            {renderExamStepContent()}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <RoomView 
          title={currentRoom.name} 
          description={currentRoom.description || ''} 
          isEmpty={roomContent.length === 0} 
          hideHeader={true}
          isExamSelectionMode={isExamMode && examStep === 1}
          selectedContentIds={selectedContentIds}
          onContentSelectionChange={handleContentToggle}
        />
      </div>
    </div>
  );
}
