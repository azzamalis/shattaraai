
import React, { memo, useMemo, useCallback } from 'react';
import { CircleHelp, CircleCheck, CircleX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
  userAnswer?: number | string;
  explanation?: string;
  feedback?: string;
  referenceTime?: string;
  referenceSource?: string;
  isSkipped?: boolean;
}

interface AnswerBreakdownProps {
  question: Question;
  contentId?: string;
  onAskChat?: (questionId: number) => void;
}

const AnswerBreakdownComponent = ({ question, contentId, onAskChat }: AnswerBreakdownProps) => {
  // Memoize the status configuration to avoid recalculation on every render
  const statusConfig = useMemo(() => {
    if (question.isSkipped) {
      return {
        icon: CircleHelp,
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        badgeClassName: 'bg-muted border-foreground-muted text-muted-foreground',
        status: 'Skipped',
        showScore: true
      };
    }
    
    const isCorrect = question.type === 'multiple-choice' 
      ? question.userAnswer === question.correctAnswer
      : !question.feedback?.toLowerCase().startsWith('incorrect');
    
    if (isCorrect && question.type === 'multiple-choice') {
      return {
        icon: CircleCheck,
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-600 dark:text-green-400',
        badgeClassName: 'bg-green-500/10 border-green-500/10 text-green-600 dark:text-green-400',
        status: 'Correct',
        showScore: false
      };
    }
    
    return {
      icon: CircleX,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
      badgeClassName: 'bg-red-500/10 border-red-500/10 text-red-600 dark:text-red-400',
      status: 'Incorrect',
      showScore: false
    };
  }, [question.isSkipped, question.type, question.userAnswer, question.correctAnswer, question.feedback]);

  // Memoize the ask chat handler
  const handleAskChat = useCallback(() => {
    onAskChat?.(question.id);
  }, [onAskChat, question.id]);
  // Memoize cleaned feedback text
  const cleanFeedbackText = useMemo(() => {
    const text = question.type === 'multiple-choice' ? question.explanation : question.feedback;
    return text 
      ? text.replace(/^(INCORRECT|CORRECT|SKIPPED):\s*/i, '')
      : 'Explanation not available for this question.';
  }, [question.type, question.explanation, question.feedback]);

  // Memoize question header to prevent re-renders
  const questionHeader = useMemo(() => (
    <div className="mb-2 flex items-start justify-between gap-2">
      <div className="text-md flex flex-1 space-x-2 font-normal leading-relaxed">
        <span className="flex-shrink-0">{question.id}.</span>
        <div className="flex-1">
          <div className="markdown-body prose prose-neutral dark:prose-invert max-w-none">
            <div className="space-y-4">
              <p className="text-base leading-7 last:mb-0">{question.question}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="items-end">
        <button 
          onClick={handleAskChat}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-lg px-3 gap-x-2"
        >
          <span>Ask chat</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  ), [question.id, question.question, handleAskChat]);

  // Memoize feedback box
  const feedbackBox = useMemo(() => {
    const StatusIcon = statusConfig.icon;
    
    return (
      <div className={`mt-6 rounded-xl p-5 ${statusConfig.bgColor}`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className={`flex items-center gap-2 text-lg font-medium ${statusConfig.textColor}`}>
              <StatusIcon className="h-5 w-5" aria-hidden="true" />
              {statusConfig.status}
            </h3>
            {statusConfig.showScore && (
              <span className="text-sm font-medium text-muted-foreground">Score: 0/4</span>
            )}
          </div>
          <div className={`font-normal leading-relaxed text-muted-foreground`}>
            <div className="markdown-body prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-3">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm leading-6 last:mb-0 m-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm leading-6">{children}</li>
                    ),
                  }}
                >
                  {cleanFeedbackText}
                </ReactMarkdown>
              </div>
            </div>
            {question.referenceTime && question.referenceSource && (
              <span className="items-center">
                {contentId ? (
                  <Link to={`/content/${contentId}`}>
                    <span className={`inline-flex items-center border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-2 cursor-pointer space-x-2 rounded-sm text-xs font-medium ${statusConfig.badgeClassName}`}>
                      <span>{question.referenceTime}</span>
                      :
                      <span className="max-w-[10rem] truncate">{question.referenceSource}</span>
                    </span>
                  </Link>
                ) : (
                  <span className={`inline-flex items-center border px-2.5 py-0.5 transition-colors mt-2 space-x-2 rounded-sm text-xs font-medium ${statusConfig.badgeClassName}`}>
                    <span>{question.referenceTime}</span>
                    :
                    <span className="max-w-[10rem] truncate">{question.referenceSource}</span>
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }, [statusConfig, cleanFeedbackText, question.referenceTime, question.referenceSource, contentId]);

  if (question.type === 'multiple-choice') {
    return (
      <div className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
        <div className="p-2">
          {questionHeader}
          
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const isUserAnswer = index === question.userAnswer;
              const isCorrectAnswer = index === question.correctAnswer;
              const isWrongSelection = isUserAnswer && !isCorrectAnswer;
              
              let borderClass = 'border-[1.5px]';
              
              if (isCorrectAnswer && !isUserAnswer) {
                borderClass = 'border-[1.5px] border-dashed border-green-500';
              } else if (isCorrectAnswer && isUserAnswer) {
                borderClass = 'border-[1.5px] border-green-500';
              } else if (isWrongSelection) {
                borderClass = 'border-[1.5px] border-red-500';
              }

              return (
                <button
                  key={index}
                  disabled
                  className={`w-full rounded-2xl p-2.5 text-left text-primary/90 transition-all flex items-start gap-2 cursor-default ${borderClass}`}
                >
                  <span className="ml-1 pt-1 text-sm font-semibold text-muted-foreground">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="space-y-4 flex-1">
                      <p className="text-base leading-7 last:mb-0">{option}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          {feedbackBox}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
      <div className="p-2">
        {questionHeader}
        
        <div className="relative">
          <textarea
            className="flex max-h-[150px] min-h-[60px] w-full resize-none overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700"
            placeholder="Type your answer here..."
            disabled
            value={question.isSkipped ? '' : (question.userAnswer as string || '')}
          />
        </div>
        
        {feedbackBox}
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const AnswerBreakdown = memo(AnswerBreakdownComponent);
