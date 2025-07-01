import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, GraduationCap, X } from 'lucide-react';
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
  return <div className="flex items-center gap-3">
      <Button size="sm" onClick={onChatOpen} className="flex items-center gap-2 text-sm font-medium">
        <MessageCircle className="h-4 w-4" />
        Room Chat
      </Button>
      
      <Button size="sm" onClick={handleExamButtonClick} className="flex items-center gap-2 text-sm font-medium">
        {isExamMode ? <>
            <X className="h-4 w-4" />
            Close Exam
          </> : <>
            <GraduationCap className="h-4 w-4" />
            Create Exam
          </>}
      </Button>
    </div>;
}