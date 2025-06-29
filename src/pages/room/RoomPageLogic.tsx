
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';

export const useRoomPageLogic = () => {
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
      examLength,
      roomId,
      selectedContentIds
    };
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    setIsExamMode(false);
    // Navigate to exam loading page with room ID as parameter
    navigate(`/exam-loading/${roomId}`);
  };

  const handleExamCancel = () => {
    setIsExamMode(false);
  };

  return {
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
  };
};
