import React, { useState, useEffect } from 'react';
import { ChevronDown, Share2, X, RotateCcw, Repeat, BookCheck, Check, Trash } from 'lucide-react';
import { toast } from 'sonner';
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
        const idToUse = contentId || storedAttemptId;
        
        if (!idToUse) {
          console.error('No exam ID found');
          return;
        }

        // First try to fetch as exam_attempt
        let attemptData: ExamAttemptData | null = null;
        let examData: any = null;
        
        const { data: attemptResult, error: attemptError } = await supabase
          .from('exam_attempts')
          .select(`
            *,
            exams (
              title,
              total_questions,
              content_metadata
            )
          `)
          .eq('id', idToUse)
          .maybeSingle();

        if (attemptResult) {
          attemptData = attemptResult as unknown as ExamAttemptData;
          
          // If attempt has linked exam, use that
          if (attemptData.exams) {
            examData = attemptData.exams;
          }
        }
        
        // If no exam data yet, try to fetch directly from exams table (idToUse might be an exam ID)
        if (!examData) {
          const { data: directExamData, error: examError } = await supabase
            .from('exams')
            .select('id, title, total_questions, content_metadata')
            .eq('id', idToUse)
            .maybeSingle();
            
          if (directExamData) {
            examData = directExamData;
            
            // Also try to find the most recent attempt for this exam
            const { data: latestAttempt } = await supabase
              .from('exam_attempts')
              .select('*')
              .eq('exam_id', directExamData.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (latestAttempt) {
              attemptData = {
                ...latestAttempt,
                exams: examData
              } as unknown as ExamAttemptData;
            }
          }
        }

        // If we still have no data, try to get latest completed attempt for the user
        if (!attemptData && !examData) {
          const { data: latestUserAttempt } = await supabase
            .from('exam_attempts')
            .select(`
              *,
              exams (
                title,
                total_questions,
                content_metadata
              )
            `)
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (latestUserAttempt) {
            attemptData = latestUserAttempt as unknown as ExamAttemptData;
            examData = attemptData.exams;
          }
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
            score: Math.round(percentage * 10) / 10,
            skipped: attemptData.skipped_questions || 0,
            timeTaken: formatTime(attemptData.time_taken_minutes || 0),
            totalQuestions: examData?.total_questions || attemptData.max_score || 0,
            correctAnswers: attemptData.total_score || 0,
          };
          setExamData(processedExamData);

          // Fetch chapter breakdown data using exam data
          await fetchChapterBreakdown(attemptData.id, attemptData, examData);
        } else if (examData) {
          // We have exam but no attempt - show exam structure without scores
          setExamAttempt({
            id: examData.id,
            total_score: 0,
            max_score: examData.total_questions || 0,
            skipped_questions: 0,
            time_taken_minutes: 0,
            status: 'pending',
            exam_id: examData.id,
            created_at: new Date().toISOString(),
            exams: examData
          } as unknown as ExamAttemptData);
          
          setExamData({
            score: 0,
            skipped: 0,
            timeTaken: '0:00',
            totalQuestions: examData.total_questions || 0,
            correctAnswers: 0,
          });
          
          await fetchChapterBreakdown(idToUse, null, examData);
        }
      } catch (error) {
        console.error('Error processing exam results:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchChapterBreakdown = async (attemptId: string, attemptData: ExamAttemptData | null, examData: any) => {
      try {
        // Get content IDs from exam metadata
        const contentMetadata = examData?.content_metadata as { contentIds?: string[]; config?: { selectedTopics?: string[] } } | null;
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
        } else if (examData?.title) {
          setContentTitle(examData.title);
        }

        // Fetch exam questions with reference info
        const examId = examData?.id || attemptData?.exam_id;
        let questionsWithSources: any[] = [];
        
        if (examId) {
          const { data: questions, error: questionsError } = await supabase
            .from('exam_questions')
            .select('id, reference_source, reference_time, order_index')
            .eq('exam_id', examId)
            .order('order_index');
            
          if (!questionsError && questions) {
            questionsWithSources = questions;
          }
        }

        // Fetch exam answers if we have an attempt
        const answersMap = new Map<string, boolean>();
        if (attemptData?.id) {
          const { data: answersData, error: answersError } = await supabase
            .from('exam_answers')
            .select('question_id, is_correct')
            .eq('exam_attempt_id', attemptData.id);
            
          if (!answersError && answersData) {
            answersData.forEach((answer: any) => {
              answersMap.set(answer.question_id, answer.is_correct);
            });
          }
        }

        // Get all chapters from content
        const allChapters = contentData.flatMap(c => c.chapters || []);
        
        // Build chapter breakdown
        const breakdown: ChapterData[] = [];
        
        if (allChapters.length > 0 && questionsWithSources.length > 0) {
          // Map questions to chapters using reference_time or reference_source
          const chapterQuestionMap = new Map<string, { correct: number; total: number }>();
          
          // Initialize all chapters
          allChapters.forEach(chapter => {
            chapterQuestionMap.set(chapter.id, { correct: 0, total: 0 });
          });
          
          // Match questions to chapters
          questionsWithSources.forEach(question => {
            const refSource = question.reference_source || '';
            const refTime = question.reference_time || '';
            const isCorrect = answersMap.get(question.id) || false;
            
            // Try to match by time range first (for audio/video content)
            let matchedChapter = null;
            if (refTime) {
              const timeInSeconds = parseTimeToSeconds(refTime);
              matchedChapter = allChapters.find(ch => 
                timeInSeconds >= ch.startTime && timeInSeconds <= ch.endTime
              );
            }
            
            // If no time match, try to match by source text similarity
            if (!matchedChapter && refSource) {
              const normalizedSource = refSource.toLowerCase().trim();
              
              // Exact or partial title match
              matchedChapter = allChapters.find(ch => {
                const normalizedTitle = ch.title.toLowerCase().trim();
                return normalizedSource.includes(normalizedTitle) || 
                       normalizedTitle.includes(normalizedSource) ||
                       normalizedSource.split(':')[0].trim() === normalizedTitle ||
                       calculateSimilarity(normalizedSource, normalizedTitle) > 0.5;
              });
            }
            
            // Fallback: distribute based on question order
            if (!matchedChapter && allChapters.length > 0) {
              const questionIndex = questionsWithSources.indexOf(question);
              const chapterIndex = Math.floor((questionIndex / questionsWithSources.length) * allChapters.length);
              matchedChapter = allChapters[Math.min(chapterIndex, allChapters.length - 1)];
            }
            
            if (matchedChapter) {
              const stats = chapterQuestionMap.get(matchedChapter.id)!;
              stats.total += 1;
              if (isCorrect) stats.correct += 1;
            }
          });
          
          // Convert to breakdown array - only include chapters with questions
          allChapters.forEach(chapter => {
            const stats = chapterQuestionMap.get(chapter.id) || { correct: 0, total: 0 };
            if (stats.total > 0) {
              const formatTimeRange = (start: number, end: number) => {
                const formatSec = (s: number) => {
                  const mins = Math.floor(s / 60);
                  const secs = Math.floor(s % 60);
                  return `${mins}:${secs.toString().padStart(2, '0')}`;
                };
                return `${formatSec(start)} - ${formatSec(end)}`;
              };
              
              breakdown.push({
                title: chapter.title,
                timeRange: formatTimeRange(chapter.startTime, chapter.endTime),
                correct: stats.correct,
                total: stats.total,
              });
            }
          });
        } else if (questionsWithSources.length > 0) {
          // No chapters available - group by reference_source
          const sourceMap = new Map<string, { correct: number; total: number; time: string }>();
          
          questionsWithSources.forEach(question => {
            // Use reference_source or create a topic group
            let source = question.reference_source || '';
            if (!source) {
              source = 'General Questions';
            } else {
              // Clean up the source name - take first meaningful part
              source = source.split(':')[0].trim();
              if (source.length > 50) {
                source = source.substring(0, 47) + '...';
              }
            }
            
            const time = question.reference_time || '';
            const isCorrect = answersMap.get(question.id) || false;
            
            if (!sourceMap.has(source)) {
              sourceMap.set(source, { correct: 0, total: 0, time });
            }
            
            const stats = sourceMap.get(source)!;
            stats.total += 1;
            if (isCorrect) stats.correct += 1;
          });
          
          sourceMap.forEach((stats, source) => {
            breakdown.push({
              title: source,
              timeRange: stats.time || 'N/A',
              correct: stats.correct,
              total: stats.total,
            });
          });
        }

        setChapterBreakdown(breakdown);
      } catch (error) {
        console.error('Error fetching chapter breakdown:', error);
      }
    };
    
    // Helper: parse time string (e.g., "1:30" or "90") to seconds
    const parseTimeToSeconds = (time: string): number => {
      if (!time) return 0;
      const parts = time.split(':').map(Number);
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
      return parseInt(time, 10) || 0;
    };
    
    // Helper: calculate string similarity (Jaccard-like)
    const calculateSimilarity = (str1: string, str2: string): number => {
      const words1 = new Set(str1.split(/\s+/).filter(w => w.length > 2));
      const words2 = new Set(str2.split(/\s+/).filter(w => w.length > 2));
      const intersection = [...words1].filter(w => words2.has(w)).length;
      const union = new Set([...words1, ...words2]).size;
      return union > 0 ? intersection / union : 0;
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

  const handleDeleteExam = async (e: React.MouseEvent, attemptId: string) => {
    e.stopPropagation();
    
    try {
      // Delete exam answers first
      await supabase
        .from('exam_answers')
        .delete()
        .eq('exam_attempt_id', attemptId);
      
      // Delete the exam attempt
      const { error } = await supabase
        .from('exam_attempts')
        .delete()
        .eq('id', attemptId);

      if (error) {
        toast.error('Failed to delete exam');
        return;
      }

      // Update the local state
      setAllExamAttempts(prev => prev.filter(a => a.id !== attemptId));
      toast.success('Exam deleted successfully');

      // If the deleted exam is the current one, navigate to the next available
      const currentAttemptId = contentId || localStorage.getItem('currentExamAttemptId');
      if (attemptId === currentAttemptId) {
        const remaining = allExamAttempts.filter(a => a.id !== attemptId);
        if (remaining.length > 0) {
          handleExamSelect(remaining[0].id);
        } else {
          navigate(`/rooms/${roomId}`);
        }
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast.error('Failed to delete exam');
    }
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
                    {(() => {
                      // Sort by creation date ascending to get exam numbers
                      const sortedAttempts = [...allExamAttempts].sort(
                        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      );
                      const currentAttemptId = contentId || localStorage.getItem('currentExamAttemptId');
                      const examIndex = sortedAttempts.findIndex(a => a.id === currentAttemptId);
                      return examIndex >= 0 ? `Exam ${examIndex + 1}` : 'Exam 1';
                    })()}
                  </span>
                  <ChevronDown className="h-4 w-4 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="z-50 w-48 space-y-1 overflow-hidden rounded-2xl border bg-background p-1 text-popover-foreground shadow-md"
              >
                {allExamAttempts.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                    No exam attempts found
                  </div>
                ) : (
                  (() => {
                    // Sort by creation date ascending to assign exam numbers
                    const sortedAttempts = [...allExamAttempts].sort(
                      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    );
                    const currentAttemptId = contentId || localStorage.getItem('currentExamAttemptId');
                    
                    // Display in reverse order (newest first) but with correct numbering
                    return [...sortedAttempts].reverse().map((attempt) => {
                      const examNumber = sortedAttempts.findIndex(a => a.id === attempt.id) + 1;
                      const isSelected = attempt.id === currentAttemptId;
                      
                      return (
                        <DropdownMenuItem
                          key={attempt.id}
                          onClick={() => handleExamSelect(attempt.id)}
                          className={`group flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 ${
                            isSelected ? 'bg-primary/5 dark:bg-primary/10' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              Exam {examNumber}
                            </span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteExam(e, attempt.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-sm p-0 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <Trash className="h-4 w-4 text-red-500" aria-hidden="true" />
                          </button>
                        </DropdownMenuItem>
                      );
                    });
                  })()
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
                <button 
                  onClick={() => navigate(`/exam-results/${contentId}`)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 h-10 text-sm font-semibold text-primary/60 underline underline-offset-4 ring-offset-background transition-colors hover:underline hover:text-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:text-primary/60 dark:hover:text-primary"
                >
                  Preview Exam - {examAttempt?.exams?.title || 'Exam 1'}
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
              Go to Room
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