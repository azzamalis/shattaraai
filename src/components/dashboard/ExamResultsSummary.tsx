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
  exam_id: string | null;
  exams: {
    title: string;
    total_questions: number;
    content_metadata: Record<string, unknown> | null;
  } | null;
}

interface ContentData {
  id: string;
  title: string;
  chapters: {
    id: string;
    title: string;
    startTime: number;
    endTime: number;
  }[] | null;
}

export function ExamResultsSummary() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [examAttempt, setExamAttempt] = useState<ExamAttemptData | null>(null);
  const [chapterBreakdown, setChapterBreakdown] = useState<ChapterData[]>([]);
  const [contentTitle, setContentTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  const roomId = localStorage.getItem('currentRoomId') || '';

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);

        const storedAttemptId = localStorage.getItem('currentExamAttemptId');
        if (!storedAttemptId && !contentId) {
          console.error('No exam attempt ID found');
          return;
        }
        const attemptId = storedAttemptId || contentId;

        // Fetch exam attempt data with exam details
        const { data: attemptData, error } = await supabase
          .from('exam_attempts')
          .select(`
            *,
            exams (
              title,
              total_questions,
              content_metadata
            )
          `)
          .eq('id', attemptId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching exam attempt:', error);
          return;
        }

        if (attemptData) {
          setExamAttempt(attemptData as unknown as ExamAttemptData);

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
            score: Math.round(percentage * 10) / 10,
            skipped: attemptData.skipped_questions || 0,
            timeTaken: formatTime(attemptData.time_taken_minutes || 0),
            totalQuestions: attemptData.exams?.total_questions || attemptData.max_score || 0,
            correctAnswers: attemptData.total_score || 0,
          };
          setExamData(processedExamData);

          // Fetch chapter breakdown data
          await fetchChapterBreakdown(attemptId, attemptData as unknown as ExamAttemptData);
        }
      } catch (error) {
        console.error('Error processing exam results:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChapterBreakdown = async (attemptId: string, attemptData: ExamAttemptData) => {
      try {
        // Fetch exam answers with question details
        const { data: answersData, error: answersError } = await supabase
          .from('exam_answers')
          .select(`
            id,
            is_correct,
            question_id,
            exam_questions (
              id,
              reference_source,
              reference_time
            )
          `)
          .eq('exam_attempt_id', attemptId);

        if (answersError) {
          console.error('Error fetching exam answers:', answersError);
          return;
        }

        // Get content IDs from exam metadata
        const contentMetadata = attemptData.exams?.content_metadata as { contentIds?: string[]; config?: { selectedTopics?: string[] } } | null;
        const contentIds = contentMetadata?.contentIds || [];
        const selectedTopics = contentMetadata?.config?.selectedTopics || [];

        // Fetch content data for chapters
        let contentData: ContentData[] = [];
        if (contentIds.length > 0) {
          const { data: contents, error: contentError } = await supabase
            .from('content')
            .select('id, title, chapters')
            .in('id', contentIds);

          if (!contentError && contents) {
            contentData = contents as ContentData[];
          }
        }

        // Set content title from first content or selected topics
        if (contentData.length > 0) {
          setContentTitle(contentData[0].title);
        } else if (selectedTopics.length > 0) {
          setContentTitle(selectedTopics[0]);
        }

        // Group answers by reference_source to create chapter breakdown
        const chapterMap = new Map<string, { correct: number; total: number; timeRange: string }>();

        if (answersData) {
          answersData.forEach((answer: any) => {
            const question = answer.exam_questions;
            if (!question) return;

            const source = question.reference_source || 'General Questions';
            const time = question.reference_time || '';

            if (!chapterMap.has(source)) {
              chapterMap.set(source, { correct: 0, total: 0, timeRange: time });
            }

            const chapter = chapterMap.get(source)!;
            chapter.total += 1;
            if (answer.is_correct) {
              chapter.correct += 1;
            }
          });
        }

        // If we have content chapters, try to match them
        const allChapters = contentData.flatMap(c => c.chapters || []);
        
        // Convert map to array for ChapterBreakdown
        const breakdown: ChapterData[] = [];
        
        if (chapterMap.size > 0) {
          chapterMap.forEach((stats, source) => {
            // Try to find matching content chapter for page range
            const matchingChapter = allChapters.find(ch => 
              source.toLowerCase().includes(ch.title.toLowerCase()) ||
              ch.title.toLowerCase().includes(source.toLowerCase().split(' ').slice(0, 3).join(' '))
            );

            let timeRange = stats.timeRange;
            if (matchingChapter) {
              // Convert times to page numbers (approximate)
              const startPage = Math.floor(matchingChapter.startTime / 60) + 1;
              const endPage = Math.floor(matchingChapter.endTime / 60) + 1;
              timeRange = `Page ${startPage} - ${endPage}`;
            } else if (timeRange && !timeRange.includes('Page')) {
              // Format time reference as page if it's just a number
              const timeNum = parseInt(timeRange.replace(/\D/g, ''));
              if (!isNaN(timeNum)) {
                timeRange = `Page ${timeNum}`;
              }
            }

            breakdown.push({
              title: source,
              timeRange: timeRange || 'N/A',
              correct: stats.correct,
              total: stats.total,
            });
          });
        } else if (allChapters.length > 0) {
          // Fallback: distribute questions across chapters if no reference_source
          const totalQuestions = attemptData.max_score || 0;
          const questionsPerChapter = Math.ceil(totalQuestions / allChapters.length);
          
          allChapters.forEach((chapter, index) => {
            const startPage = Math.floor(chapter.startTime / 60) + 1;
            const endPage = Math.floor(chapter.endTime / 60) + 1;
            
            breakdown.push({
              title: chapter.title,
              timeRange: `Page ${startPage} - ${endPage}`,
              correct: 0,
              total: questionsPerChapter,
            });
          });
        }

        setChapterBreakdown(breakdown);
      } catch (error) {
        console.error('Error fetching chapter breakdown:', error);
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
            <button className="flex h-10 w-28 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-center hover:text-primary hover:bg-primary/5 transition-all">
              <span className="text-muted-foreground">Exam 1</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
            </button>
          </div>

          {/* Right: Share Button */}
          <div className="flex items-center justify-end text-sm font-medium">
            <button onClick={handleShare} className="flex h-10 w-28 items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-center hover:text-primary hover:bg-primary/5 transition-all">
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
              {chapterBreakdown.length > 0 && (
                <ChapterBreakdown 
                  chapters={chapterBreakdown} 
                  examData={examData}
                  contentTitle={contentTitle}
                />
              )}

              {/* Middle Action Buttons */}
              <div className="flex flex-col justify-center gap-4 text-sm font-medium sm:flex-row">
                <button onClick={handleTryAgain} className="inline-flex h-11 w-28 items-center justify-center gap-x-2 overflow-visible whitespace-nowrap rounded-full border border-border px-4 text-sm font-medium hover:bg-accent transition-colors">
                  <RotateCcw className="h-4 w-4 flex-shrink-0" />
                  Try Again
                </button>
                <button onClick={handleRetake} className="inline-flex h-11 w-48 items-center justify-center gap-x-2 overflow-visible whitespace-nowrap rounded-full border border-border px-4 text-sm font-medium hover:bg-accent transition-colors">
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
            <button onClick={handleGoToSpace} className="flex h-12 w-full items-center justify-center rounded-full border border-border px-8 hover:text-primary hover:bg-primary/5 transition-all sm:w-96">Go to Room</button>
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