
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RoomView } from '@/components/dashboard/RoomView';
import { RoomHeroSection } from '@/components/dashboard/RoomHeroSection';
import { RoomPageHeader } from '@/components/dashboard/RoomPageHeader';
import { RoomPageActions } from '@/components/dashboard/RoomPageActions';
import { AITutorChatDrawer } from '@/components/dashboard/AITutorChatDrawer';
import { ExamPrepStepTwo } from '@/components/dashboard/exam-prep/ExamPrepStepTwo';
import { ExamPrepStepThree } from '@/components/dashboard/exam-prep/ExamPrepStepThree';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading, editRoom } = useRooms();
  const { content, loading: contentLoading } = useContent();
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExamMode, setIsExamMode] = useState(false);
  const [examStep, setExamStep] = useState(1);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  
  // Exam step 3 state
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');

  // Find the current room from the database
  const currentRoom = rooms.find(room => room.id === roomId);
  
  // Filter content for this room
  const roomContent = content.filter(item => item.room_id === roomId);

  // Handle exam modal trigger from exam summary
  useEffect(() => {
    if (location.state?.openExamModal) {
      setIsExamMode(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Store room ID when entering the room
  useEffect(() => {
    if (roomId) {
      localStorage.setItem('currentRoomId', roomId);
    }
  }, [roomId]);

  // Reset exam state when exam mode is disabled
  useEffect(() => {
    if (!isExamMode) {
      setExamStep(1);
      setSelectedContentIds([]);
      setNumQuestions('25');
      setExamLength('60');
      setQuestionType('Both');
    }
  }, [isExamMode]);

  const handleTitleEdit = async (newTitle: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, newTitle, currentRoom.description);
      } catch (error) {
        console.error('Error updating room title:', error);
        toast.error('Failed to update room title');
      }
    }
  };

  const handleDescriptionEdit = async (newDescription: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, currentRoom.name, newDescription);
      } catch (error) {
        console.error('Error updating room description:', error);
        toast.error('Failed to update room description');
      }
    }
  };

  const handleClickOutside = () => {
    // This function is passed to header for click outside handling
  };

  const handleContentToggle = (contentId: string) => {
    setSelectedContentIds(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const handleToggleSelectAll = () => {
    const allSelected = selectedContentIds.length === roomContent.length;
    setSelectedContentIds(allSelected ? [] : roomContent.map(item => item.id));
  };

  const handleExamNext = () => {
    if (examStep < 3) {
      setExamStep(examStep + 1);
    } else {
      handleStartExam();
    }
  };

  const handleExamBack = () => {
    if (examStep > 1) {
      setExamStep(examStep - 1);
    }
  };

  const handleExamSkip = () => {
    if (examStep < 3) {
      setExamStep(examStep + 1);
    }
  };

  const handleStartExam = () => {
    const selectedItems = roomContent.filter(item => selectedContentIds.includes(item.id));
    const examConfig = {
      selectedTopics: selectedItems.map(item => item.title),
      numQuestions,
      questionType,
      examLength
    };
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    setIsExamMode(false);
    navigate('/exam-loading');
  };

  const handleExamCancel = () => {
    setIsExamMode(false);
  };

  // Loading state
  if (roomsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading room...</div>
        </div>
      </DashboardLayout>
    );
  }

  // Room not found
  if (!currentRoom) {
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

  const selectedCount = selectedContentIds.length;
  const totalCount = roomContent.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Hero Section - Default or Exam Mode */}
        <div className="py-12">
          {examStep === 1 ? (
            <RoomHeroSection 
              title={currentRoom.name} 
              description={currentRoom.description || ''} 
              isExamMode={isExamMode}
              examModeData={isExamMode ? {
                selectedCount,
                totalCount,
                isAllSelected,
                onToggleSelectAll: handleToggleSelectAll,
                onNext: handleExamNext,
                onCancel: handleExamCancel
              } : undefined}
            />
          ) : examStep === 2 ? (
            <div className="max-w-[800px] mx-auto px-4 sm:px-6">
              <ExamPrepStepTwo
                onBack={handleExamBack}
                onNext={handleExamNext}
                onSkip={handleExamSkip}
              />
            </div>
          ) : (
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
          )}
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 bg-background">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <RoomPageHeader 
                    room={currentRoom}
                    onTitleEdit={handleTitleEdit}
                    onDescriptionEdit={handleDescriptionEdit}
                    onClickOutside={handleClickOutside}
                  />

                  <RoomPageActions 
                    onChatOpen={() => setIsChatOpen(true)}
                    onExamModalOpen={() => setIsExamMode(true)}
                    roomId={roomId}
                  />
                </div>

                <div className="w-full h-px bg-border" />
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
        
        <AITutorChatDrawer open={isChatOpen} onOpenChange={setIsChatOpen} />
      </div>
    </DashboardLayout>
  );
}
