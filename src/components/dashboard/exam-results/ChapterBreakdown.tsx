import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlignLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export function ChapterBreakdown({ chapters, examData }: ChapterBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border p-6 pb-2 dark:bg-neutral-950/20 md:max-w-[900px] md:mx-auto">
      <div className="flex flex-col gap-6">
        <div className="border-b last:border-b-0 last:mb-0">
          <h3 className="flex">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex flex-1 cursor-pointer items-center justify-between p-0 font-medium mb-4 transition-all"
            >
              <h3 className="flex items-center gap-2 text-base font-medium">
                <AlignLeft className="h-4 w-4 text-neutral-800 dark:text-neutral-200 block group-hover:hidden flex-shrink-0" />
                <ChevronDown className={cn(
                  "h-4 w-4 text-neutral-400 dark:text-neutral-500 hidden group-hover:block transition-transform duration-200 flex-shrink-0",
                  isExpanded && "rotate-180"
                )} />
                <span className="text-base truncate max-w-[130px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
                  Social-NCERT-Chapter-1
                </span>
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative w-16 sm:w-24 md:w-32 overflow-hidden rounded-full bg-primary/5 dark:bg-primary/10 h-3.5">
                  <div 
                    className="h-full flex-1 transition-all bg-orange-500"
                    style={{ width: `${(examData.correctAnswers / examData.totalQuestions) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{examData.correctAnswers}/{examData.totalQuestions}</span>
              </div>
            </button>
          </h3>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="flex flex-col overflow-hidden text-sm sm:pl-3 animate-in fade-in duration-300 gap-4 space-y-1">
              <div className="flex flex-col gap-4 pb-4 pl-3">
                {chapters.map((chapter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="overflow-hidden text-ellipsis">{chapter.title}</span>
                      <span className="text-foreground">•</span>
                      <span className="text-muted-foreground/80">{chapter.timeRange}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <button className="flex h-6 w-16 items-center justify-center rounded-xl border-2 border-yellow-500/20 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500 hover:bg-yellow-500/20">
                        Review
                        <ChevronRight className="h-3 w-3" />
                      </button>
                      <span className="font-medium text-muted-foreground">
                        {chapter.correct}/{chapter.total}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
