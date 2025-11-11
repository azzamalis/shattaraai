import { RotateCcw, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizActionButtonsProps {
  onUndo: () => void;
  onCheck: () => void;
  onNext: () => void;
  onDontKnow: () => void;
  canUndo: boolean;
  hasAnswer: boolean;
  isShortAnswer?: boolean;
  isChecked?: boolean;
  showDontKnow?: boolean;
}

export const QuizActionButtons = ({
  onUndo,
  onCheck,
  onNext,
  onDontKnow,
  canUndo,
  hasAnswer,
  isShortAnswer = false,
  isChecked = false,
  showDontKnow = false,
}: QuizActionButtonsProps) => {
  const showFeedback = isChecked || showDontKnow;

  return (
    <div className="px-2 mt-3">
      <div className="flex justify-between items-center gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo || showFeedback}
            className="w-10 h-10 border-2 border-border rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {!showFeedback ? (
            <Button
              variant="outline"
              size="icon"
              onClick={onCheck}
              disabled={!hasAnswer}
              className="w-10 h-10 border-2 border-border rounded-xl"
            >
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={onNext}
              className="w-10 h-10 rounded-xl"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 text-sm font-medium">
          {!showFeedback && (
            <Button
              variant="outline"
              onClick={onDontKnow}
              className="w-28 h-10 border-2 border-border rounded-xl"
            >
              Don't know
            </Button>
          )}
          
          {isShortAnswer && !showFeedback && (
            <Button
              onClick={onCheck}
              disabled={!hasAnswer}
              className="w-20 h-10 rounded-xl"
            >
              Submit
            </Button>
          )}
          
          {showFeedback && (
            <Button
              onClick={onNext}
              className="w-28 h-10 rounded-xl"
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
