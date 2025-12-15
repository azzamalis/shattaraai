import React from 'react';
import { Button } from '@/components/ui/button';
import { MessagesSquare, BookCheck, X } from 'lucide-react';

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
      <button 
        onClick={onChatOpen} 
        className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg text-sm font-medium whitespace-nowrap border border-border text-primary/80 bg-background dark:bg-muted/50 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-colors hover:bg-transparent hover:text-primary hover:dark:border-border/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <MessagesSquare className="h-4 w-4" />
        <span>Room Chat</span>
      </button>
      
      <button 
        onClick={handleExamButtonClick} 
        className="flex items-center gap-2 px-3 py-2 h-10 rounded-lg text-sm font-medium whitespace-nowrap border border-border text-primary/80 bg-background dark:bg-muted/50 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-colors hover:bg-transparent hover:text-primary hover:dark:border-border/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        {isExamMode ? <>
            <X className="h-4 w-4" />
            <span>Close Exam</span>
          </> : <>
            <BookCheck className="h-4 w-4" />
            <span>Create Exam</span>
          </>}
      </button>
    </div>;
}
