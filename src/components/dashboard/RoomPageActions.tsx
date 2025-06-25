
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, GraduationCap } from 'lucide-react';

interface RoomPageActionsProps {
  onChatOpen: () => void;
  onExamModalOpen: () => void;
  onExamModalClose?: () => void;
  roomId?: string;
  isExamMode?: boolean;
}

export function RoomPageActions({ 
  onChatOpen, 
  onExamModalOpen, 
  onExamModalClose,
  roomId,
  isExamMode = false
}: RoomPageActionsProps) {
  const handleExamButtonClick = () => {
    if (isExamMode && onExamModalClose) {
      onExamModalClose();
    } else {
      onExamModalOpen();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onChatOpen}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-4 w-4" />
        Chat with AI
      </Button>
      
      <Button
        size="sm"
        onClick={handleExamButtonClick}
        className="flex items-center gap-2"
      >
        <GraduationCap className="h-4 w-4" />
        {isExamMode ? 'Close Exam' : 'Create Exam'}
      </Button>
    </div>
  );
}
