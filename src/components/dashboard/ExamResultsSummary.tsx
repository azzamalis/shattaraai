import React, { useState, useEffect } from 'react';
import { ChevronDown, Share2, X, RotateCcw, Repeat, BookCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { CircularProgress } from './exam-results/CircularProgress';
import { ChapterBreakdown } from './exam-results/ChapterBreakdown';
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
  const {
    contentId
  } = useParams<{
    contentId: string;
  }>();

  // Get the room ID from localStorage or state management
  const roomId = localStorage.getItem('currentRoomId') || '';
  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);

        // First try to get the exam attempt ID from localStorage
        const storedAttemptId = localStorage.getItem('currentExamAttemptId');
        console.log('DEBUG: Stored attempt ID:', storedAttemptId);
        console.log('DEBUG: Content ID from URL:', contentId);
        if (!storedAttemptId && !contentId) {
          console.error('No exam attempt ID found');
          return;
        }
        const attemptId = storedAttemptId || contentId;
        console.log('DEBUG: Using attempt ID:', attemptId);

        // Fetch exam attempt data with exam details
        console.log('DEBUG: Querying exam_attempts table...');
        const {
          data: attemptData,
          error
        } = await supabase.from('exam_attempts').select(`
            *,
            exams (
              title,
              total_questions
            )
          `).eq('id', attemptId).maybeSingle();
        console.log('DEBUG: Query result:', {
          attemptData,
          error
        });
        if (error) {
          console.error('Error fetching exam attempt:', error);
          // Let's also try to fetch by exam_id if the attempt ID doesn't work
          console.log('DEBUG: Trying to fetch by exam_id...');
          const {
            data: examData
          } = await supabase.from('exams').select('id').eq('id', attemptId).maybeSingle();
          if (examData) {
            console.log('DEBUG: Found exam, now looking for attempts...');
            const {
              data: attempts
            } = await supabase.from('exam_attempts').select('*').eq('exam_id', examData.id).order('created_at', {
              ascending: false
            }).limit(1);
            console.log('DEBUG: Found attempts:', attempts);
          }
          return;
        }
        console.log('DEBUG: Attempt data found:', attemptData);
        if (attemptData) {
          setExamAttempt(attemptData);

          // Calculate percentage score
          const percentage = attemptData.max_score > 0 ? attemptData.total_score / attemptData.max_score * 100 : 0;

          // Format time taken
          const formatTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = Math.floor(minutes % 60);
            const secs = Math.floor(minutes % 1 * 60);
            if (hours > 0) {
              return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${mins}:${secs.toString().padStart(2, '0')}`;
          };
          const processedExamData: ExamData = {
            score: Math.round(percentage * 10) / 10,
            // Round to 1 decimal place
            skipped: attemptData.skipped_questions || 0,
            timeTaken: formatTime(attemptData.time_taken_minutes || 0),
            totalQuestions: attemptData.exams?.total_questions || attemptData.max_score || 0,
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
      state: {
        openExamModal: true
      }
    });
  };
  const handleClose = () => {
    // Return to the room where the exam started
    navigate(`/rooms/${roomId}`);
  };
  const handleShare = () => {
    setIsShareModalOpen(true);
  };
  const handleGoToSpace = () => {
    navigate(`/rooms/${roomId}`);
  };
  return <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 border-b-2 border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center p-4">
          {/* Left: Close Button */}
          <div className="flex items-center">
            <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Center: Exam Title Dropdown */}
          <div className="flex flex-grow items-center justify-center text-sm font-medium">
            <button className="flex h-10 w-28 items-center justify-center gap-2 rounded-xl border-2 border-border bg-card px-4 py-2 text-center hover:bg-accent">
              <span className="text-muted-foreground">Exam 1</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
            </button>
          </div>

          {/* Right: Share Button */}
          <div className="flex items-center justify-end text-sm font-medium">
            <button onClick={handleShare} className="flex h-10 w-28 items-center justify-center rounded-xl border-2 border-border bg-card px-4 py-2 text-center hover:bg-accent">
              Share exam
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-6">
        <div className="px-6 py-8">
          {loading ? <div className="flex justify-center pt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div> : examData ? <>
              {/* Title */}
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-medium text-foreground/80">
                  Keep up the momentum!
                </h2>

                {/* Stats Row */}
                <div className="mb-4 flex items-center justify-center gap-x-24">
                  <div>
                    <div className="text-2xl font-medium">{examData.skipped}</div>
                    <div className="text-sm text-muted-foreground/80">Skipped</div>
                  </div>
                  <div className="relative flex flex-col items-center justify-center">
                    <CircularProgress percentage={examData.score} />
                  </div>
                  <div>
                    <div className="text-2xl font-medium">{examData.timeTaken}</div>
                    <div className="text-sm text-muted-foreground/80">Time Taken</div>
                  </div>
                </div>
              </div>

              {/* Preview Link */}
              <div className="mb-6 flex justify-center text-sm font-semibold text-foreground/60">
              <button className="flex h-10 w-32 items-center justify-center rounded-xl px-4 py-2 text-center underline hover:text-foreground whitespace-nowrap">
                Preview {examAttempt?.exams?.title || 'Exam 1'}
              </button>
              </div>

              {/* Chapter Breakdown */}
              <ChapterBreakdown chapters={[{
              title: 'A Map and Its Components',
              timeRange: 'Page 3 - 5',
              correct: 1,
              total: 2
            }, {
              title: 'Understanding Coordinates',
              timeRange: 'Page 7 - 8',
              correct: 1,
              total: 6
            }, {
              title: 'Greenwich Meridian',
              timeRange: 'Page 11 - 14',
              correct: 0,
              total: 1
            }, {
              title: 'Understanding Time Zones',
              timeRange: 'Page 14 - 17',
              correct: 1,
              total: 2
            }, {
              title: 'Locating Places on the Earth',
              timeRange: 'Page 1 - 3',
              correct: 0,
              total: 1
            }]} examData={examData} />

              {/* Middle Action Buttons */}
              <div className="flex flex-col justify-center gap-4 text-sm font-medium sm:flex-row">
                <button onClick={handleTryAgain} className="inline-flex h-11 w-28 items-center justify-center gap-x-2 overflow-visible whitespace-nowrap rounded-full border-2 border-border px-4 text-sm font-medium hover:bg-accent transition-colors">
                  <RotateCcw className="h-4 w-4 flex-shrink-0" />
                  Try Again
                </button>
                <button onClick={handleRetake} className="inline-flex h-11 w-48 items-center justify-center gap-x-2 overflow-visible whitespace-nowrap rounded-full border-2 border-border px-4 text-sm font-medium hover:bg-accent transition-colors">
                  <Repeat className="h-4 w-4 flex-shrink-0" />
                  New-Question Retake
                </button>
              </div>
            </> : <div className="text-center pt-8">
              <p className="text-muted-foreground">No exam results found.</p>
            </div>}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-10 border-t-2 border-border bg-background px-4 py-10 font-medium">
        <div className="flex justify-center">
          <div className="flex w-full max-w-4xl flex-col justify-center gap-3 sm:flex-row">
            <button onClick={handleGoToSpace} className="flex h-12 w-full items-center justify-center rounded-full border-2 border-border px-8 hover:bg-accent sm:w-96">Go to Room</button>
            <button onClick={handleCreateNew} className="flex h-12 w-full items-center justify-center gap-x-2 rounded-full bg-foreground px-8 text-background hover:bg-foreground/90 sm:w-96">
              <BookCheck className="h-4 w-4" />
              Create Exam
            </button>
          </div>
        </div>
      </footer>

      {/* Share Modal */}
      <ShareModal open={isShareModalOpen} onOpenChange={setIsShareModalOpen} type="exam" itemToShare={{
      id: roomId,
      title: examAttempt?.exams?.title || 'Exam'
    }} />
    </div>;
}