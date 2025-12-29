
import React from 'react';
import { CircleHelp, CircleCheck, CircleX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export function AnswerBreakdown({ question, contentId, onAskChat }: AnswerBreakdownProps) {
  const getStatusConfig = () => {
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
  };

  const renderQuestionHeader = () => (
    <div className="mb-2 flex items-start justify-between gap-2">
      <div className="text-md flex flex-1 space-x-2 font-normal leading-relaxed">
        <span className="flex-shrink-0">{question.id}.</span>
        <div className="flex-1">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-base leading-7 last:mb-0">{question.question}</p>
          </div>
        </div>
      </div>
      <div className="items-end">
        <button 
          onClick={() => onAskChat?.(question.id)}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-lg px-3 gap-x-2"
        >
          <span>Ask chat</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const renderFeedbackBox = (statusConfig: ReturnType<typeof getStatusConfig>, feedbackText?: string) => {
    const StatusIcon = statusConfig.icon;
    
    return (
      <div className={`mt-4 rounded-lg p-4 ${statusConfig.bgColor}`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className={`flex items-center gap-2 font-medium ${statusConfig.textColor}`}>
              <StatusIcon className="h-5 w-5" />
              {statusConfig.status}
            </h3>
          </div>
          {statusConfig.showScore && (
            <div className="mt-2 flex items-center gap-4">
              <div className="text-base font-medium text-muted-foreground">Score: 0/4</div>
            </div>
          )}
          <div className={`mt-2 text-sm font-normal leading-relaxed ${statusConfig.textColor}`}>
            <div className="markdown-body prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-4 text-sm leading-normal">
                <p className="text-base leading-7 last:mb-0">
                  {feedbackText || 'Explanation not available for this question.'}
                </p>
              </div>
            </div>
            {question.referenceTime && question.referenceSource && (
              <span className="items-center">
                {contentId ? (
                  <Link to={`/content/${contentId}`}>
                    <span className={`inline-flex items-center border px-2.5 py-0.5 transition-colors mt-2 cursor-pointer space-x-2 rounded-sm text-xs font-medium ${statusConfig.badgeClassName}`}>
                      <span>Page {question.referenceTime}</span>
                      <span>:</span>
                      <span className="max-w-[10rem] truncate">{question.referenceSource}</span>
                    </span>
                  </Link>
                ) : (
                  <span className={`inline-flex items-center border px-2.5 py-0.5 transition-colors mt-2 space-x-2 rounded-sm text-xs font-medium ${statusConfig.badgeClassName}`}>
                    <span>Page {question.referenceTime}</span>
                    <span>:</span>
                    <span className="max-w-[10rem] truncate">{question.referenceSource}</span>
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMultipleChoiceAnswer = () => {
    const statusConfig = getStatusConfig();

    return (
      <div className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
        <div className="p-2">
          {renderQuestionHeader()}
          
          <div className="space-y-2">
            {question.options?.map((option, index) => {
              const isUserAnswer = index === question.userAnswer;
              const isCorrectAnswer = index === question.correctAnswer;
              const isWrongSelection = isUserAnswer && !isCorrectAnswer;
              
              let borderClass = 'border-[1.5px]';
              
              if (isCorrectAnswer && !isUserAnswer) {
                // Correct answer that user didn't select - show dashed green border
                borderClass = 'border-[1.5px] border-dashed border-green-500';
              } else if (isCorrectAnswer && isUserAnswer) {
                // Correct answer that user selected - solid green border
                borderClass = 'border-[1.5px] border-green-500';
              } else if (isWrongSelection) {
                // Wrong answer that user selected - solid red border
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
          
          {renderFeedbackBox(statusConfig, question.explanation)}
        </div>
      </div>
    );
  };

  const renderFreeTextAnswer = () => {
    const statusConfig = getStatusConfig();

    return (
      <div className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
        <div className="p-2">
          {renderQuestionHeader()}
          
          <div className="relative">
            <textarea
              className="flex max-h-[150px] min-h-[60px] w-full resize-none overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 bg-background px-4 py-3 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700"
              placeholder="Type your answer here..."
              disabled
              value={question.isSkipped ? '' : (question.userAnswer as string || '')}
            />
          </div>
          
          {renderFeedbackBox(statusConfig, question.feedback)}
        </div>
      </div>
    );
  };

  if (question.type === 'multiple-choice') {
    return renderMultipleChoiceAnswer();
  } else {
    return renderFreeTextAnswer();
  }
}
