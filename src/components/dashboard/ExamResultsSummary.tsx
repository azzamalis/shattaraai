import React, { useState } from 'react';
import { ChevronRight, Share2, X } from 'lucide-react';
import Logo from '@/components/Logo';
import { useNavigate } from 'react-router-dom';
import { ShareExamModal } from './ShareExamModal';
import { CircularProgress } from './exam-results/CircularProgress';
import { ChapterBreakdown } from './exam-results/ChapterBreakdown';
import { ExamActionButtons } from './exam-results/ExamActionButtons';

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

export function ExamResultsSummary() {
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
    <div className="h-full bg-background">
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

      {/* Main Content - Reduce top padding */}
      <main className="container mx-auto max-w-4xl px-6 pt-16">
        {/* Title - Add 1rem top padding */}
        <h1 className="mb-4 pt-4 text-center text-3xl font-bold text-foreground">
          Keep up the momentum!
        </h1>

        {/* Stats Row - Reduce margin */}
        <div className="mb-4 flex items-center justify-center gap-16">
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

        {/* Preview Link - Reduce margin */}
        <div className="mb-4 text-center">
          <button className="text-sm text-muted-foreground underline hover:text-foreground">
            Preview Exam 1
          </button>
        </div>

        {/* Content Breakdown - Add padding adjustment */}
        <div className="pb-4">
          <ChapterBreakdown chapters={chapters} examData={examData} />
        </div>

        {/* Action Buttons - Ensure proper spacing */}
        <div className="mt-4">
          <ExamActionButtons
            onTryAgain={handleTryAgain}
            onRetake={handleRetake}
            onCreateNew={handleCreateNew}
          />
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
