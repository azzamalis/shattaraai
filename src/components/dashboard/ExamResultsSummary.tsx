import React, { useState, useEffect } from 'react';
import { ChevronRight, Share2, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { useNavigate, useParams } from 'react-router-dom';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { CircularProgress } from './exam-results/CircularProgress';
import { ChapterBreakdown } from './exam-results/ChapterBreakdown';
import { ExamActionButtons } from './exam-results/ExamActionButtons';
import { supabase } from '@/integrations/supabase/client';

interface ChapterData {
  title: string;
  timeRange: string;
  correct: number;
  total: number;
}

interface ExamData {
  score: number;
  skipped: number;
  timeTaken: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface ExamAttemptData {
  id: string;
  total_score: number;
  max_score: number;
  skipped_questions: number;
  time_taken_minutes: number;
  status: string;
  exams: {
    title: string;
    total_questions: number;
  };
}

export function ExamResultsSummary() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [examAttempt, setExamAttempt] = useState<ExamAttemptData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  // Get the room ID from localStorage or state management
  const roomId = localStorage.getItem('currentRoomId') || '';

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        
        // First try to get the exam attempt ID from localStorage
        const storedAttemptId = localStorage.getItem('currentExamAttemptId');
        if (!storedAttemptId && !contentId) {
          console.error('No exam attempt ID found');
          return;
        }

        // Fetch exam attempt data with exam details
        const { data: attemptData, error } = await supabase
          .from('exam_attempts')
          .select(`
            *,
            exams (
              title,
              total_questions
            )
          `)
          .eq('id', storedAttemptId || contentId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching exam attempt:', error);
          return;
        }

        if (attemptData) {
          setExamAttempt(attemptData);
          
          // Calculate percentage score
          const percentage = attemptData.max_score > 0 
            ? (attemptData.total_score / attemptData.max_score) * 100 
            : 0;
          
          // Format time taken
          const formatTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = Math.floor(minutes % 60);
            const secs = Math.floor((minutes % 1) * 60);
            
            if (hours > 0) {
              return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          };

          const processedExamData: ExamData = {
            score: Math.round(percentage * 10) / 10, // Round to 1 decimal place
            skipped: attemptData.skipped_questions || 0,
            timeTaken: formatTime(attemptData.time_taken_minutes || 0),
            totalQuestions: attemptData.exams?.total_questions || 0,
            correctAnswers: attemptData.total_score || 0
          };

          setExamData(processedExamData);
        }
      } catch (error) {
        console.error('Error processing exam results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [contentId]);

  const handleTryAgain = () => {
    // Keep the same exam config and navigate back to exam with the same data
    navigate(`/exam/${contentId}`);
  };

  const handleRetake = () => {
    // Keep the same exam config but generate fresh questions
    const examConfig = localStorage.getItem('examConfig');
    if (examConfig) {
      // Clear only the results, keep the config
      localStorage.removeItem('examResults');
      navigate(`/exam-loading/${roomId}`);
    }
  };

  const handleCreateNew = () => {
    // Clear all exam data
    localStorage.removeItem('examConfig');
    localStorage.removeItem('examResults');
    
    // Return to room and trigger exam prep modal
    navigate(`/rooms/${roomId}`, { 
      state: { openExamModal: true } 
    });
  };

  const handleClose = () => {
    // Return to the room where the exam started
    navigate(`/rooms/${roomId}`);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="h-full bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" textColor="text-foreground" />
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <span>{examAttempt?.exams?.title || 'Exam'}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-foreground hover:bg-accent/80"
          >
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content - Reduce top padding */}
      <main className="container mx-auto max-w-4xl px-6 pt-16">
        {loading ? (
          <div className="flex justify-center pt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : examData ? (
          <>
            {/* Title - Add 1rem top padding */}
            <h1 className="mb-4 pt-4 text-center text-3xl font-bold text-foreground">
              Keep up the momentum!
            </h1>

            {/* Stats Row - Reduce margin */}
            <div className="mb-4 flex items-center justify-center gap-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{examData.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
              <CircularProgress percentage={examData.score} />
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{examData.timeTaken}</div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </div>
            </div>

            {/* Preview Link - Reduce margin */}
            <div className="mb-4 text-center">
              <button className="text-sm text-muted-foreground underline hover:text-foreground">
                Preview {examAttempt?.exams?.title || 'Exam'}
              </button>
            </div>

            {/* Content Breakdown - Add padding adjustment */}
            <div className="pb-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Content Breakdown</h2>
                <div className="text-center text-muted-foreground">
                  <p>Detailed breakdown will be available soon.</p>
                  <p className="mt-2">
                    Score: {examData.correctAnswers} / {examData.totalQuestions} ({examData.score}%)
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center pt-8">
            <p className="text-muted-foreground">No exam results found.</p>
          </div>
        )}

        {/* Action Buttons - Ensure proper spacing */}
        <div className="mt-4">
          <ExamActionButtons
            onTryAgain={handleTryAgain}
            onRetake={handleRetake}
            onCreateNew={handleCreateNew}
          />
        </div>
      </main>

      {/* Share Modal */}
        <ShareModal
          open={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          type="exam"
          itemToShare={{
            id: roomId,
            title: examAttempt?.exams?.title || 'Exam',
          }}
        />
    </div>
  );
}
