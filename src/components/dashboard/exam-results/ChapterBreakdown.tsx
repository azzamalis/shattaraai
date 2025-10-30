import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, AlignLeft } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col rounded-2xl border-2 border-border px-6 pb-2 pt-6 text-foreground">
      <div className="flex flex-col">
        <div>
          <h3 className="flex font-medium">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex h-6 w-full items-center justify-between overflow-visible"
            >
              <h3 className="flex items-center gap-2">
                {isHovered ? (
                  isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-foreground" />
                  )
                ) : (
                  <AlignLeft className="h-4 w-4 text-foreground" />
                )}
              <span className="text-sm sm:text-base truncate max-w-[130px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
                Social-NCERT-Chapter-1
              </span>
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full w-16 flex-grow bg-orange-500 sm:w-24 md:w-32"
                    style={{ width: `${(examData.correctAnswers / examData.totalQuestions) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">{examData.correctAnswers}/{examData.totalQuestions}</span>
              </div>
            </button>
          </h3>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="flex flex-col overflow-hidden text-sm sm:pl-3">
              <div className="flex flex-col gap-4 pb-4 pl-3 pt-4">
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
