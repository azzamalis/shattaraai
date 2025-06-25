
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';

interface RoomPageActionsProps {
  onChatOpen: () => void;
  onExamModalOpen: () => void;
  roomId?: string; // Add roomId prop
}

export const RoomPageActions: React.FC<RoomPageActionsProps> = ({
  onChatOpen,
  onExamModalOpen,
  roomId
}) => {
  return (
    <div className="flex items-center gap-4">
      <Button 
        className="bg-foreground hover:bg-foreground/90 text-background hover:text-background transition-all duration-200 hover:shadow-sm" 
        onClick={e => {
          e.stopPropagation();
          onChatOpen();
        }}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Room Chat
      </Button>
      <Button 
        className="bg-foreground hover:bg-foreground/90 text-background hover:text-background transition-all duration-200 hover:shadow-sm" 
        onClick={e => {
          e.stopPropagation();
          onExamModalOpen();
        }}
      >
        <FileText className="mr-2 h-4 w-4" />
        Create Exam
      </Button>
    </div>
  );
};
