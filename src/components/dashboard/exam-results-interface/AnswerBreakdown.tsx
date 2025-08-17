
import React from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const getStatusConfig = () => {
    if (question.isSkipped) {
      return {
        icon: HelpCircle,
        bgColor: 'bg-muted/50',
        borderColor: 'border-muted-foreground/30',
        textColor: 'text-muted-foreground',
        badgeVariant: 'secondary' as const,
        status: 'Skipped'
      };
    }
    
    const isCorrect = question.type === 'multiple-choice' 
      ? question.userAnswer === question.correctAnswer
      : true; // Free-text questions don't have a simple correct/incorrect
    
    if (isCorrect && question.type === 'multiple-choice') {
      return {
        icon: Check,
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        textColor: 'text-green-600',
        badgeVariant: 'default' as const,
        status: 'Correct'
      };
    }
    
    return {
      icon: X,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-600',
      badgeVariant: 'destructive' as const,
      status: 'Incorrect'
    };
  };

  const renderMultipleChoiceAnswer = () => {
    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    return (
      <div className="space-y-3">
        {question.options?.map((option, index) => {
          let borderColor = 'border-border';
          let bgColor = 'bg-card';
          
          if (index === question.correctAnswer) {
            borderColor = 'border-green-500/30';
            bgColor = 'bg-green-500/10';
          } else if (index === question.userAnswer && index !== question.correctAnswer) {
            borderColor = 'border-red-500/30';
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
        
        <div className={`mt-4 rounded-lg border p-4 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
          <div className={`mb-3 flex items-center gap-2 font-medium ${statusConfig.textColor}`}>
            <StatusIcon className="h-4 w-4" />
            {statusConfig.status}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {question.explanation || 'Explanation not available for this question.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <Badge variant={statusConfig.badgeVariant} className="text-xs">
              {question.referenceSource} - {question.referenceTime}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  const renderFreeTextAnswer = () => {
    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    if (question.isSkipped) {
      return (
        <div>
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="text-muted-foreground italic">Question was skipped</div>
          </div>
          <div className={`rounded-lg border p-4 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
            <div className={`mb-3 flex items-center gap-2 font-medium ${statusConfig.textColor}`}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig.status}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {question.feedback || 'Sample answer not available for this question.'}
            </p>
            {question.referenceTime && question.referenceSource && (
              <Badge variant={statusConfig.badgeVariant} className="text-xs">
                {question.referenceSource} - {question.referenceTime}
              </Badge>
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
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <div className="mb-3 flex items-center gap-2 font-medium text-green-600">
            <Check className="h-4 w-4" />
            AI Feedback
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            {question.feedback || 'Good effort! This type of question requires detailed explanation of the concepts involved.'}
          </p>
          {question.referenceTime && question.referenceSource && (
            <Badge variant="default" className="text-xs">
              {question.referenceSource} - {question.referenceTime}
            </Badge>
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
