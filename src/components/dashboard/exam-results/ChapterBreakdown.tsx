
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <div className="rounded-lg border border-border bg-card">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 hover:bg-accent"
      >
        <div className="flex items-center gap-2 text-foreground">
          <ChevronDown className={cn("h-5 w-5 transition-transform", !isExpanded && "-rotate-90")} />
          <span>Black Holes Explained – From Birth to Death</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-border">
            <div 
              className="h-full bg-orange-500" 
              style={{ width: `${(examData.correctAnswers / examData.totalQuestions) * 100}%` }}
            />
          </div>
          <span className="text-sm text-foreground">{examData.correctAnswers}/{examData.totalQuestions}</span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border p-4">
          <div className="space-y-4">
            {chapters.map((chapter, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-foreground">{chapter.title}</div>
                  <div className="text-sm text-muted-foreground">{chapter.timeRange}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="rounded-md bg-yellow-400/10 px-3 py-1 text-sm text-yellow-400 hover:bg-yellow-400/20">
                    Review ↗
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {chapter.correct}/{chapter.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
