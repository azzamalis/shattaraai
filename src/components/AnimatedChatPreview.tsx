import React from 'react';
import { Send } from 'lucide-react';
import AnimatedTextCycle from './ui/animated-text-cycle';
const AnimatedChatPreview = () => {
  const tasks = ["help me prepare for my exam", "explain this concept to me", "create flashcards from my notes", "generate a study plan", "summarize this content", "quiz me on this topic", "translate this text", "help with my research"];
  return <div className="relative max-w-lg mx-auto">
      {/* Chat Input Container */}
      <div className="bg-card/75 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-2xl">
        <div className="flex items-center gap-3 bg-muted/90 rounded-xl px-4 py-3 h-12">
          <div className="flex-1 text-foreground/70 text-sm overflow-hidden">
            <span className="whitespace-nowrap">
              Ask Shattara AI to{' '}
              <AnimatedTextCycle words={tasks} interval={3000} className="text-foreground font-medium" />
            </span>
          </div>
          <button className="flex-shrink-0 p-2 text-foreground/70 hover:text-foreground transition-colors rounded-lg hover:bg-muted">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl blur-xl -z-10 scale-105"></div>
    </div>;
};
export default AnimatedChatPreview;