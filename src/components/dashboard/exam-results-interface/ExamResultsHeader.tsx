
import React from 'react';
import { Share2, MessageCircle } from 'lucide-react';

interface ExamResultsHeaderProps {
  totalQuestions: number;
  onOpenChat: () => void;
}

export function ExamResultsHeader({ totalQuestions, onOpenChat }: ExamResultsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Empty space for alignment */}
        <div className="w-24"></div>
        
        {/* Center: Progress Bar (completed) */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
          <div className="h-2 w-96 rounded-full bg-border">
            <div className="h-full w-full rounded-full bg-primary"></div>
          </div>
          <span className="text-sm text-muted-foreground">{totalQuestions}</span>
        </div>
        
        {/* Right: Space Chat Button */}
        <button 
          onClick={onOpenChat}
          className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm hover:bg-accent/80"
        >
          <MessageCircle className="h-4 w-4" />
          Space Chat
        </button>
      </div>
    </header>
  );
}
