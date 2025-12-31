import React, { useEffect, useState } from 'react';
import { MessagesSquare, BookCheck, X, ChevronDown, Trash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
  created_at: string;
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
        .select('id, title, created_at')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

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

  const handleViewExamResults = (examId: string) => {
    navigate(`/exam-results/${examId}`);
  };

  const handleDeleteExam = async (e: React.MouseEvent, examId: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase.from('exams').delete().eq('id', examId);
      if (error) {
        toast.error('Failed to delete exam');
        return;
      }
      setExistingExams(prev => prev.filter(exam => exam.id !== examId));
      toast.success('Exam deleted successfully');
    } catch (err) {
      console.error('Error deleting exam:', err);
      toast.error('Failed to delete exam');
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
            <DropdownMenuContent align="end" className="w-48 space-y-1 rounded-2xl">
              {existingExams.map((exam, index) => (
                <DropdownMenuItem 
                  key={exam.id}
                  className="group flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer"
                  onClick={() => handleViewExamResults(exam.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Exam {index + 1}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteExam(e, exam.id)}
                    className="flex h-6 w-6 items-center justify-center rounded-sm p-0 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <Trash className="h-4 w-4 text-red-500" aria-hidden="true" />
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
