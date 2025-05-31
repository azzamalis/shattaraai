
import React from 'react';

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
}

export function AnswerBreakdown({ question }: AnswerBreakdownProps) {
  const renderMultipleChoiceAnswer = () => {
    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          let borderColor = 'border-border';
          let bgColor = 'bg-card';
          
          if (index === question.correctAnswer) {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-500/10';
          } else if (index === question.userAnswer && index !== question.correctAnswer) {
            borderColor = 'border-red-500';
            bgColor = 'bg-red-500/10';
          }

          return (
            <div
              key={index}
              className={`w-full rounded-lg border p-4 ${borderColor} ${bgColor}`}
            >
              <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
              {option}
            </div>
          );
        })}
        
        <div className={`mt-4 rounded-lg border p-4 ${
          question.userAnswer === question.correctAnswer 
            ? 'border-green-500 bg-green-500/10' 
            : 'border-red-500 bg-red-500/10'
        }`}>
          <div className={`mb-2 font-medium ${
            question.userAnswer === question.correctAnswer ? 'text-green-400' : 'text-red-400'
          }`}>
            {question.userAnswer === question.correctAnswer ? 'Correct' : 'Incorrect'}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.explanation || 'Explanation not available for this question.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <div className="mt-2 text-xs text-muted-foreground">
              Reference: {question.referenceTime} {question.referenceSource}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFreeTextAnswer = () => {
    if (question.isSkipped) {
      return (
        <div>
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground italic">Question was skipped</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 font-medium text-muted-foreground">Suggested Answer</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.feedback || 'Sample answer not available for this question.'}
            </p>
            {question.referenceTime && question.referenceSource && (
              <div className="mt-2 text-xs text-muted-foreground">
                Reference: {question.referenceTime} {question.referenceSource}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 text-sm text-muted-foreground">Your Answer:</div>
          <div className="text-foreground">{question.userAnswer || 'No answer provided'}</div>
        </div>
        <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
          <div className="mb-2 font-medium text-green-400">AI Feedback</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {question.feedback || 'Good effort! This type of question requires detailed explanation of the concepts involved.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <div className="mt-2 text-xs text-muted-foreground">
              Reference: {question.referenceTime} {question.referenceSource}
            </div>
          )}
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
