import React from 'react';
import { SkipForward, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
interface Question {
  id: number;
  type: 'multiple-choice' | 'free-text';
  question: string;
  options?: string[];
  correctAnswer?: number;
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
    return <div className={cn("mb-8 rounded-lg p-6", "bg-card border-border")}>
        <div className="mb-2 text-lg font-medium">{question.id}.</div>
        <h2 className="mb-8 text-xl leading-relaxed text-muted-foreground">{question.question}</h2>
        <div className="flex justify-center">
          <button onClick={onUndoSkip} className="flex items-center gap-2 rounded-md bg-accent px-4 py-2 hover:bg-accent/80">
            <Undo2 className="h-4 w-4" />
            Undo Skip
          </button>
        </div>
      </div>;
  }
  return <div className={cn("mb-8 rounded-lg p-6", "bg-card border-border")}>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="mb-2 text-lg font-medium">{question.id}.</div>
          <h2 className="leading-relaxed font-medium text-lg">{question.question}</h2>
        </div>
        <button onClick={onSkip} className={cn("flex items-center gap-1 text-sm", "text-muted-foreground", "hover:text-foreground")}>
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
      </div>

      {question.type === 'multiple-choice' && question.options && <div className="space-y-3">
          {question.options.map((option: string, index: number) => <button key={index} onClick={() => onMultipleChoiceAnswer(index)} className={cn("w-full rounded-lg border p-4 text-left transition-colors", answer === index ? "border-primary bg-primary/10" : "border-border bg-card hover:border-muted-foreground/50")}>
              <span className="mr-3 font-medium">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>)}
        </div>}

      {question.type === 'free-text' && <div className="relative">
          <textarea value={answer || ''} onChange={e => onFreeTextChange(e.target.value)} placeholder="Type your answer here..." className={cn("min-h-32 w-full resize-none rounded-lg p-4", "border border-border", "bg-background", "text-foreground", "placeholder-muted-foreground", "focus:border-primary focus:ring-1 focus:ring-primary")} />
          {isSaving && savingQuestionId === question.id && <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              <span className="animate-pulse">Saving...</span>
            </div>}
        </div>}
    </div>;
}