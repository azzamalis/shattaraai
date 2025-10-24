import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QuizHeader } from './quiz/QuizHeader';
import { QuizProgressBar } from './quiz/QuizProgressBar';
import { MultipleChoiceQuestion } from './quiz/MultipleChoiceQuestion';
import { TrueFalseQuestion } from './quiz/TrueFalseQuestion';
import { ShortAnswerQuestion } from './quiz/ShortAnswerQuestion';
import { QuizActionButtons } from './quiz/QuizActionButtons';
import { AssistanceButton } from './quiz/AssistanceButton';
import { QuizChatInterface } from './quiz/QuizChatInterface';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  hint?: string;
}

interface QuizResults {
  quizId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  skippedQuestions: number;
  timeSpent: number;
  answers: Record<string, any>;
}

interface QuizTakingComponentProps {
  quizId: string;
  quizData: {
    id: string;
    title: string;
    questions: Question[];
    config: any;
  };
  onBack: () => void;
  onComplete: (results: QuizResults) => void;
}

export const QuizTakingComponent = ({
  quizId,
  quizData,
  onBack,
  onComplete,
}: QuizTakingComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const handleSelectAnswer = (answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleCheck = () => {
    if (!currentAnswer) {
      toast.error('Please select an answer first');
      return;
    }

    // Move to next question or complete quiz
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      toast.success('Answer recorded!');
    } else {
      handleCompleteQuiz();
    }
  };

  const handleUndo = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleDontKnow = () => {
    // Mark as skipped and move to next
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      toast.info('Question skipped');
    } else {
      handleCompleteQuiz();
    }
  };

  const handleFlag = () => {
    setFlagged((prev) => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(currentQuestion.id)) {
        newFlagged.delete(currentQuestion.id);
        toast.info('Question unflagged');
      } else {
        newFlagged.add(currentQuestion.id);
        toast.info('Question flagged for review');
      }
      return newFlagged;
    });
  };

  const handleCompleteQuiz = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const answeredQuestions = Object.keys(answers).length;
    const skippedQuestions = quizData.questions.length - answeredQuestions;

    const results: QuizResults = {
      quizId: quizData.id,
      totalQuestions: quizData.questions.length,
      answeredQuestions,
      correctAnswers: 0, // Would need to validate against correctAnswer
      skippedQuestions,
      timeSpent,
      answers,
    };

    onComplete(results);
  };

  const handleAssistanceClick = (type: 'hint' | 'walkthrough' | 'simple') => {
    // This will be handled by the chat interface
    toast.info(`Requesting ${type} assistance...`);
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion.question}
            options={currentQuestion.options || []}
            selectedAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        );
      case 'true-false':
        return (
          <TrueFalseQuestion
            question={currentQuestion.question}
            selectedAnswer={currentAnswer}
            onSelectAnswer={handleSelectAnswer}
          />
        );
      case 'short-answer':
        return (
          <ShortAnswerQuestion
            question={currentQuestion.question}
            answer={currentAnswer}
            onAnswerChange={handleSelectAnswer}
            onSubmit={handleCheck}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      {/* Fixed Header */}
      <div className="shrink-0">
        <QuizHeader
          onBack={onBack}
          onSaveProgress={() => toast.info('Progress saved')}
          onEndQuiz={handleCompleteQuiz}
        />
        <QuizProgressBar
          current={currentQuestionIndex + 1}
          total={quizData.questions.length}
        />
      </div>

      {/* Scrollable Question Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          {/* Question Section */}
          <div className="mb-6">
            {renderQuestion()}
          </div>

          {/* Action Buttons */}
          <QuizActionButtons
            onUndo={handleUndo}
            onCheck={handleCheck}
            onDontKnow={handleDontKnow}
            canUndo={currentQuestionIndex > 0}
            hasAnswer={!!currentAnswer}
          />
        </div>
      </ScrollArea>

      {/* Separator */}
      <Separator className="bg-border my-4" />

      {/* AI Assistance Section */}
      <div className="flex flex-col h-[400px] shrink-0">
        {/* Assistance Buttons */}
        <div className="px-4 pb-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <AssistanceButton type="hint" onClick={() => handleAssistanceClick('hint')} />
            <AssistanceButton
              type="walkthrough"
              onClick={() => handleAssistanceClick('walkthrough')}
            />
            <div className="hidden md:block">
              <AssistanceButton type="simple" onClick={() => handleAssistanceClick('simple')} />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 min-h-0">
          <QuizChatInterface
            quizId={quizId}
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={quizData.questions.length}
            userAnswer={currentAnswer}
          />
        </div>
      </div>
    </div>
  );
};
