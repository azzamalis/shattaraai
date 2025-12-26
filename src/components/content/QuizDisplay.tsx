import { useState } from 'react';
import { MoreVertical, Circle, Settings2, RotateCcw, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface QuizDisplayProps {
  quiz: {
    id: string;
    title: string;
    questions: any;
    config: any;
    created_at: string;
  };
  onStartQuiz: (quizId: string) => void;
  onEditQuiz: (quizId: string) => void;
  onRestartQuiz: (quizId: string) => void;
  onDeleteQuiz: (quizId: string) => void;
}

export const QuizDisplay = ({
  quiz,
  onStartQuiz,
  onEditQuiz,
  onRestartQuiz,
  onDeleteQuiz,
}: QuizDisplayProps) => {
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Extract topics from quiz config or questions
  const topics = quiz.config?.topics || ['Selected All Topics'];
  const displayTopics = showAllTopics ? topics : topics.slice(0, 2);
  const remainingTopics = topics.length - 2;

  // Calculate progress (0% for now, can be enhanced with attempt data)
  const progress = 0;

  const getProgressColor = () => {
    if (progress <= 25) return 'bg-[#DE1135]';
    if (progress <= 50) return 'bg-[#F6BC2F]';
    return 'bg-[#0E8345]';
  };

  return (
    <div
      className="group cursor-pointer bg-transparent rounded-2xl border-2 border-border p-4 shadow-sm transition-all duration-200 hover:border-foreground/30 hover:bg-accent/30"
      onClick={() => onStartQuiz(quiz.id)}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Header with title */}
          <div className="flex min-w-0 items-center gap-2 text-base font-medium text-foreground">
            <span className="truncate capitalize">{quiz.title}</span>
          </div>
          
          {/* Topics */}
          <div className="flex flex-wrap items-center gap-1">
            {displayTopics.map((topic, index) => (
              <span
                key={index}
                className="text-[#00A3FF] bg-[#00A3FF]/10 py-0.5 px-2 rounded-full text-xs"
              >
                {topic}
              </span>
            ))}
            {!showAllTopics && remainingTopics > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTopics(true);
                }}
                className="text-muted-foreground hover:text-primary text-xs transition-colors"
              >
                +{remainingTopics} more
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3 pt-1">
            <div className="bg-muted flex-grow rounded-full h-2">
              <div
                className={`${getProgressColor()} rounded-full h-full transition-all`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs font-medium">{progress}%</span>
          </div>
        </div>
        
        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 flex-shrink-0 p-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEditQuiz(quiz.id);
              }}
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Edit Quiz
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRestartQuiz(quiz.id);
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDeleteQuiz(quiz.id);
              }}
              className="text-destructive"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
