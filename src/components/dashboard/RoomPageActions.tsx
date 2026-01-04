import React, { useEffect, useState } from "react";
import { MessagesSquare, BookCheck, X, ChevronDown, Trash, Plus, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface RoomPageActionsProps {
  onChatOpen: () => void;
  onExamModalOpen: () => void;
  onExamModalClose?: () => void;
  roomId?: string;
  isExamMode?: boolean;
  onAddContent?: () => void;
  isAddContentActive?: boolean;
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
  isExamMode = false,
  onAddContent,
  isAddContentActive = false,
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
        .from("exams")
        .select("id, title, created_at")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setExistingExams(data);
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
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
      const { error } = await supabase.from("exams").delete().eq("id", examId);
      if (error) {
        toast.error("Failed to delete exam");
        return;
      }
      setExistingExams((prev) => prev.filter((exam) => exam.id !== examId));
      toast.success("Exam deleted successfully");
    } catch (err) {
      console.error("Error deleting exam:", err);
      toast.error("Failed to delete exam");
    }
  };

  const hasExistingExams = existingExams.length > 0;

  const buttonBaseClasses =
    "flex items-center gap-2 px-3 py-2 h-10 text-sm font-medium whitespace-nowrap border border-border text-primary/80 bg-background dark:bg-muted/50 shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-colors hover:bg-transparent hover:text-primary hover:dark:border-border/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  const ExamButton = () => {
    if (isExamMode) {
      return (
        <button onClick={handleExamButtonClick} className={`${buttonBaseClasses} rounded-lg`}>
          <X className="h-4 w-4" />
          <span className="hidden sm:inline">Close Exam</span>
        </button>
      );
    }

    if (hasExistingExams) {
      return (
        <div className="flex flex-shrink-0 items-center">
          <button onClick={handleExamButtonClick} className={`${buttonBaseClasses} rounded-l-full rounded-r-none`}>
            <BookCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Create Exam</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`${buttonBaseClasses} rounded-l-none rounded-r-full border-l-0 px-2`}>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 space-y-1 rounded-2xl">
              {existingExams.map((exam) => {
                const formattedDate = new Date(exam.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const displayTitle = exam.title || 'Untitled Exam';
                
                return (
                  <DropdownMenuItem
                    key={exam.id}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer"
                    onClick={() => handleViewExamResults(exam.id)}
                  >
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="text-sm font-medium text-foreground truncate">{displayTitle}</span>
                      <span className="text-xs text-muted-foreground">{formattedDate}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteExam(e, exam.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-sm p-0 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 sm:opacity-0 sm:group-hover:opacity-100 ml-2 shrink-0"
                    >
                      <Trash className="h-4 w-4 text-red-500" aria-hidden="true" />
                    </button>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <button onClick={handleExamButtonClick} className={`${buttonBaseClasses} rounded-lg`}>
        <BookCheck className="h-4 w-4" />
        <span className="hidden sm:inline">Create Exam</span>
      </button>
    );
  };

  return (
    <div className="flex flex-shrink-0 flex-col gap-2 xl:gap-0">
      {/* Desktop layout - horizontal */}
      <div className="hidden xl:flex flex-row flex-wrap justify-start gap-3">
        <button onClick={onChatOpen} className={`${buttonBaseClasses} rounded-lg`}>
          <MessageCircle className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Room Chat</span>
        </button>

        <ExamButton />

        <Button
          onClick={onAddContent}
          variant={isAddContentActive ? "default" : "default"}
          className={`gap-1.5 rounded-xl px-3 ${isAddContentActive ? "bg-primary/90" : ""}`}
        >
          {isAddContentActive ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{isAddContentActive ? "Close" : "Add Content"}</span>
        </Button>
      </div>

      {/* Mobile layout - reversed order so Add Content appears first visually */}
      <div className="flex xl:hidden flex-row-reverse flex-wrap justify-end gap-3">
        <Button
          onClick={onAddContent}
          variant={isAddContentActive ? "default" : "default"}
          className={`gap-1.5 rounded-xl px-3 ${isAddContentActive ? "bg-primary/90" : ""}`}
        >
          {isAddContentActive ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span>{isAddContentActive ? "Close" : "Add Content"}</span>
        </Button>

        <button onClick={onChatOpen} className={`${buttonBaseClasses} rounded-lg`}>
          <MessageCircle className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Room Chat</span>
        </button>

        <ExamButton />
      </div>
    </div>
  );
}
