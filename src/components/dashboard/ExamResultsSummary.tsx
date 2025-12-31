import React, { useState, useEffect } from 'react';
import { ChevronDown, Share2, X, RotateCcw, Repeat, BookCheck, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShareModal } from '@/components/dashboard/modals/share-modal';
import { CircularProgress } from './exam-results/CircularProgress';
import { ChapterBreakdown } from './exam-results/ChapterBreakdown';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  created_at: string;
  exams: {
    title: string;
    total_questions: number;
    content_metadata: Record<string, unknown> | null;
  } | null;
}

interface ExamAttemptListItem {
  id: string;
  total_score: number;
  max_score: number;
  status: string;
  created_at: string;
  exam_id: string | null;
  exams: {
    title: string;
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
  const [allExamAttempts, setAllExamAttempts] = useState<ExamAttemptListItem[]>([]);
  const [chapterBreakdown, setChapterBreakdown] = useState<ChapterData[]>([]);
  const [contentTitle, setContentTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { contentId } = useParams<{ contentId: string }>();

  const roomId = localStorage.getItem('currentRoomId') || '';

  // Fetch all exam attempts for the dropdown
  useEffect(() => {
    const fetchAllExamAttempts = async () => {
      try {
        const { data: attempts, error } = await supabase
          .from('exam_attempts')
          .select(`
            id,
            total_score,
            max_score,
            status,
            created_at,
            exam_id,
            exams (
              title
            )
          `)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching exam attempts:', error);
          return;
        }

        if (attempts) {
          setAllExamAttempts(attempts as unknown as ExamAttemptListItem[]);
        }
      } catch (error) {
        console.error('Error fetching all exam attempts:', error);
      }
    };

    fetchAllExamAttempts();
  }, []);

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
  const handleExamSelect = (attemptId: string) => {
    localStorage.setItem('currentExamAttemptId', attemptId);
    navigate(`/exam-summary/${attemptId}`);
    setDropdownOpen(false);
  };

  const formatAttemptDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttemptScore = (attempt: ExamAttemptListItem) => {
    if (attempt.max_score === 0) return 0;
    return Math.round((attempt.total_score / attempt.max_score) * 100);
  };
  return <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 w-full border-b bg-background/95 px-4 py-4 shadow-lg shadow-neutral-800/5 backdrop-blur-sm dark:border-b dark:border-border dark:shadow-white/5">
        <div className="relative mx-auto flex w-full items-center">
          {/* Left: Close Button */}
          <div className="flex w-20 flex-shrink-0 items-center gap-2 xl:w-40">
            <button 
              onClick={handleClose} 
              className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Exam Title Dropdown */}
          <div className="flex flex-1 items-center justify-center">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button 
                  className="flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                >
                  <span className="text-base font-medium text-neutral-600 dark:text-neutral-300">
                    {examAttempt?.exams?.title || 'Exam 1'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="z-50 w-72 max-h-80 overflow-y-auto bg-background border border-border shadow-lg"
              >
                {allExamAttempts.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No exam attempts found
                  </div>
                ) : (
                  allExamAttempts.map((attempt) => {
                    const isSelected = attempt.id === (contentId || localStorage.getItem('currentExamAttemptId'));
                    const score = getAttemptScore(attempt);
                    
                    return (
                      <DropdownMenuItem
                        key={attempt.id}
                        onClick={() => handleExamSelect(attempt.id)}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-accent focus:bg-accent"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium">
                            {attempt.exams?.title || 'Exam'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatAttemptDate(attempt.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            score >= 75 ? 'text-green-600 dark:text-green-400' :
                            score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {score}%
                          </span>
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right: Share Button */}
          <div className="flex w-20 flex-shrink-0 items-center justify-end gap-2 xl:w-40">
            <button 
              onClick={handleShare} 
              className="relative inline-flex h-10 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-primary/5 hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-primary/10 xl:px-4"
            >
              <Share2 className="inline h-4 w-4 scale-x-[-1] xl:hidden" aria-hidden="true" />
              <span className="hidden xl:inline">Share exam</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          {loading ? (
            <div className="flex justify-center pt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : examData ? (
            <>
              {/* Header Section */}
              <div className="mb-8 text-center">
                <h2 className="my-10 text-xl font-medium text-primary/80 dark:text-primary sm:my-12 sm:text-2xl">
                  You're doing well, keep it up!
                </h2>

                {/* Stats Row */}
                <div className="mb-8 flex items-center justify-center gap-x-12 sm:gap-x-24">
                  <div className="text-center">
                    <div className="text-xl font-medium sm:text-2xl">{examData.skipped}</div>
                    <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/80 sm:text-sm">Skipped</div>
                  </div>
                  <CircularProgress percentage={examData.score} />
                  <div className="text-center">
                    <div className="text-xl font-medium sm:text-2xl">{examData.timeTaken}</div>
                    <div className="text-xs text-muted-foreground/80 dark:text-muted-foreground/80 sm:text-sm">Time Taken</div>
                  </div>
                </div>
              </div>

              {/* Preview Link */}
              <div className="mb-8 flex justify-center">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 h-10 text-sm font-semibold text-primary/60 underline underline-offset-4 ring-offset-background transition-colors hover:underline hover:text-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-primary/60 dark:hover:text-primary">
                  Preview {examAttempt?.exams?.title || 'Exam 1'}
                </button>
              </div>

              {/* Chapter Breakdown */}
              <ChapterBreakdown 
                chapters={chapterBreakdown} 
                examData={examData}
                contentTitle={contentTitle || examAttempt?.exams?.title || 'Exam Content'}
              />

              {/* Action Buttons */}
              <div className="mb-24 flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
                <button 
                  onClick={handleTryAgain} 
                  className="inline-flex h-11 items-center justify-center gap-x-2 whitespace-nowrap rounded-full border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  data-state="closed"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Try Again
                </button>
                <button 
                  onClick={handleRetake} 
                  className="inline-flex h-11 items-center justify-center gap-x-2 whitespace-nowrap rounded-full border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                  data-state="closed"
                >
                  <Repeat className="h-4 w-4" aria-hidden="true" />
                  New-Question Retake
                </button>
              </div>
            </>
          ) : (
            <div className="text-center pt-8">
              <p className="text-muted-foreground">No exam results found.</p>
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-10 border-t border-border bg-background px-4 py-8 md:py-[clamp(1rem,2.5vh,2.5rem)]">
        <div className="mx-auto flex max-w-4xl justify-center gap-4">
          <div className="flex w-full justify-center gap-3">
            <button 
              onClick={handleGoToSpace} 
              className="inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-input bg-background px-8 text-base font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:w-96"
            >
              Go to Space
            </button>
            <button 
              onClick={handleCreateNew} 
              className="inline-flex h-12 w-full items-center justify-center gap-x-2 whitespace-nowrap rounded-full bg-primary px-8 text-base font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:w-96"
              data-state="closed"
            >
              <BookCheck className="h-4 w-4" aria-hidden="true" />
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