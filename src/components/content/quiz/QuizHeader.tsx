import { ChevronLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface QuizHeaderProps {
  onBack: () => void;
  onSaveProgress?: () => void;
  onEndQuiz?: () => void;
  onReviewSettings?: () => void;
}

export const QuizHeader = ({
  onBack,
  onSaveProgress,
  onEndQuiz,
  onReviewSettings,
}: QuizHeaderProps) => {
  return (
    <div className="flex justify-between w-full px-2 py-2">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-primary items-center cursor-pointer text-sm font-medium justify-center py-1 px-3 h-9 rounded-xl"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-xl"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onSaveProgress && (
            <DropdownMenuItem onClick={onSaveProgress}>
              Save Progress
            </DropdownMenuItem>
          )}
          {onEndQuiz && (
            <DropdownMenuItem onClick={onEndQuiz}>
              End Quiz
            </DropdownMenuItem>
          )}
          {onReviewSettings && (
            <DropdownMenuItem onClick={onReviewSettings}>
              Review Settings
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
