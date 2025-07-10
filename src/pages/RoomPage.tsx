
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { useRoomPageLogic } from './room/RoomPageLogic';
import { RoomPageExamSteps } from './room/RoomPageExamSteps';
import { RoomPageContent } from './room/RoomPageContent';

export default function RoomPage() {
  const {
    roomId,
    currentRoom,
    roomContent,
    roomsLoading,
    contentLoading,
    isChatOpen,
    setIsChatOpen,
    isExamMode,
    setIsExamMode,
    examStep,
    selectedContentIds,
    numQuestions,
    setNumQuestions,
    examLength,
    setExamLength,
    questionType,
    setQuestionType,
    handleTitleEdit,
    handleDescriptionEdit,
    handleContentToggle,
    handleToggleSelectAll,
    handleExamNext,
    handleExamBack,
    handleExamSkip,
    handleStartExam,
    handleExamCancel
  } = useRoomPageLogic();

  // Loading state - check both rooms and content loading
  if (roomsLoading || contentLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading room...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Room not found - only show after loading is complete
  if (!roomsLoading && !contentLoading && !currentRoom) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Room not found</h2>
            <p className="text-muted-foreground">The room you're looking for doesn't exist.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Hero Section - Default or Exam Mode */}
        <div className="py-12">
          <RoomPageExamSteps
            examStep={examStep}
            currentRoom={currentRoom}
            isExamMode={isExamMode}
            selectedContentIds={selectedContentIds}
            roomContent={roomContent}
            numQuestions={numQuestions}
            setNumQuestions={setNumQuestions}
            questionType={questionType}
            setQuestionType={setQuestionType}
            examLength={examLength}
            setExamLength={setExamLength}
            handleToggleSelectAll={handleToggleSelectAll}
            handleExamNext={handleExamNext}
            handleExamBack={handleExamBack}
            handleExamSkip={handleExamSkip}
            handleStartExam={handleStartExam}
            handleExamCancel={handleExamCancel}
          />
        </div>
        
        <RoomPageContent
          currentRoom={currentRoom}
          roomContent={roomContent}
          roomId={roomId}
          isExamMode={isExamMode}
          examStep={examStep}
          selectedContentIds={selectedContentIds}
          handleTitleEdit={handleTitleEdit}
          handleDescriptionEdit={handleDescriptionEdit}
          handleContentToggle={handleContentToggle}
          setIsChatOpen={setIsChatOpen}
          setIsExamMode={setIsExamMode}
          handleExamCancel={handleExamCancel}
        />
        
        <AITutorChatDrawer 
          open={isChatOpen} 
          onOpenChange={setIsChatOpen}
          roomId={roomId}
          roomContent={roomContent}
        />
      </div>
    </DashboardLayout>
  );
}
