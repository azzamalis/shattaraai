import { RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizActionButtonsProps {
  onUndo: () => void;
  onCheck: () => void;
  onDontKnow: () => void;
  canUndo: boolean;
  hasAnswer: boolean;
}

export const QuizActionButtons = ({
  onUndo,
  onCheck,
  onDontKnow,
  canUndo,
  hasAnswer,
}: QuizActionButtonsProps) => {
  return (
    <div className="px-2 mt-3">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onUndo}
            disabled={!canUndo}
            className="w-10 h-10 border-2 border-border rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onCheck}
            disabled={!hasAnswer}
            className="w-10 h-10 border-2 border-border rounded-xl"
          >
            <Check className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex ml-2 text-sm font-medium">
          <Button
            variant="outline"
            onClick={onDontKnow}
            className="w-28 h-10 border-2 border-border rounded-xl"
          >
            Don't know
          </Button>
        </div>
      </div>
    </div>
  );
};
