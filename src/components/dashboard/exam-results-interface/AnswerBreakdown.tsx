import React from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

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
}

export function AnswerBreakdown({ question, contentId }: AnswerBreakdownProps) {
  const getStatusConfig = () => {
    if (question.isSkipped) {
      return {
        icon: HelpCircle,
        bgColor: 'bg-muted',
        textColor: 'text-muted-foreground',
        borderColor: 'border-foreground-muted',
        label: 'Skipped'
      };
    }
    
    const isCorrect = question.type === 'multiple-choice' 
      ? question.userAnswer === question.correctAnswer
      : !question.feedback?.toLowerCase().startsWith('incorrect');
    
    if (isCorrect && question.type === 'multiple-choice') {
      return {
        icon: CheckCircle,
        bgColor: 'bg-green-500/10',
        textColor: 'text-green-600 dark:text-green-400',
        borderColor: 'border-green-500/10',
        label: 'Correct'
      };
    }
    
    return {
      icon: XCircle,
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
      borderColor: 'border-red-500/10',
      label: 'Incorrect'
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const renderMultipleChoiceOptions = () => {
    return (
      <div className="space-y-2">
        {question.options?.map((option, index) => {
          const isSelected = index === question.userAnswer;
          const isCorrectAnswer = index === question.correctAnswer;
          const isIncorrectSelection = isSelected && !isCorrectAnswer;
          
          let borderClass = 'border-[1.5px] hover:bg-accent/50';
          
          if (isIncorrectSelection) {
            borderClass = 'hover:bg-accent/50 border-[1.5px] border-red-500';
          } else if (isCorrectAnswer) {
            borderClass = 'hover:bg-accent/50 border-[1.5px] border-dashed border-green-500';
          } else if (isSelected && isCorrectAnswer) {
            borderClass = 'hover:bg-accent/50 border-[1.5px] border-green-500';
          }
          
          return (
            <button
              key={index}
              disabled
              className={`w-full rounded-2xl p-2.5 text-left text-primary/90 transition-all hover:text-primary flex items-start gap-2 cursor-default ${borderClass}`}
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
    );
  };

  const renderFreeTextAnswer = () => {
    if (question.isSkipped) {
      return (
        <div className="relative">
          <textarea
            className="flex max-h-[80px] bg-background p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 !max-h-[150px] min-h-[60px] w-full resize-none overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 px-4 py-3 text-base dark:border-neutral-700"
            placeholder="Question was skipped..."
            disabled
            value=""
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <textarea
          className="flex max-h-[80px] bg-background p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 !max-h-[150px] min-h-[60px] w-full resize-none overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 px-4 py-3 text-base dark:border-neutral-700"
          placeholder="Type your answer here..."
          disabled
          value={typeof question.userAnswer === 'string' ? question.userAnswer : ''}
        />
      </div>
    );
  };

  const renderExplanationBox = () => {
    const explanationText = question.type === 'multiple-choice' 
      ? question.explanation 
      : question.feedback;

    return (
      <div className={`mt-4 rounded-lg p-4 ${statusConfig.bgColor}`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className={`flex items-center gap-2 font-medium ${statusConfig.textColor}`}>
              <StatusIcon className="h-5 w-5" />
              {statusConfig.label}
            </h3>
          </div>
          
          {question.isSkipped && (
            <div className="mt-2 flex items-center gap-4">
              <div className={`text-base font-medium ${statusConfig.textColor}`}>
                Score: 0/4
              </div>
            </div>
          )}
          
          <div className={`mt-2 text-sm font-normal leading-relaxed ${statusConfig.textColor}`}>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <div className="space-y-4 text-sm leading-normal">
                <p className="text-base leading-7 last:mb-0">
                  {explanationText || 'Explanation not available for this question.'}
                </p>
              </div>
            </div>
            {question.referenceTime && question.referenceSource && (
              <span className="items-center">
                <span className={`inline-flex items-center border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-2 cursor-pointer space-x-2 rounded-sm text-xs font-medium ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}`}>
                  <span>{question.referenceTime}</span>:<span className="max-w-[10rem] truncate">{question.referenceSource}</span>
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {question.type === 'multiple-choice' ? renderMultipleChoiceOptions() : renderFreeTextAnswer()}
      {renderExplanationBox()}
    </>
  );
}
