import { useState } from 'react';
import { MoreVertical, Circle } from 'lucide-react';
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
    <div className="text-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-primary">My Quizzes</h3>
      </div>
      
      <div className="flex flex-col mb-4">
        <div
          className="cursor-pointer border-2 border-border rounded-2xl p-4"
          onClick={() => onStartQuiz(quiz.id)}
        >
          <div className="flex-grow">
            {/* Header with title and menu */}
            <div className="flex items-center justify-between gap-6 mb-3">
              <span className="text-primary font-medium text-ellipsis capitalize">
                {quiz.title}
              </span>
              <div className="flex items-center gap-1">
                <Circle className="text-muted w-5 h-5" fill="none" stroke="currentColor" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-xl"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditQuiz(quiz.id);
                      }}
                    >
                      Edit Quiz
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestartQuiz(quiz.id);
                      }}
                    >
                      Restart
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteQuiz(quiz.id);
                      }}
                      className="text-destructive"
                    >
                      Delete Quiz
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Topics and Progress */}
            <div>
              {/* Topic Pills */}
              <div className="flex items-center flex-wrap gap-1 text-xs mb-2">
                {displayTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="text-[#00A3FF] bg-[#00A3FF]/10 py-1 px-2 rounded-full"
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
                    className="text-muted items-center text-center flex h-6 p-1"
                  >
                    Show {remainingTopics} more topics
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between gap-3">
                <div className="bg-muted flex-grow rounded-full h-2">
                  <div
                    className={`${getProgressColor()} flex-grow opacity-80 rounded-full h-full transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-muted text-xs font-medium">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
