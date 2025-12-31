import React from 'react';
import { ChevronDown, ChevronRight, Text } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ChapterData {
  title: string;
  timeRange: string;
  correct: number;
  total: number;
}

interface ExamData {
  score: number;
  skipped: number;
  timeTaken: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface ChapterBreakdownProps {
  chapters: ChapterData[];
  examData: ExamData;
  contentTitle?: string;
}

export function ChapterBreakdown({ chapters, examData, contentTitle }: ChapterBreakdownProps) {
  // Use content title or fallback
  const displayTitle = contentTitle || 'Content Overview';

  // Calculate performance color based on percentage
  const getPerformanceColor = (correct: number, total: number) => {
    if (total === 0) return 'bg-muted-foreground/20';
    const percentage = (correct / total) * 100;
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformancePercentage = (correct: number, total: number) => {
    if (total === 0) return 0;
    return (correct / total) * 100;
  };

  const isComplete = (correct: number, total: number) => {
    return total > 0 && correct === total;
  };

  const overallPercentage = examData.totalQuestions > 0 
    ? (examData.correctAnswers / examData.totalQuestions) * 100 
    : 0;

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-2xl border p-6 pb-2 dark:bg-neutral-950/20">
      <Accordion type="single" collapsible defaultValue="chapter-breakdown" className="flex flex-col gap-6">
        <AccordionItem value="chapter-breakdown" className="border-b last:mb-0 last:border-b-0">
          <AccordionTrigger className="group mb-4 flex cursor-pointer items-center justify-between p-0 font-medium transition-all [&[data-state=open]>svg]:rotate-[-90deg] hover:no-underline [&>svg:last-child]:hidden">
            <h3 className="flex items-center gap-2 text-base font-medium">
              <Text 
                className="block h-4 w-4 flex-shrink-0 text-neutral-800 group-hover:hidden dark:text-neutral-200" 
                aria-hidden="true" 
              />
              <ChevronDown 
                className="hidden h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200 group-hover:block group-data-[state=open]:rotate-180 dark:text-neutral-500" 
                aria-hidden="true" 
              />
              <span className="max-w-[130px] truncate text-sm sm:max-w-[250px] sm:text-base md:max-w-[300px] lg:max-w-[400px]">
                {displayTitle}
              </span>
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative h-3.5 w-16 overflow-hidden rounded-full bg-primary/5 dark:bg-primary/10 sm:w-24 md:w-32">
                <div 
                  className={cn("h-full flex-1 transition-all", getPerformanceColor(examData.correctAnswers, examData.totalQuestions))}
                  style={{ transform: `translateX(-${100 - overallPercentage}%)` }}
                />
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {examData.correctAnswers}/{examData.totalQuestions}
              </span>
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="flex flex-col gap-4 space-y-1 overflow-hidden text-sm duration-300 animate-in fade-in sm:pl-3">
            <div className="flex flex-col gap-4 space-y-1 pb-4 pt-0 duration-300 animate-in fade-in sm:pl-3">
              {chapters.length > 0 ? (
                chapters.map((chapter, index) => {
                  const complete = isComplete(chapter.correct, chapter.total);
                  
                  return (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                        <span className="max-w-[160px] truncate text-xs sm:max-w-[260px] sm:text-sm md:max-w-[280px] lg:max-w-[500px]">
                          {chapter.title}
                        </span>
                        <span className="hidden text-xs text-primary sm:text-sm md:block">•</span>
                        <span className="hidden text-xs text-muted-foreground/80 sm:text-sm md:block">
                          {chapter.timeRange}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                        {complete ? (
                          <button className="flex h-6 cursor-default items-center gap-2 justify-center whitespace-nowrap rounded-md bg-green-500/10 px-2 py-1 text-xs font-normal text-green-500 ring-offset-background transition-colors hover:bg-green-500/20 hover:text-primary/80 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                            <span>Complete</span>
                          </button>
                        ) : (
                          <button className="flex h-6 items-center gap-1 justify-center whitespace-nowrap rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-xs font-normal text-yellow-500 ring-offset-background transition-colors hover:bg-yellow-500/20 hover:text-yellow-600 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-yellow-500/30 dark:text-yellow-400">
                            Review
                            <ChevronRight className="h-3 w-3" aria-hidden="true" />
                          </button>
                        )}
                        <span className="font-medium text-neutral-600 dark:text-neutral-400">
                          {chapter.correct}/{chapter.total}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 text-sm text-muted-foreground">
                  No detailed chapter breakdown available for this exam.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
