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
      
      // Prepare basic exam data
      const examData = {
        questions,
        answers,
        skippedQuestions: Array.from(skippedQuestions),
        score: {
          correct: questions.filter((q) => 
            q.type === 'multiple-choice' && answers[q.id] === q.correctAnswer
          ).length,
          incorrect: questions.filter((q) => 
            q.type === 'multiple-choice' && answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer
          ).length,
          skipped: skippedQuestions.size,
          total: questions.length
        },
        originalContent: generatedExam?.originalContent || null
      };

      // Start AI evaluation
      setSubmissionProgress('AI is evaluating your answers...');
      
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        const { data, error } = await supabase.functions.invoke('openai-evaluate-exam', {
          body: {
            questions: examData.questions,
            answers: examData.answers,
            originalContent: examData.originalContent
          }
        });

        if (error) {
          console.error('AI evaluation error:', error);
          throw new Error('AI evaluation failed');
        }

        if (data?.success && data?.evaluatedQuestions) {
          // Save evaluated results
          const evaluatedResults = {
            ...examData,
            questions: data.evaluatedQuestions,
            evaluated: true
          };
          localStorage.setItem('examResults', JSON.stringify(evaluatedResults));
          setSubmissionProgress('Evaluation complete! Redirecting...');
        } else {
          throw new Error('AI evaluation returned invalid data');
        }

      } catch (aiError) {
        console.error('AI evaluation failed:', aiError);
        // Fall back to basic results if AI evaluation fails
        localStorage.setItem('examResults', JSON.stringify(examData));
        setSubmissionProgress('Preparing results...');
      }

      // Navigate to results page and clean up exam start time
      localStorage.removeItem(`examStartTime_${contentId}`);
      navigate(`/exam-results/${contentId || 'default'}`);
      
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
      navigate(`/exam-results/${contentId || 'default'}`);
    } finally {
      setIsSubmitting(false);
      setSubmissionProgress('');
    }
  };

  return (
    <div className="h-full bg-background text-foreground">
      <ExamHeader
        totalCompletedQuestions={totalCompletedQuestions}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        progressPercentage={progressPercentage}
      />

      <main className="pb-0">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-6 py-8">
            <div className="mx-auto max-w-4xl">
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
              
              <div className="mt-12 relative">
                <div className="absolute inset-0 -bottom-8 bg-background" />
                <button 
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className={cn(
                    "relative z-10",
                    "w-full rounded-lg py-4 px-8 text-lg font-medium",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center justify-center gap-3"
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
        </ScrollArea>
      </main>
    </div>
  );
};

export default ExamInterface;
