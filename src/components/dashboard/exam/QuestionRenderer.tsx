import React from 'react';
import { SkipForward, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
  points?: number;
  timeEstimate?: number;
  difficulty?: string;
  topic?: string;
}

interface QuestionRendererProps {
  question: Question;
  isSkipped: boolean;
  isAnswered: boolean;
  answer: any;
  isSaving: boolean;
  savingQuestionId: number | null;
  onSkip: () => void;
  onUndoSkip: () => void;
  onMultipleChoiceAnswer: (answerIndex: number) => void;
  onFreeTextChange: (value: string) => void;
}

export function QuestionRenderer({
  question,
  isSkipped,
  isAnswered,
  answer,
  isSaving,
  savingQuestionId,
  onSkip,
  onUndoSkip,
  onMultipleChoiceAnswer,
  onFreeTextChange
}: QuestionRendererProps) {
  if (isSkipped) {
    return (
      <div className="p-2">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="text-md flex flex-1 space-x-2 font-normal leading-relaxed">
            <span className="flex-shrink-0 text-muted-foreground">{question.id}.</span>
            <div className="flex-1">
              <p className="text-base leading-7 text-muted-foreground">{question.question}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center py-4">
          <button 
            onClick={onUndoSkip} 
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-lg",
              "h-10 px-4 py-2 text-sm font-medium",
              "bg-accent text-accent-foreground",
              "hover:bg-accent/80 transition-colors"
            )}
          >
            <Undo2 className="h-4 w-4" />
            <span>Undo Skip</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto rounded-lg" role="region" aria-roledescription="carousel">
      <div className="p-2">
        {/* Question Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="text-md flex flex-1 space-x-2 font-normal leading-relaxed">
            <span className="flex-shrink-0">{question.id}.</span>
            <div className="flex-1">
              <p className="text-base leading-7">{question.question}</p>
            </div>
          </div>
          
          <div className="items-end"></div>
          
          {/* Desktop Skip Button */}
          <div className="hidden sm:block">
            <button 
              onClick={onSkip}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-lg",
                "text-sm font-medium ring-offset-background transition-colors",
                "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                "hover:bg-accent hover:text-accent-foreground",
                "h-10 px-4 py-2 space-x-2 text-muted-foreground"
              )}
            >
              <SkipForward className="h-4 w-4" />
              <span>Skip</span>
            </button>
          </div>
        </div>

        {/* Multiple Choice Options */}
        {question.type === 'multiple-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => onMultipleChoiceAnswer(index)}
                className={cn(
                  "w-full rounded-2xl p-2.5 text-left transition-all",
                  "flex items-start gap-2 border-[1.5px]",
                  "text-primary/90 hover:text-primary hover:bg-accent/50",
                  answer === index
                    ? "border-primary bg-primary/10"
                    : "border-border"
                )}
              >
                <span className="ml-1 pt-1 text-sm font-semibold text-muted-foreground">
                  {String.fromCharCode(65 + index)}.
                </span>
                <p className="text-base leading-7 flex-1">{option}</p>
              </button>
            ))}
          </div>
        )}

        {/* Free Text Answer */}
        {question.type === 'free-text' && (
          <div className="relative">
            <textarea
              value={answer || ''}
              onChange={(e) => onFreeTextChange(e.target.value)}
              placeholder="Type your answer here..."
              className={cn(
                "min-h-[60px] max-h-[150px] w-full resize-none overflow-hidden",
                "rounded-2xl border-[1.5px] border-neutral-200 dark:border-neutral-700",
                "bg-background px-4 py-3 text-base",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none"
              )}
            />
            {isSaving && savingQuestionId === question.id && (
              <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                <span className="animate-pulse">Saving...</span>
              </div>
            )}
          </div>
        )}

        {/* Mobile Skip Button */}
        <div className="mt-2 block text-left sm:hidden">
          <button 
            onClick={onSkip}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-lg",
              "text-sm font-medium ring-offset-background transition-colors",
              "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
              "hover:bg-accent hover:text-accent-foreground",
              "h-10 py-2 space-x-2 px-0 text-muted-foreground underline"
            )}
          >
            <span>Skip Question?</span>
          </button>
        </div>
      </div>
    </div>
  );
}
