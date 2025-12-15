import React, { useEffect, useState } from 'react';
import { MessagesSquare, BookCheck, X, ChevronDown, Play, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RoomPageActionsProps {
  onChatOpen: () => void;
  onExamModalOpen: () => void;
  onExamModalClose?: () => void;
  roomId?: string;
  isExamMode?: boolean;
}

interface ExistingExam {
  id: string;
  title: string;
}

export function RoomPageActions({
  onChatOpen,
  onExamModalOpen,
  onExamModalClose,
  roomId,
  isExamMode = false
}: RoomPageActionsProps) {
  const navigate = useNavigate();
  const [existingExams, setExistingExams] = useState<ExistingExam[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchExistingExams();
    }
  }, [roomId]);

  const fetchExistingExams = async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('id, title')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setExistingExams(data);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExamButtonClick = () => {
    if (isExamMode && onExamModalClose) {
      onExamModalClose();
    } else {
      onExamModalOpen();
    }
  };

  const handleTakeExam = (examId: string) => {
    navigate(`/exam/${examId}`);
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      await supabase.from('exams').delete().eq('id', examId);
      setExistingExams(prev => prev.filter(exam => exam.id !== examId));
    } catch (err) {
      console.error('Error deleting exam:', err);
    }
  };

  const hasExistingExams = existingExams.length > 0;

  const buttonBaseClasses = "flex items-center gap-2 px-3 py-2 h-10 text-sm font-medium whitespace-nowrap border border-border text-primary/80 bg-background dark:bg-muted/50 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-colors hover:bg-transparent hover:text-primary hover:dark:border-border/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={onChatOpen} 
        className={`${buttonBaseClasses} rounded-lg`}
      >
        <MessagesSquare className="h-4 w-4" />
        <span>Room Chat</span>
      </button>
      
      {isExamMode ? (
        <button 
          onClick={handleExamButtonClick} 
          className={`${buttonBaseClasses} rounded-lg`}
        >
          <X className="h-4 w-4" />
          <span>Close Exam</span>
        </button>
      ) : hasExistingExams ? (
        <div className="flex flex-shrink-0 items-center">
          <button 
            onClick={handleExamButtonClick} 
            className={`${buttonBaseClasses} rounded-l-full rounded-r-none`}
          >
            <BookCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Create Exam</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`${buttonBaseClasses} rounded-l-none rounded-r-full border-l-0 px-2`}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border border-border z-50">
              {existingExams.map((exam) => (
                <DropdownMenuItem 
                  key={exam.id}
                  className="flex items-center justify-between gap-2 cursor-pointer"
                  onClick={() => handleTakeExam(exam.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Play className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{exam.title}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam.id);
                    }}
                    className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <button 
          onClick={handleExamButtonClick} 
          className={`${buttonBaseClasses} rounded-lg`}
        >
          <BookCheck className="h-4 w-4" />
          <span>Create Exam</span>
        </button>
      )}
    </div>
  );
}
