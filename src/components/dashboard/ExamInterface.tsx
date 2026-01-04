import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionRenderer } from './exam/QuestionRenderer';
import { ExamHeader } from './exam/ExamHeader';
import { debounce, generateQuestions, Question, ExamConfig } from './exam/examUtils';

interface ExamInterfaceProps {
  examConfig: ExamConfig;
  generatedExam?: any;
  onSubmitExam: (questions: Question[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ examConfig, generatedExam, onSubmitExam }) => {
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set<number>());
  const [isSaving, setIsSaving] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState('');
  const navigate = useNavigate();
  const { contentId } = useParams();

  // Initialize exam start time and calculate remaining time
  const [timeRemaining, setTimeRemaining] = useState(() => {
    const examStartTimeKey = `examStartTime_${contentId}`;
    const savedStartTime = localStorage.getItem(examStartTimeKey);
    
    if (savedStartTime) {
      // Calculate elapsed time since exam started
      const startTime = parseInt(savedStartTime);
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const totalDurationSeconds = examConfig.duration * 60;
      const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);
      
      return remaining;
    } else {
      // First time starting exam - save start time
      const startTime = Date.now();
      localStorage.setItem(examStartTimeKey, startTime.toString());
      return examConfig.duration * 60;
    }
  });

  // Use generated questions if available, otherwise fall back to generated ones
  const questions = useMemo(() => {
    if (generatedExam?.questions) {
      // Transform AI-generated questions to match the expected format
      return generatedExam.questions.map((q: any, index: number) => ({
        id: index + 1,
        type: q.type === 'mcq' ? 'multiple-choice' : 'free-text',
        question: q.question,
        options: q.type === 'mcq' ? q.options?.map((opt: any) => opt.text) : undefined,
        correctAnswer: q.type === 'mcq' ? q.options?.findIndex((opt: any) => opt.isCorrect) : undefined,
        points: q.points || 5,
        timeEstimate: q.timeEstimate || 3,
        difficulty: q.difficulty || 'medium',
        topic: q.topic || 'General'
      }));
    }
    return generateQuestions(examConfig);
  }, [examConfig, generatedExam]);

  const totalCompletedQuestions = Object.keys(answers).length + skippedQuestions.size;
  const progressPercentage = Math.min((totalCompletedQuestions / questions.length) * 100, 100);

  const debouncedAutoSave = useCallback(
    debounce((questionId: number, value: string) => {
      setIsSaving(true);
      setSavingQuestionId(questionId);
      console.log(`Auto-saving question ${questionId}:`, value);
      setTimeout(() => {
        setIsSaving(false);
        setSavingQuestionId(null);
      }, 500);
    }, 1000),
    []
  );

  const handleFreeTextChange = (questionId: number, value: string) => {
    setAnswers(prev => ({...prev, [questionId]: value}));
    debouncedAutoSave(questionId, value);
  };

  const handleMultipleChoiceAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({...prev, [questionId]: answerIndex}));
  };

  const handleSkip = (questionId: number) => {
    setSkippedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleUndoSkip = (questionId: number) => {
    setSkippedQuestions(prev => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
  };

  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleSubmitExam = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionProgress('Preparing your exam results...');
      
      // Get exam start time to calculate duration
      const examStartTimeKey = `examStartTime_${contentId}`;
      const savedStartTime = localStorage.getItem(examStartTimeKey);
      const startTime = savedStartTime ? parseInt(savedStartTime) : Date.now();
      const endTime = Date.now();
      const timeTakenMinutes = Math.round((endTime - startTime) / (1000 * 60));
      
      // Calculate scores
      const correctAnswers = questions.filter((q) => 
        q.type === 'multiple-choice' && answers[q.id] === q.correctAnswer
      ).length;
      
      const totalScore = correctAnswers;
      const maxScore = questions.length;
      const skippedCount = skippedQuestions.size;
      
      console.log('DEBUG: Exam submission data:', {
        totalScore,
        maxScore,
        skippedCount,
        timeTakenMinutes,
        contentId
      });
      
      // Prepare exam data for evaluation
      const examData = {
        questions,
        answers,
        skippedQuestions: Array.from(skippedQuestions),
        score: {
          correct: correctAnswers,
          incorrect: questions.filter((q) => 
            q.type === 'multiple-choice' && answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer
          ).length,
          skipped: skippedCount,
          total: questions.length
        },
        originalContent: generatedExam?.originalContent || null
      };

      setSubmissionProgress(`Processing question 1 of ${questions.length}...`);
      
      const progressInterval = setInterval(() => {
        setSubmissionProgress(prev => {
          const match = prev.match(/Processing question (\d+) of (\d+)/);
          if (match) {
            const current = parseInt(match[1]);
            const total = parseInt(match[2]);
            if (current < total) {
              return `Processing question ${current + 1} of ${total}...`;
            }
          }
          return prev;
        });
      }, 1500);
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        setSubmissionProgress('Saving exam attempt...');
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Get exam ID from generatedExam (set during generation) or localStorage
        const examId = generatedExam?.examId || localStorage.getItem('currentExamId');
        
        console.log('DEBUG: Using examId:', examId);
        
        // Create exam attempt record with proper exam_id linkage
        const { data: attemptData, error: attemptError } = await supabase
          .from('exam_attempts')
          .insert({
            user_id: user.id,
            exam_id: examId || null,
            total_score: totalScore,
            max_score: maxScore,
            skipped_questions: skippedCount,
            time_taken_minutes: timeTakenMinutes,
            status: 'completed' as const,
            completed_at: new Date().toISOString(),
            started_at: new Date(startTime).toISOString()
          })
          .select()
          .single();
          
        if (attemptError) {
          console.error('Error creating exam attempt:', attemptError);
        } else {
          console.log('DEBUG: Exam attempt created:', attemptData);
          localStorage.setItem('currentExamAttemptId', attemptData.id);
          
          // Store individual answers in exam_answers table
          if (examId && generatedExam?.questions) {
            setSubmissionProgress('Saving individual answers...');
            
            // Fetch exam questions to get their IDs
            const { data: examQuestions, error: questionsError } = await supabase
              .from('exam_questions')
              .select('id, order_index')
              .eq('exam_id', examId)
              .order('order_index');
            
            if (!questionsError && examQuestions && examQuestions.length > 0) {
              const answersToInsert = examQuestions.map((eq) => {
                const questionIndex = eq.order_index;
                const localQuestion = questions[questionIndex - 1]; // order_index is 1-based
                const userAnswer = answers[localQuestion?.id];
                const isSkipped = skippedQuestions.has(localQuestion?.id);
                
                // Determine if answer is correct
                let isCorrect = false;
                if (!isSkipped && userAnswer !== undefined && localQuestion) {
                  if (localQuestion.type === 'multiple-choice') {
                    isCorrect = userAnswer === localQuestion.correctAnswer;
                  }
                }
                
                return {
                  exam_attempt_id: attemptData.id,
                  question_id: eq.id,
                  user_answer: isSkipped ? null : String(userAnswer ?? ''),
                  is_correct: isCorrect,
                  points_earned: isCorrect ? (localQuestion?.points || 1) : 0
                };
              });
              
              const { error: answersError } = await supabase
                .from('exam_answers')
                .insert(answersToInsert);
                
              if (answersError) {
                console.error('Error saving exam answers:', answersError);
              } else {
                console.log('DEBUG: Saved', answersToInsert.length, 'exam answers');
              }
            }
          }
        }
        
        setSubmissionProgress('Evaluating answers with AI...');
        
        const { data, error } = await supabase.functions.invoke('openai-evaluate-exam', {
          body: {
            questions: examData.questions,
            answers: examData.answers,
            originalContent: examData.originalContent
          }
        });

        clearInterval(progressInterval);

        if (error) {
          console.error('AI evaluation error:', error);
          throw new Error('AI evaluation failed');
        }

        if (data?.success && data?.evaluatedQuestions) {
          const evaluatedResults = {
            ...examData,
            questions: data.evaluatedQuestions,
            evaluated: true,
            examId: examId,
            attemptId: attemptData?.id
          };
          localStorage.setItem('examResults', JSON.stringify(evaluatedResults));
          setSubmissionProgress('Evaluation complete! Redirecting...');
        } else {
          throw new Error('AI evaluation returned invalid data');
        }

      } catch (aiError) {
        clearInterval(progressInterval);
        console.error('AI evaluation failed:', aiError);
        localStorage.setItem('examResults', JSON.stringify(examData));
        setSubmissionProgress('Preparing results...');
      }

      // Navigate using attemptId for proper database-backed results
      const attemptId = localStorage.getItem('currentExamAttemptId');
      localStorage.removeItem(`examStartTime_${contentId}`);
      navigate(`/exam-results/${attemptId || contentId}`);
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      // Fallback to basic results if anything fails
      const fallbackResults = {
        questions,
        answers,
        skippedQuestions: Array.from(skippedQuestions),
        score: {
          correct: 0,
          incorrect: 0,
          skipped: skippedQuestions.size,
          total: questions.length
        }
      };
      localStorage.setItem('examResults', JSON.stringify(fallbackResults));
      localStorage.removeItem(`examStartTime_${contentId}`);
      
      // Navigate to exam results page even on error
      navigate(`/exam-results/${contentId}`);
    } finally {
      setIsSubmitting(false);
      setSubmissionProgress('');
    }
  };

  const handleClose = () => {
    // Clear exam start time when closing
    localStorage.removeItem(`examStartTime_${contentId}`);
    navigate('/dashboard');
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <ExamHeader
        totalCompletedQuestions={totalCompletedQuestions}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        progressPercentage={progressPercentage}
        onClose={handleClose}
      />

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="mx-auto mt-16 w-full flex-grow px-4 pb-24 lg:w-3/5 2xl:w-1/2">
            <div className="flex flex-col gap-24">
              {questions.map(question => (
                <QuestionRenderer
                  key={question.id}
                  question={question}
                  isSkipped={skippedQuestions.has(question.id)}
                  isAnswered={answers.hasOwnProperty(question.id)}
                  answer={answers[question.id]}
                  isSaving={isSaving}
                  savingQuestionId={savingQuestionId}
                  onSkip={() => handleSkip(question.id)}
                  onUndoSkip={() => handleUndoSkip(question.id)}
                  onMultipleChoiceAnswer={(answerIndex) => handleMultipleChoiceAnswer(question.id, answerIndex)}
                  onFreeTextChange={(value) => handleFreeTextChange(question.id, value)}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </main>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 z-10">
        <div className="border-t-[1.5px] border-border bg-background px-4 py-8 md:py-[clamp(1rem,2.5vh,2.5rem)]">
          <div className="mx-auto flex max-w-4xl justify-center gap-4">
            <button 
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className={cn(
                "inline-flex items-center justify-center gap-3",
                "h-12 w-full rounded-full px-8 text-base font-medium md:w-96",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>{submissionProgress || 'Submitting...'}</span>
                </>
              ) : (
                'Submit Exam'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
