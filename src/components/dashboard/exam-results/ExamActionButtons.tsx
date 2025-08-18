
import React from 'react';
import { RefreshCw, RotateCcw, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ExamActionButtonsProps {
  onTryAgain: () => void;
  onRetake: () => void;
  onCreateNew: () => void;
}

export function ExamActionButtons({ onTryAgain, onRetake, onCreateNew }: ExamActionButtonsProps) {
  return (
    <TooltipProvider>
      <div className="mt-8 flex justify-center gap-4 pb-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onTryAgain}
              className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo the exam, same questions, same order</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onRetake}
              className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
            >
              <RotateCcw className="h-5 w-5" />
              Retake Exam
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate a fresh set of questions on the same content</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button 
              onClick={onCreateNew}
              className="flex h-10 w-48 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Create New Exam
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pick new content to create an all-new exam</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
