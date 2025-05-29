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
          className="stroke-[#1F1F1F]"
          strokeWidth="8"
          fill="transparent"
          r={radius}
          cx="75"
          cy="75"
        />
        <circle
          className="stroke-[#F97316] transition-all duration-700 ease-in-out"
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
        <span className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</span>
        <span className="text-sm text-gray-400">Score</span>
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
    <div className="min-h-screen bg-[#121212]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" textColor="text-white" />
        </div>
        <div className="flex items-center gap-2 text-white">
          <span>Exam 1</span>
          <ChevronRight className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
          >
            <Share2 className="h-4 w-4" />
            Share exam
          </button>
          <button 
            onClick={handleClose}
            className="text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 pt-24">
        {/* Title */}
        <h1 className="mb-12 text-center text-3xl font-bold text-white">
          Keep up the momentum!
        </h1>

        {/* Stats Row */}
        <div className="mb-8 flex items-center justify-center gap-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{examData.skipped}</div>
            <div className="text-sm text-gray-400">Skipped</div>
          </div>
          <CircularProgress percentage={examData.score} />
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{examData.timeTaken}</div>
            <div className="text-sm text-gray-400">Time Taken</div>
          </div>
        </div>

        {/* Preview Link */}
        <div className="mb-8 text-center">
          <button className="text-sm text-gray-400 underline hover:text-gray-300">
            Preview Exam 1
          </button>
        </div>

        {/* Content Breakdown */}
        <div className="rounded-lg border border-white/10 bg-[#171717]/50">
          {/* Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between p-4 hover:bg-white/5"
          >
            <div className="flex items-center gap-2 text-white">
              <ChevronDown className={cn("h-5 w-5 transition-transform", !isExpanded && "-rotate-90")} />
              <span>Black Holes Explained – From Birth to Death</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-[#171717]">
                <div 
                  className="h-full bg-[#F97316]" 
                  style={{ width: `${(examData.correctAnswers / examData.totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-white">{examData.correctAnswers}/{examData.totalQuestions}</span>
            </div>
          </button>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="border-t border-white/10 p-4">
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="text-white">{chapter.title}</div>
                      <div className="text-sm text-gray-400">{chapter.timeRange}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="rounded-md bg-[#FDE047]/10 px-3 py-1 text-sm text-[#FDE047] hover:bg-[#FDE047]/20">
                        Review ↗
                      </button>
                      <span className="text-sm text-gray-400">
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
            className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
          >
            <RefreshCw className="h-5 w-5" />
            Try Again
          </button>
          <button 
            onClick={handleRetake}
            className="flex h-10 w-40 items-center justify-center gap-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
          >
            <RotateCcw className="h-5 w-5" />
            Retake Exam
          </button>
          <button 
            onClick={handleCreateNew}
            className="flex h-10 w-48 items-center justify-center gap-2 rounded-lg bg-[#FDFDFD] text-[#121212] hover:bg-[#FDFDFD]/90"
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