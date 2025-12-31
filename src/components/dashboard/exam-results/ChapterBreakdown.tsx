import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, AlignLeft, BarChart3 } from 'lucide-react';
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
  contentTitle?: string;
}

export function ChapterBreakdown({ chapters, examData, contentTitle }: ChapterBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

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

  const getPerformanceTextColor = (correct: number, total: number) => {
    if (total === 0) return 'text-muted-foreground';
    const percentage = (correct / total) * 100;
    if (percentage >= 75) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Find max total for chart scaling
  const maxTotal = Math.max(...chapters.map(c => c.total), 1);

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border p-6 pb-2 dark:bg-neutral-950/20 md:max-w-[900px] md:mx-auto">
      <div className="flex flex-col gap-6">
        <div className="border-b last:border-b-0 last:mb-0">
          {/* Header with toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex flex-1 cursor-pointer items-center justify-between p-0 font-medium transition-all"
              >
                <span className="flex items-center gap-2 text-base font-medium">
                  <AlignLeft className="h-4 w-4 text-neutral-800 dark:text-neutral-200 block group-hover:hidden flex-shrink-0" />
                  <ChevronDown className={cn(
                    "h-4 w-4 text-neutral-400 dark:text-neutral-500 hidden group-hover:block transition-transform duration-200 flex-shrink-0",
                    isExpanded && "rotate-180"
                  )} />
                  <span className="text-base truncate max-w-[130px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
                    {displayTitle}
                  </span>
                </span>
              </button>
            </h3>
            
            {/* View mode toggle and overall progress */}
            <div className="flex items-center gap-4">
              {chapters.length > 1 && (
                <button
                  onClick={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  title={viewMode === 'list' ? 'Show chart view' : 'Show list view'}
                >
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <div className="relative w-16 sm:w-24 md:w-32 overflow-hidden rounded-full bg-primary/5 dark:bg-primary/10 h-3.5">
                <div 
                  className="h-full flex-1 transition-all bg-orange-500"
                  style={{ width: `${(examData.correctAnswers / examData.totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{examData.correctAnswers}/{examData.totalQuestions}</span>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="flex flex-col overflow-hidden text-sm sm:pl-3 animate-in fade-in duration-300 gap-4 space-y-1">
              {viewMode === 'list' ? (
                // List View
                <div className="flex flex-col gap-4 pb-4 pl-3">
                  {chapters.length > 0 ? (
                    chapters.map((chapter, index) => {
                      const percentage = chapter.total > 0 ? (chapter.correct / chapter.total) * 100 : 0;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-foreground">
                            <span className="overflow-hidden text-ellipsis line-clamp-1 max-w-[200px] sm:max-w-[350px]">{chapter.title}</span>
                            <span className="text-foreground">•</span>
                            <span className="text-muted-foreground/80 whitespace-nowrap">{chapter.timeRange}</span>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <button className="flex h-6 w-auto items-center justify-center rounded-xl border-2 border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-500 hover:bg-yellow-500/20 gap-1.5">
                              Review
                              <ArrowUpRight className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            </button>
                            <span className={cn("font-medium whitespace-nowrap", getPerformanceTextColor(chapter.correct, chapter.total))}>
                              {chapter.correct}/{chapter.total}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground text-sm py-2">
                      No detailed chapter breakdown available for this exam.
                    </div>
                  )}
                </div>
              ) : (
                // Chart View
                <div className="flex flex-col gap-3 pb-4 pl-3">
                  {chapters.length > 0 ? (
                    chapters.map((chapter, index) => {
                      const percentage = chapter.total > 0 ? (chapter.correct / chapter.total) * 100 : 0;
                      const barWidth = (chapter.total / maxTotal) * 100;
                      
                      return (
                        <div key={index} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                              {chapter.title}
                            </span>
                            <span className={cn("text-sm font-medium", getPerformanceTextColor(chapter.correct, chapter.total))}>
                              {Math.round(percentage)}%
                            </span>
                          </div>
                          <div className="relative h-6 rounded-md bg-muted/50 overflow-hidden" style={{ width: `${barWidth}%`, minWidth: '60px' }}>
                            <div 
                              className={cn("h-full rounded-md transition-all duration-500", getPerformanceColor(chapter.correct, chapter.total))}
                              style={{ width: `${percentage}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-2">
                              <span className="text-xs font-medium text-white drop-shadow-sm">
                                {chapter.correct}/{chapter.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground text-sm py-2">
                      No detailed chapter breakdown available for this exam.
                    </div>
                  )}
                  
                  {/* Legend */}
                  {chapters.length > 0 && (
                    <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                        <span>≥75%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-yellow-500" />
                        <span>50-74%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-red-500" />
                        <span>&lt;50%</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
