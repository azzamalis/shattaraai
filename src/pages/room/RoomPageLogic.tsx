
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRooms } from '@/hooks/useRooms';
import { useContent } from '@/hooks/useContent';
import { ProcessedExamResource } from '@/hooks/useExamResourceUpload';

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
  const [additionalResources, setAdditionalResources] = useState<ProcessedExamResource[]>([]);
  
  // Exam step 3 state
  const [numQuestions, setNumQuestions] = useState('25');
  const [examLength, setExamLength] = useState('60');
  const [questionType, setQuestionType] = useState('Both');

  // Memoized room lookup - prevents recalculation on every render
  const currentRoom = useMemo(() => 
    rooms.find(room => room.id === roomId),
    [rooms, roomId]
  );
  
  // Memoized content filtering - prevents recalculation on every render
  const roomContent = useMemo(() => 
    content.filter(item => item.room_id === roomId),
    [content, roomId]
  );

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

  // Memoized callback handlers to prevent child re-renders
  const handleTitleEdit = useCallback(async (newTitle: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, newTitle, currentRoom.description);
      } catch (error) {
        console.error('Error updating room title:', error);
        toast.error('Failed to update room title');
      }
    }
  }, [currentRoom, editRoom]);

  const handleDescriptionEdit = useCallback(async (newDescription: string) => {
    if (currentRoom) {
      try {
        await editRoom(currentRoom.id, currentRoom.name, newDescription);
      } catch (error) {
        console.error('Error updating room description:', error);
        toast.error('Failed to update room description');
      }
    }
  }, [currentRoom, editRoom]);

  const handleContentToggle = useCallback((contentId: string) => {
    setSelectedContentIds(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedContentIds(prev => {
      const allSelected = prev.length === roomContent.length;
      return allSelected ? [] : roomContent.map(item => item.id);
    });
  }, [roomContent]);

  const handleExamNext = useCallback(() => {
    setExamStep(prev => {
      if (prev < 3) return prev + 1;
      return prev;
    });
  }, []);

  const handleExamBack = useCallback(() => {
    setExamStep(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleExamSkip = useCallback(() => {
    setExamStep(prev => (prev < 3 ? prev + 1 : prev));
  }, []);

  const handleStartExam = useCallback(() => {
    const selectedItems = roomContent.filter(item => selectedContentIds.includes(item.id));
    
    // Build additional resources with extracted content
    const processedResources = additionalResources.map(resource => ({
      id: resource.id,
      title: resource.title,
      type: resource.type,
      content: resource.extractedContent || resource.text || resource.url || '',
      storageUrl: resource.storageUrl,
      hasExtractedContent: !!resource.extractedContent,
      processingError: resource.processingError
    }));

    const examConfig = {
      selectedTopics: selectedItems.map(item => item.title),
      numQuestions,
      questionType,
      examLength,
      roomId,
      selectedContentIds,
      additionalResources: processedResources
    };
    
    console.log(`Starting exam with ${processedResources.length} additional resources:`, 
      processedResources.map(r => ({ title: r.title, hasContent: !!r.content, contentLength: r.content?.length || 0 }))
    );
    
    localStorage.setItem('examConfig', JSON.stringify(examConfig));
    
    setIsExamMode(false);
    navigate(`/exam-loading/${roomId}`);
  }, [roomContent, selectedContentIds, additionalResources, numQuestions, questionType, examLength, roomId, navigate]);

  const handleExamCancel = useCallback(() => {
    setIsExamMode(false);
  }, []);

  // Memoize setters for stable references
  const stableSetters = useMemo(() => ({
    setIsChatOpen,
    setIsExamMode,
    setAdditionalResources,
    setNumQuestions,
    setExamLength,
    setQuestionType,
  }), []);

  return {
    roomId,
    currentRoom,
    roomContent,
    roomsLoading,
    contentLoading,
    isChatOpen,
    ...stableSetters,
    isExamMode,
    examStep,
    selectedContentIds,
    additionalResources,
    numQuestions,
    examLength,
    questionType,
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
