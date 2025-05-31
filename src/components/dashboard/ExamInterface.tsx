
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { QuestionRenderer } from './exam/QuestionRenderer';
import { ExamHeader } from './exam/ExamHeader';
import { debounce, generateQuestions, Question, ExamConfig } from './exam/examUtils';

interface ExamInterfaceProps {
  examConfig: ExamConfig;
  onSubmitExam: (questions: Question[], answers: {[key: number]: any}, skippedQuestions: Set<number>) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ examConfig, onSubmitExam }) => {
  const [answers, setAnswers] = useState<{[key: number]: any}>({});
  const [skippedQuestions, setSkippedQuestions] = useState(new Set<number>());
  const [timeRemaining, setTimeRemaining] = useState(examConfig.duration * 60);
  const [isSaving, setIsSaving] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);
  const navigate = useNavigate();

  const questions = useMemo(() => generateQuestions(examConfig), [examConfig]);

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

  const handleSubmitExam = () => {
    const examResults = {
      questions,
      answers,
      skippedQuestions: Array.from(skippedQuestions),
      score: {
        correct: questions.filter((q, index) => 
          answers[index] === q.correctAnswer
        ).length,
        incorrect: questions.filter((q, index) => 
          answers[index] !== undefined && answers[index] !== q.correctAnswer
        ).length,
        skipped: skippedQuestions.size,
        total: questions.length
      }
    };
    
    localStorage.setItem('examResults', JSON.stringify(examResults));
    navigate('/exam-results');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExamHeader
        totalCompletedQuestions={totalCompletedQuestions}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        progressPercentage={progressPercentage}
      />

      <main className="pb-12">
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
              
              <div className="mt-12">
                <button 
                  onClick={handleSubmitExam}
                  className={cn(
                    "w-full rounded-lg py-4 px-8 text-lg font-medium",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  Submit Exam
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
