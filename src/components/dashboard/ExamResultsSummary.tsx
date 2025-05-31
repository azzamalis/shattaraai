
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Share2, X, RotateCcw, RefreshCw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ShareExamModal } from './ShareExamModal';

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

const examData: ExamData = {
  score: 25.0,
  skipped: 3,
  timeTaken: "23:47",
  totalQuestions: 12,
  correctAnswers: 3
};

const chapters: ChapterData[] = [
  { title: "Types and Sizes of Black Holes", timeRange: "03:38 - 04:04", correct: 0, total: 2 },
  { title: "Event Horizon and Singularity", timeRange: "01:38 - 02:12", correct: 1, total: 2 },
  { title: "Formation and Structure of Stars", timeRange: "00:00 - 01:10", correct: 0, total: 2 },
  { title: "Supernova and Black Hole Creation", timeRange: "01:10 - 01:38", correct: 1, total: 2 },
  { title: "Effects of Falling into a Black Hole", timeRange: "02:12 - 03:38", correct: 1, total: 2 },
  { title: "Hawking Radiation and Black Hole Evaporation", timeRange: "04:04 - 05:31", correct: 0, total: 2 }
];

const CircularProgress: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width="150" height="150">
        <circle
          className="stroke-border"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          className="stroke-orange-500 transition-all duration-700 ease-in-out"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percentage.toFixed(1)}%</span>
        <span className="text-sm text-muted-foreground">Score</span>
      </div>
    </div>
  );
};

export function ExamResultsSummary() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get the room ID from localStorage or state management
  const roomId = localStorage.getItem('currentRoomId') || '';

  const handleTryAgain = () => {
    // Keep the same exam config and navigate back to exam
    const examConfig = localStorage.getItem('examConfig');
    if (examConfig) {
      navigate('/exam');
    }
  };

  const handleRetake = () => {
    // Keep the same exam config but generate fresh questions
    const examConfig = localStorage.getItem('examConfig');
    if (examConfig) {
      // Clear only the results, keep the config
      localStorage.removeItem('examResults');
      navigate('/exam-loading');
    }
  };

  const handleCreateNew = () => {
    // Clear all exam data
    localStorage.removeItem('examConfig');
    localStorage.removeItem('examResults');
    
    // Return to room and trigger exam prep modal
    navigate(`/rooms/${roomId}`, { 
      state: { openExamModal: true } 
    });
  };

  const handleClose = () => {
    // Return to the room where the exam started
    navigate(`/rooms/${roomId}`);
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" textColor="text-foreground" />
        </div>
        <div className="flex items-center gap-2 text-foreground">
          <span>Exam 1</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm text-foreground hover:bg-accent/80"
          >
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          <button 
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 pt-24">
        {/* Title */}
        <h1 className="mb-12 text-center text-3xl font-bold text-foreground">
          Keep up the momentum!
        </h1>

        {/* Stats Row */}
        <div className="mb-8 flex items-center justify-center gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{examData.skipped}</div>
            <div className="text-sm text-muted-foreground">Skipped</div>
          </div>
          <CircularProgress percentage={examData.score} />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">{examData.timeTaken}</div>
            <div className="text-sm text-muted-foreground">Time Taken</div>
          </div>
        </div>

        {/* Preview Link */}
        <div className="mb-8 text-center">
          <button className="text-sm text-muted-foreground underline hover:text-foreground">
            Preview Exam 1
          </button>
        </div>

        {/* Content Breakdown */}
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

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4 pb-8">
          <button 
            onClick={handleTryAgain}
            className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          <button 
            onClick={handleRetake}
            className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-border text-foreground hover:bg-accent"
          >
            <RotateCcw className="h-5 w-5" />
            Retake Exam
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex h-10 w-48 items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Create New Exam
          </button>
        </div>
      </main>

      {/* Share Modal */}
      <ShareExamModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
}
